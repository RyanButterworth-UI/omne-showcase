import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Request, Response } from "express";
import {
  createDocsHandler,
  createOpenApiDocument,
  createOpenApiHandler,
} from "./openapi.js";

function createMockResponse() {
  const state: {
    statusCode: number;
    body: unknown;
    contentType: string | undefined;
  } = {
    statusCode: 200,
    body: undefined,
    contentType: undefined,
  };

  const response = {
    status(code: number) {
      state.statusCode = code;
      return response;
    },
    type(value: string) {
      state.contentType = value;
      return response;
    },
    json(payload: unknown) {
      state.body = payload;
      return response;
    },
    send(payload: unknown) {
      state.body = payload;
      return response;
    },
  };

  return {
    response: response as unknown as Response,
    state,
  };
}

describe("createOpenApiDocument", () => {
  test("documents the health and dashboard endpoints with reusable schemas", () => {
    const document = createOpenApiDocument({
      serverUrl: "http://localhost:4001",
    });

    assert.equal(document.openapi, "3.0.3");
    assert.deepEqual(document.servers, [
      {
        url: "http://localhost:4001",
      },
    ]);

    assert.ok(document.paths["/health"]);
    assert.ok(document.paths["/api/dashboard-data"]);
    assert.ok(document.paths["/api/dashboard-data/list"]);

    const getDashboardOperation = document.paths["/api/dashboard-data"].get;
    const idParameter = getDashboardOperation.parameters?.find(
      (parameter) => parameter.name === "id",
    );

    assert.equal(idParameter?.in, "query");
    assert.equal(idParameter?.required, false);
    assert.deepEqual(idParameter?.schema, {
      type: "string",
      format: "uuid",
    });
    assert.equal(
      getDashboardOperation.responses["200"].content["application/json"].schema.$ref,
      "#/components/schemas/DashboardDetailResponse",
    );

    const listDashboardOperation = document.paths["/api/dashboard-data/list"].get;
    const pageSizeParameter = listDashboardOperation.parameters?.find(
      (parameter) => parameter.name === "pageSize",
    );

    assert.equal(pageSizeParameter?.schema.type, "integer");
    assert.equal(pageSizeParameter?.schema.default, 25);
    assert.equal(pageSizeParameter?.schema.maximum, 100);
    assert.equal(
      listDashboardOperation.responses["200"].content["application/json"].schema.$ref,
      "#/components/schemas/DashboardListResponse",
    );

    const detailSchema = document.components.schemas.DashboardDetailResponse;

    assert.equal(detailSchema.type, "object");
    assert.equal(detailSchema.properties.inventoryAllocations.type, "array");
    assert.equal(
      detailSchema.properties.inventoryAllocations.items.$ref,
      "#/components/schemas/InventoryAllocation",
    );
    assert.equal(detailSchema.properties.actualEndTime.nullable, true);

    const errorSchema = document.components.schemas.ErrorResponse;

    assert.equal(errorSchema.type, "object");
    assert.deepEqual(errorSchema.required, ["error", "message"]);
  });
});

describe("createOpenApiHandler", () => {
  test("returns the generated document with a request-aware server url", () => {
    const handler = createOpenApiHandler();
    const { response, state } = createMockResponse();
    const request = {
      protocol: "https",
      get(headerName: string) {
        return headerName.toLowerCase() === "host" ? "api.example.com" : undefined;
      },
      headers: {},
    } as unknown as Request;

    handler(request, response);

    assert.equal(state.statusCode, 200);
    assert.equal(
      (state.body as { servers: Array<{ url: string }> }).servers[0]?.url,
      "https://api.example.com",
    );
  });
});

describe("createDocsHandler", () => {
  test("returns a Swagger UI html page that points at the generated spec", () => {
    const handler = createDocsHandler();
    const { response, state } = createMockResponse();

    handler({} as Request, response);

    assert.equal(state.statusCode, 200);
    assert.equal(state.contentType, "html");
    assert.match(state.body as string, /SwaggerUIBundle/);
    assert.match(state.body as string, /\/openapi\.json/);
    assert.match(state.body as string, /\/docs\/assets\/swagger-ui\.css/);
    assert.match(
      state.body as string,
      /\/docs\/assets\/swagger-ui-standalone-preset\.js/,
    );
  });
});
