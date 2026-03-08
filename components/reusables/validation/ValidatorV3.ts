import {
    Values,
    Validations,
    ValidationResult
} from './types/validation'
import ValidationRulesV3 from './ValidationRulesV3'
const ValidatorV3 = (validations: Validations, values: Values) => {
    const {
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
    } = ValidationRulesV3()
    const result: ValidationResult = {
        validation_errors: {},
        validation_errors_array: [],
        validation_has_error: false,
        validation_message: 'The given data was invalid.',
    }
    let aKeys = Object.keys(validations).sort()
    let bKeys = Object.keys(values).sort()
    aKeys = aKeys.filter(value => -1 !== bKeys.indexOf(value))
    bKeys = bKeys.filter(value => -1 !== aKeys.indexOf(value))
    const total = bKeys.length ? bKeys.length : 0
    let i: number
    const newArray: Record<string, string>[] = []
    let parentObj = {}
    for (i = 0; i < total; i++) {
        if (aKeys[i] === bKeys[i]) {
            if(Array.isArray(values[bKeys[i]])){
                let cKeys = validations[bKeys[i]].length ? Object.keys(validations[bKeys[i]][0]).sort() : []
                if(validations[aKeys[i]].length){
                    for (let keyindx_ = 0; keyindx_ < Object.keys(validations[aKeys[i]][0]).length; keyindx_++) {
                        parentObj = {
                            ...parentObj,
                            [cKeys[keyindx_]]: ''
                        }
                    }
                }
                values[bKeys[i]].forEach((obj: Record<string, string>, indx: number) => {
                    let dKeys = Object.keys(values[bKeys[i]][indx]).sort()
                    cKeys = cKeys.filter(value => -1 !== cKeys.indexOf(value))
                    dKeys = dKeys.filter(value => -1 !== dKeys.indexOf(value))
                    if(cKeys[indx] == dKeys[indx]){
                        const checkValidationRule = validations[aKeys[i]][indx]
                        dKeys.map((key, keyIndx) => {
                            if(key == dKeys[keyIndx]){
                                if((
                                    typeof (checkValidationRule[dKeys[keyIndx]]) !== 'undefined') &&
                                    checkValidationRule[dKeys[keyIndx]]?.required
                                ){
                                    // console.log(checkValidationRule[dKeys[keyIndx]])
                                    parentObj = {
                                        ...parentObj, 
                                        [key]: !obj[key]?.toString().trim().length ? (checkValidationRule[dKeys[keyIndx]].usename ? checkValidationRule[dKeys[keyIndx]].usename : key)+' is required' : ''
                                    }
                                    return parentObj
                                }
                                // console.log(checkValidationRule[dKeys[keyIndx]]?.ifCondition)
                                if((
                                    typeof (checkValidationRule[dKeys[keyIndx]]) !== 'undefined') &&
                                    checkValidationRule[dKeys[keyIndx]]?.ifCondition
                                ){
                                    if(checkValidationRule[dKeys[keyIndx]]?.ifCondition.condition){
                                        parentObj = {
                                            ...parentObj, 
                                            [key]: !obj[key]?.toString().trim().length ? (checkValidationRule[dKeys[keyIndx]].usename ? checkValidationRule[dKeys[keyIndx]].usename : key)+' is required' : ''
                                        }
                                    }else{
                                        parentObj = {
                                            ...parentObj, 
                                            [key]: ''
                                        }
                                    }
                                }
                            }
                        })
                    }
                    newArray[indx] = parentObj
                });
                
                const checkIfHasError = newArray.map((record) => {
                    return Object.values(record).every(val => !val) ? false : true
                })
                if(checkIfHasError.includes(true)){
                    result.validation_has_error = true
                    result.validation_errors_array = newArray
                }
            }

            // MIN LENGTH
            minLength(validations, values, bKeys[i], result)

            // MAX LENGTH
            maxLength(validations, values, bKeys[i], result)

            // GREATER THAN
            greaterThan(validations, values, bKeys[i], result)

            // LESS THAN
            lessThan(validations, values, bKeys[i], result)
            
            // CHECK IF EMAIL
            checkIfEmail(validations, values, bKeys[i], result)

            // CHECK IF VALID NUMBER
            checkIfValidNumber(validations, values, bKeys[i], result)
            
            // REQUIRED
            required(validations, values, bKeys[i], result)

            // IF CONDITION
            ifCondition(validations, values, bKeys[i], result)
            
            // COMPARE VALUES
            compareValue(validations, values, bKeys[i], result)

            // CHECK PATTERN
            checkPattern(validations, values, bKeys[i], result)
        }
    }
    return result;
}
export default ValidatorV3;