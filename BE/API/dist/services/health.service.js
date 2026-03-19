function normalizeFailureRate(value) {
    if (Number.isNaN(value)) {
        return 0;
    }
    return Math.min(1, Math.max(0, value));
}
export function createHealthService(repository, options) {
    const failureRate = normalizeFailureRate(options.failureRate);
    return {
        async getStatus() {
            try {
                await repository.ping();
                const seededRecordCount = await repository.countProductionOrders();
                return {
                    service: "@omne-showcase/api",
                    status: "ok",
                    database: {
                        status: "ok",
                        connected: true,
                    },
                    failureRate,
                    seededRecordCount,
                };
            }
            catch (error) {
                return {
                    service: "@omne-showcase/api",
                    status: "degraded",
                    database: {
                        status: "unavailable",
                        connected: false,
                        message: error instanceof Error
                            ? error.message
                            : "Unexpected database health-check failure.",
                    },
                    failureRate,
                    seededRecordCount: 0,
                };
            }
        },
    };
}
