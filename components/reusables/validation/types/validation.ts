interface IfCondition {
    condition: string | ValueObject | undefined; // Allow the type to match
    required: boolean;
}
interface ValidationRule {
    usename?: string
    isObject?: boolean
    required?: boolean
    ifCondition?: IfCondition
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    [key: string]: any
    // [key: string]: boolean | string | IfCondition | undefined | unknown | any;
}

interface Validation {
    [key: string]: ValidationRule
}

interface Validations {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    [key: string]: any
    // [key: string]: ValidationRule[]
}

interface ValueObject {
    id?: string
    name?: string
    value?: string
}

interface Values {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    [key: string]: any
    // [key: string]: string | boolean | ValueObject | undefined | unknown // Replace with specific types if known
}

interface ValidationResult {
    validation_message: string
    validation_has_error: boolean
    validation_errors_array?: Array<Record<string, string>> | Values[]
    validation_errors: Record<string, string | { value: string }>
}

export type {
    Values,
    Validation,
    Validations,
    ValueObject,
    ValidationRule,
    ValidationResult,
}