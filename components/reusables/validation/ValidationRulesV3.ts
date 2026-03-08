import {
    Values,
    ValidationRule,
    ValidationResult
} from './types/validation'
const ValidationRulesV3 = () => {
    let hasIfCondition = false
    const checkIfValidNumber = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (values[keyName].toString().trim().length && validations[keyName].validNumber) {
            if (!Number(values[keyName])) {
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is not a valid number'
            }
        }
        return result;
    }

    const required = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (validations[keyName]?.isObject) {
            if((hasIfCondition && validations[keyName].ifCondition?.condition && validations[keyName].ifCondition?.required)){
                if (!values[keyName].value.toString().trim().length || !values[keyName].id?.toString().trim()?.length) {
                    result.validation_has_error = true
                    result.validation_errors[keyName] = {
                        value: (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is required'
                    }
                }
            }
        }else{
            if (validations[keyName]?.required || (hasIfCondition && validations[keyName].ifCondition?.condition && validations[keyName].ifCondition?.required)) {
                if (!values[keyName].toString().trim().length || !values[keyName]) {
                    result.validation_has_error = true
                    result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is required'
                }
            }
        }
        return result;
    }

    const minLength = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (
            (values[keyName].toString().trim().length && validations[keyName].minLength) ||
            (hasIfCondition && validations[keyName].ifCondition?.condition && validations[keyName].ifCondition?.minLength)
        ) {
            if (
                (values[keyName].toString().trim().length < validations[keyName].minLength) ||
                (values[keyName].toString().trim().length < validations[keyName].ifCondition?.minLength)
            ) {
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is too short at least more than or equal to ' + (validations[keyName].minLength || validations[keyName].ifCondition?.minLength) + ' characters'
            }
        }
        return result;
    }

    const maxLength = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (
            (values[keyName].toString().trim().length && validations[keyName].maxLength) ||
            (hasIfCondition && validations[keyName].ifCondition?.condition && validations[keyName].ifCondition?.maxLength)
        ) {
            if (
                (values[keyName].toString().trim().length > validations[keyName].maxLength) ||
                (values[keyName].toString().trim().length > validations[keyName].ifCondition?.maxLength)
            ) {
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is too long at least less than or equal to ' + (validations[keyName].maxLength || validations[keyName].ifCondition?.maxLength) + ' characters'
            }
        }
        return result;
    }

    const greaterThan = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if(validations[keyName].greaterThan){
            if (Number(values[keyName]) < validations[keyName].greaterThan) {
                console.log('test')
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is too small at least greater than or equal to ' + validations[keyName].greaterThan
            }
        }
        return result;
    }

    const lessThan = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if(validations[keyName].lessThan){
            if (Number(values[keyName]) > validations[keyName].lessThan) {
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is too big at least less than or equal to ' + validations[keyName].lessThan
            }
        }
        return result;
    }

    const checkIfEmail = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (values[keyName].toString().trim().length && validations[keyName].email) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(values[keyName])) {
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' is not a valid email'
            }
        }
        return result;
    }
    
    const ifCondition = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (validations[keyName].ifCondition && Object.keys(validations[keyName].ifCondition).length) {
            if (validations[keyName].ifCondition?.condition) {
                hasIfCondition = true
                required(validations, values, keyName, result)
                minLength(validations, values, keyName, result)
                maxLength(validations, values, keyName, result)
            }
        }
        return result;
    }

    const compareValue = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (
            (values[keyName].toString().trim().length && validations[keyName].confirm)
        ) {
            if (
                (values[keyName] !== validations[keyName].confirm)
            ) {
                result.validation_has_error = true
                result.validation_errors[keyName] = (validations[keyName].usename ? validations[keyName].usename : keyName) + ' not match!'
            }
        }
        return result;
    }

    const checkPattern = (validations: ValidationRule, values: Values, keyName: string, result: ValidationResult) => {
        if (
            (values[keyName].toString().trim().length && validations[keyName].regex)
        ) {
            if (!validations[keyName].regex.pattern.test(values[keyName])) {
                result.validation_has_error = true
                result.validation_errors[keyName] = validations[keyName].regex.message
            }
        }
        return result;
    }

    return {
        required,
        minLength,
        maxLength,
        greaterThan,
        lessThan,
        checkIfEmail,
        checkIfValidNumber,
        ifCondition,
        compareValue,
        checkPattern
    }
}
export default ValidationRulesV3