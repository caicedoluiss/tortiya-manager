import type { ValidationError } from "./ValidationError";

export type ErrorResponse = {
    code: string;
    message: string;
    validationErrors?: Array<ValidationError>;
}