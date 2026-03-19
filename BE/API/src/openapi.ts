import { createRequire } from "node:module";
import path from "node:path";
import type { Request, Response } from "express";

type OpenApiReference = {
  $ref: string;
};

type OpenApiSchema = {
  type?: "array" | "boolean" | "integer" | "number" | "object" | "string";
  format?: string;
  description?: string;
  nullable?: boolean;
  enum?: string[];
  properties?: Record<string, OpenApiReference | OpenApiSchema>;
  items?: OpenApiReference | OpenApiSchema;
  required?: string[];
  additionalProperties?: boolean;
  minimum?: number;
  maximum?: number;
  default?: boolean | number | string;
};

type OpenApiParameter = {
  name: string;
  in: "query";
  required: boolean;
  description?: string;
  schema: OpenApiSchema;
};

type OpenApiResponse = {
  description: string;
  content?: {
    "application/json": {
      schema: OpenApiReference | OpenApiSchema;
    };
  };
};

type OpenApiOperation = {
  tags?: string[];
  summary: string;
  description?: string;
  parameters?: OpenApiParameter[];
  responses: Record<string, OpenApiResponse>;
};

type OpenApiDocument = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
  paths: Record<
    string,
    {
      get: OpenApiOperation;
    }
  >;
  components: {
    schemas: Record<string, OpenApiSchema>;
  };
};

type CreateOpenApiDocumentOptions = {
  serverUrl?: string;
};

const apiTitle = "@omne-showcase/api";
const apiVersion = "0.1.0";
const defaultDocsAssetPath = "/docs/assets";
const defaultSpecPath = "/openapi.json";
const require = createRequire(import.meta.url);

function ref(schemaName: string): OpenApiReference {
  return {
    $ref: `#/components/schemas/${schemaName}`,
  };
}

function objectSchema(
  properties: Record<string, OpenApiReference | OpenApiSchema>,
  optionalKeys: string[] = [],
): OpenApiSchema {
  return {
    type: "object",
    properties,
    required: Object.keys(properties).filter((key) => !optionalKeys.includes(key)),
    additionalProperties: false,
  };
}

function stringSchema(format?: string): OpenApiSchema {
  return format
    ? {
        type: "string",
        format,
      }
    : {
        type: "string",
      };
}

function nullableStringSchema(format?: string): OpenApiSchema {
  return {
    ...stringSchema(format),
    nullable: true,
  };
}

function integerSchema(options: Partial<OpenApiSchema> = {}): OpenApiSchema {
  return {
    type: "integer",
    ...options,
  };
}

function numberSchema(options: Partial<OpenApiSchema> = {}): OpenApiSchema {
  return {
    type: "number",
    ...options,
  };
}

function booleanSchema(): OpenApiSchema {
  return {
    type: "boolean",
  };
}

function arraySchema(items: OpenApiReference | OpenApiSchema): OpenApiSchema {
  return {
    type: "array",
    items,
  };
}

