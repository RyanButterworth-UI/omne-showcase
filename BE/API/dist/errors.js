export class SimulatedFailureError extends Error {
    constructor() {
        super("Synthetic failure injected for dashboard error-handling validation.");
        this.name = "SimulatedFailureError";
    }
}
export class DataAccessError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = "DataAccessError";
    }
}
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
