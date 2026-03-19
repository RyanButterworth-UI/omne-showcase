import { Router } from "express";
import { fetchDashboardData, MissingUpstreamTokenError, } from "../services/mockfast.service.js";
export const dataRouter = Router();
dataRouter.get("/dashboard-data", async (_request, response) => {
    try {
        const result = await fetchDashboardData();
        response.status(result.status).json(result.data);
    }
    catch (error) {
        if (error instanceof MissingUpstreamTokenError) {
            response.status(503).json({
                error: "missing_upstream_token",
                message: "UPSTREAM_BEARER_TOKEN is required before the API can proxy dashboard data.",
            });
            return;
        }
        const status = typeof error === "object" && error !== null && "status" in error
            ? Number(error.status)
            : 502;
        const message = typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Unexpected upstream proxy failure";
        const upstreamBody = typeof error === "object" && error !== null && "upstreamBody" in error
            ? error.upstreamBody
            : undefined;
        response.status(status).json({
            error: "upstream_request_failed",
            message,
            upstreamBody,
        });
    }
});