function jsonResponse(schema: OpenApiReference | OpenApiSchema): OpenApiResponse {
  return {
    description: "JSON response",
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

function createSchemas(): Record<string, OpenApiSchema> {
  const inventoryAllocationProperties = {
    id: stringSchema("uuid"),
    materialId: stringSchema("uuid"),
    materialCode: stringSchema(),
    materialName: stringSchema(),
    lotNumber: stringSchema(),
    warehouseCode: stringSchema(),
    binLocation: stringSchema(),
    quantityAllocated: numberSchema(),
    unitCost: numberSchema(),
    totalCost: numberSchema(),
    expiryDate: stringSchema("date"),
  };

  const qualityCheckProperties = {
    id: stringSchema("uuid"),
    checkType: stringSchema(),
    inspectorId: stringSchema("uuid"),
    inspectorName: stringSchema(),
    result: stringSchema(),
    defectCode: stringSchema(),
    defectDescription: stringSchema(),
    sampleSize: integerSchema(),
    defectCount: integerSchema(),
    checkedAt: stringSchema("date"),
  };

  const downtimeEventProperties = {
    id: stringSchema("uuid"),
    reasonCode: stringSchema(),
    reasonDescription: stringSchema(),
    startTime: stringSchema("date"),
    endTime: stringSchema("date"),
    durationMinutes: integerSchema(),
    severity: stringSchema(),
    resolvedBy: stringSchema(),
  };

  const productionStepProperties = {
    id: stringSchema("uuid"),
    stepNumber: integerSchema(),
    stepName: stringSchema(),
    workCenterCode: stringSchema(),
    status: stringSchema(),
    plannedDurationMinutes: integerSchema(),
    actualDurationMinutes: integerSchema(),
    assignedOperator: stringSchema(),
    startedAt: stringSchema("date"),
    completedAt: stringSchema("date"),
  };

  const shipmentProperties = {
    id: stringSchema("uuid"),
    shipmentNumber: stringSchema(),
    customerId: stringSchema("uuid"),
    customerName: stringSchema(),
    dispatchDate: stringSchema("date"),
    deliveryDate: stringSchema("date"),
    carrierName: stringSchema(),
    trackingNumber: stringSchema(),
    quantityShipped: integerSchema(),
    shippingStatus: stringSchema(),
  };

  const dashboardScalarProperties = {
    id: stringSchema("uuid"),
    plantCode: stringSchema(),
    plantName: stringSchema(),
    siteRegion: stringSchema(),
    country: stringSchema(),
    productionLineId: stringSchema("uuid"),
    productionLineCode: stringSchema(),
    productionLineName: stringSchema(),
    machineId: stringSchema("uuid"),
    machineCode: stringSchema(),
    machineName: stringSchema(),
    machineType: stringSchema(),
    workOrderId: stringSchema("uuid"),
    workOrderNumber: stringSchema(),
    batchNumber: stringSchema(),
    productId: stringSchema("uuid"),
    productSku: stringSchema(),
    productName: stringSchema(),
    productCategory: stringSchema(),
    unitOfMeasure: stringSchema(),
    shiftCode: stringSchema(),
    shiftName: stringSchema(),
    operatorId: stringSchema("uuid"),
    operatorName: stringSchema(),
    supervisorId: stringSchema("uuid"),
    supervisorName: stringSchema(),
    status: stringSchema(),
    priority: stringSchema(),
    plannedStartTime: stringSchema("date"),
    plannedEndTime: stringSchema("date"),
    actualStartTime: nullableStringSchema("date"),
    actualEndTime: nullableStringSchema("date"),
    plannedUnits: integerSchema(),
    producedUnits: integerSchema(),
    goodUnits: integerSchema(),
    scrapUnits: integerSchema(),
    reworkUnits: integerSchema(),
    downtimeMinutes: integerSchema(),
    runtimeMinutes: integerSchema(),
    availabilityPercent: numberSchema(),
    performancePercent: numberSchema(),
    qualityPercent: numberSchema(),
    oeePercent: numberSchema(),
    cycleTimeSeconds: numberSchema(),
    targetCycleTimeSeconds: numberSchema(),
    temperatureCelsius: numberSchema(),
    humidityPercent: numberSchema(),
    energyConsumptionKwh: numberSchema(),
    lastMaintenanceDate: nullableStringSchema("date"),
    nextMaintenanceDate: nullableStringSchema("date"),
    maintenanceRequired: booleanSchema(),
    qualityCheckPassed: booleanSchema(),
    blockedReason: nullableStringSchema(),
    comments: nullableStringSchema(),
    createdAt: stringSchema("date"),
    updatedAt: stringSchema("date"),
    newArrayValue: arraySchema(stringSchema()),
  };

  const dashboardListItemProperties = {
    id: stringSchema("uuid"),
    plantName: stringSchema(),
    country: stringSchema(),
    productionLineName: stringSchema(),
    machineName: stringSchema(),
    workOrderNumber: stringSchema(),
    productName: stringSchema(),
    status: stringSchema(),
    priority: stringSchema(),
    updatedAt: stringSchema("date"),
    oeePercent: numberSchema(),
    qualityCheckPassed: booleanSchema(),
    maintenanceRequired: booleanSchema(),
  };

  return {
    InventoryAllocation: objectSchema(inventoryAllocationProperties),
    QualityCheck: objectSchema(qualityCheckProperties),
    DowntimeEvent: objectSchema(downtimeEventProperties),
    ProductionStep: objectSchema(productionStepProperties),
    Shipment: objectSchema(shipmentProperties),
    DashboardListItem: objectSchema(dashboardListItemProperties),
    DashboardListResponse: objectSchema({
      items: arraySchema(ref("DashboardListItem")),
      page: integerSchema({
        minimum: 1,
      }),
      pageSize: integerSchema({
        minimum: 1,
        maximum: 100,
      }),
      total: integerSchema({
        minimum: 0,
      }),
      totalPages: integerSchema({
        minimum: 0,
      }),
    }),
    DashboardDetailResponse: objectSchema({
      ...dashboardScalarProperties,
      inventoryAllocations: arraySchema(ref("InventoryAllocation")),
      qualityChecks: arraySchema(ref("QualityCheck")),
      downtimeEvents: arraySchema(ref("DowntimeEvent")),
      productionSteps: arraySchema(ref("ProductionStep")),
      shipments: arraySchema(ref("Shipment")),
    }),
    HealthStatus: objectSchema({
      service: stringSchema(),
      status: {
        type: "string",
        enum: ["ok", "degraded"],
      },
      database: objectSchema(
        {
          status: {
            type: "string",
            enum: ["ok", "unavailable"],
          },
          connected: booleanSchema(),
          message: stringSchema(),
        },
        ["message"],
      ),
      failureRate: numberSchema({
        minimum: 0,
        maximum: 1,
      }),
      seededRecordCount: integerSchema({
        minimum: 0,
      }),
    }),
    ErrorResponse: objectSchema({
      error: stringSchema(),
      message: stringSchema(),
    }),
  };
}

function getForwardedProtocol(request: Request) {
  const value = request.headers["x-forwarded-proto"];
  const headerValue = Array.isArray(value) ? value[0] : value;

  return headerValue?.split(",")[0]?.trim();
}

function resolveServerUrl(request: Request) {
  const host = request.get("host");

  if (!host) {
    return undefined;
  }

  const protocol = getForwardedProtocol(request) ?? request.protocol ?? "http";

  return `${protocol}://${host}`;
}

export function createOpenApiDocument(
  options: CreateOpenApiDocumentOptions = {},
): OpenApiDocument {
  return {
    openapi: "3.0.3",
    info: {
      title: apiTitle,
      version: apiVersion,
      description:
        "OpenAPI specification for the OMNE showcase dashboard backend.",
    },
    servers: options.serverUrl
      ? [
          {
            url: options.serverUrl,
          },
        ]
      : [],
    tags: [
      {
        name: "System",
        description: "Health and operational endpoints.",
      },
      {
        name: "Dashboard",
        description: "Dashboard data endpoints consumed by the frontend.",
      },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["System"],
          summary: "Get API health",
          description:
            "Returns the API health status along with database connectivity details.",
          responses: {
            "200": {
              ...jsonResponse(ref("HealthStatus")),
              description: "API and database are healthy.",
            },
            "503": {
              ...jsonResponse(ref("HealthStatus")),
              description: "API is running but the database is unavailable.",
            },
          },
        },
      },
      "/api/dashboard-data": {
        get: {
          tags: ["Dashboard"],
          summary: "Get dashboard detail",
          description:
            "Returns the latest dashboard record when no id is supplied, or a specific record when the id query parameter is provided.",
          parameters: [
            {
              name: "id",
              in: "query",
              required: false,
              description: "Optional production order id to fetch.",
              schema: stringSchema("uuid"),
            },
          ],
          responses: {
            "200": {
              ...jsonResponse(ref("DashboardDetailResponse")),
              description: "Dashboard detail payload.",
            },
            "400": {
              ...jsonResponse(ref("ErrorResponse")),
              description: "The provided id is not a valid UUID.",
            },
            "404": {
              ...jsonResponse(ref("ErrorResponse")),
              description: "The requested dashboard record was not found.",
            },
            "500": {
              ...jsonResponse(ref("ErrorResponse")),
              description: "A database request failed.",
            },
            "503": {
              ...jsonResponse(ref("ErrorResponse")),
              description: "A simulated failure was injected.",
            },
          },
        },
      },
      "/api/dashboard-data/list": {
        get: {
          tags: ["Dashboard"],
          summary: "List dashboard records",
          description:
            "Returns a paginated list of dashboard records for summary views.",
          parameters: [
            {
              name: "page",
              in: "query",
              required: false,
              description: "1-based page number.",
              schema: integerSchema({
                minimum: 1,
                default: 1,
              }),
            },
            {
              name: "pageSize",
              in: "query",
              required: false,
              description: "Page size capped at 100 records.",
              schema: integerSchema({
                minimum: 1,
                maximum: 100,
                default: 25,
              }),
            },
          ],
          responses: {
            "200": {
              ...jsonResponse(ref("DashboardListResponse")),
              description: "Paginated dashboard summary response.",
            },
            "400": {
              ...jsonResponse(ref("ErrorResponse")),
              description: "Page or pageSize was invalid.",
            },
            "500": {
              ...jsonResponse(ref("ErrorResponse")),
              description: "A database request failed.",
            },
          },
        },
      },
    },
    components: {
      schemas: createSchemas(),
    },
  };
}

