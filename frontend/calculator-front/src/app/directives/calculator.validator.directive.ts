import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CalculatorComponentValue } from '../models/calculatorValue.model';

export const validatorCalculatorComponent = ():ValidatorFn => {
    return (control:AbstractControl) : ValidationErrors | null => {

        const componentValue: CalculatorComponentValue = control.value;

        if (!componentValue) {
            return null;
        }

        const hasInputValue = !!componentValue.value;
        const hasCards = !!componentValue.cards && componentValue.cards.length > 0;
        const componentValid = hasInputValue && hasCards;

        return componentValid ? null : {cardsUnavailable:true};
    }
}