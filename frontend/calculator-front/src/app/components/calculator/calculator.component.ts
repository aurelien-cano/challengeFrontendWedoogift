import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { take } from "rxjs";
import { CalculatorResponseHelper, CalculatorServiceResponse, CalculatorResponseCaseEnum } from "src/app/api/calculator.api";
import { CalculatorService } from "src/app/api/calculator.service";
import { DEFAULT_SHOP_ID } from "src/app/Constants/Globals";
import { ModalPromptComponent } from "../modal/modal.component";

@Component({
    selector: 'calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css']
  })
  export class CalculatorComponent implements OnInit {

    @Output() askedAmount: EventEmitter<number> = new EventEmitter<number>();
    private _inputValue!: number; 
    private _lastUsedValue!: number; 
    private _isModified!: boolean;
    private _availableCards!: number[];
    private _calculatorForm!: FormGroup;

    constructor(private calculatorService: CalculatorService, private modalService: NgbModal, private cd: ChangeDetectorRef) {}

    ngOnInit(): void {
      this.calculatorForm = new FormGroup({
          inputCalculator: new FormControl(this.inputValue)
      });
      this.calculatorForm.get('inputCalculator')?.valueChanges.subscribe(x => {
        this.inputValue = x;
        this.isModified = this._lastUsedValue !== x;
        // this.cd.markForCheck();
        console.log('changed! -> ', x);
        console.log('this.isModified: -> ', this.isModified);
      })
      this.isModified = false;
    }
  
    public submitAmount(){
      this.lastUsedValue = this.inputValue;
      console.log('submit(): ', this.inputValue);
      this.askedAmount.emit(this.inputValue);
      this.calculatorService.getNeededCards$(DEFAULT_SHOP_ID, this.inputValue).pipe(
        take(1)
      ).subscribe((response: CalculatorServiceResponse) => {
        console.log('service response: ', response);
        switch (CalculatorResponseHelper.getCurentResponseCase(response)) {
          case CalculatorResponseCaseEnum.EQUAL:
            this.availableCards = response.equal!.cards;
            break;
          case CalculatorResponseCaseEnum.BETWIN_MULTIPLE_AVAILABLE:
            this.promptUser(response.floor!.value, response.ceil!.value)
            break;
          case CalculatorResponseCaseEnum.HIGHER_THAN_MAXIMUM_AVAILABLE:
            this.autoUpdateAmout(response.floor!.value);
            break;
          case CalculatorResponseCaseEnum.LOWER_THAN_MINIMUM_AVAILABLE:
            this.autoUpdateAmout(response.ceil!.value);
            break;
          case CalculatorResponseCaseEnum.NO_DATA:
            throw Error('No amount available from service response');
        }
      })
    }
  
    public autoUpdateAmout(newAmout: number){
      console.log('autoUpdateAmout(): old value -> ', this.inputValue, ' / new value -> ', newAmout);
      this.calculatorForm.get('inputCalculator')?.setValue(newAmout);
      // this.inputValue = newAmout;
      this.submitAmount();
      this.isModified = false;
    }

    public promptUser(floorValue: number, ceilValue: number){
      console.log('promptUser(): floorValue -> ', floorValue, ' / ceilValue -> ', ceilValue);
      const modalPrompt = this.modalService.open(ModalPromptComponent);
      (modalPrompt.componentInstance as ModalPromptComponent).initModale(floorValue, ceilValue);
      (modalPrompt.componentInstance as ModalPromptComponent).selectedData.pipe(take(1)).subscribe((data) => this.autoUpdateAmout(data))
    }

    get lastUsedValue(): number {
      return this._lastUsedValue;
    }
  
    set lastUsedValue(lastUsedValue: number) {
      this._lastUsedValue = lastUsedValue;
    }
    
    get inputValue(): number {
      return this._inputValue;
    }
  
    set inputValue(inputValue: number) {
      this._inputValue = inputValue;
    }

    get isModified(): boolean {
      return this._isModified;
    }
  
    set isModified(isModified: boolean) {
      this._isModified = isModified;
    }

    get calculatorForm(): FormGroup {
      return this._calculatorForm;
    }
  
    set calculatorForm(calculatorForm: FormGroup) {
      this._calculatorForm = calculatorForm;
    }

    get availableCards(): number[] {
      return this._availableCards;
    }
  
    set availableCards(availableCards: number[]) {
      this._availableCards = availableCards;
    }
  }