   //Validatable Interface to define the validatable object
   export interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

//Validate method
export function validate(validatableInput: Validatable) {
    let isValid = true;
    
    //If input is required, check input value > 0
    if(validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    // If minLength is set, run check on string only else skip
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }

      // If maxLength is set, run check on string only else skip
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }

      // If minValue is not 0 and is a number
    if(validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }

      // If maxValue is not 0 and is a number
      if(validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }

    return isValid
}