export interface CalculatorServiceResponse {
    equal?: CalculatorCardsValuesResponse;
    floor?: CalculatorCardsValuesResponse;
    ceil?: CalculatorCardsValuesResponse;
}

export interface CalculatorCardsValuesResponse {
    value: number;
    cards: number[];
}

export class CalculatorResponseHelper {
    static getCurentResponseCase = (serviceResponse: CalculatorServiceResponse): CalculatorResponseCaseEnum => {
        let ret: CalculatorResponseCaseEnum = CalculatorResponseCaseEnum.NO_DATA;
        if (serviceResponse.equal) {
            ret = CalculatorResponseCaseEnum.EQUAL;
        } else if (serviceResponse.floor && serviceResponse.ceil){
            ret = CalculatorResponseCaseEnum.BETWIN_MULTIPLE_AVAILABLE;
        } else if (serviceResponse.floor){
            ret = CalculatorResponseCaseEnum.HIGHER_THAN_MAXIMUM_AVAILABLE;
        } else if (serviceResponse.ceil){
            ret = CalculatorResponseCaseEnum.LOWER_THAN_MINIMUM_AVAILABLE;
        }
        return ret;
    };
}

export enum CalculatorResponseCaseEnum {
    EQUAL, BETWIN_MULTIPLE_AVAILABLE, HIGHER_THAN_MAXIMUM_AVAILABLE, LOWER_THAN_MINIMUM_AVAILABLE, NO_DATA
}