export function createOpenApiHandler(options: CreateOpenApiDocumentOptions = {}) {
  return (request: Request, response: Response) => {
    response.json(
      createOpenApiDocument({
        serverUrl: options.serverUrl ?? resolveServerUrl(request),
      }),
    );
  };
}

export function getSwaggerUiAssetPath() {
  const packageJsonPath = require.resolve("swagger-ui-dist/package.json");

  return path.dirname(packageJsonPath);
}

type CreateDocsHandlerOptions = {
  docsAssetPath?: string;
  specPath?: string;
};

function createDocsHtml({
  docsAssetPath = defaultDocsAssetPath,
  specPath = defaultSpecPath,
}: CreateDocsHandlerOptions = {}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${apiTitle} Docs</title>
    <link rel="stylesheet" href="${docsAssetPath}/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow-y: scroll;
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        background: #f3f5f7;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${docsAssetPath}/swagger-ui-bundle.js"></script>
    <script src="${docsAssetPath}/swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "${specPath}",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset,
        ],
        layout: "StandaloneLayout",
      });
    </script>
  </body>
</html>
`;
}

export function createDocsHandler(options: CreateDocsHandlerOptions = {}) {
  return (_request: Request, response: Response) => {
    response.type("html").send(createDocsHtml(options));
  };
}
