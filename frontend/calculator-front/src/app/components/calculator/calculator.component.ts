import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgbModal, NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { take } from "rxjs";
import { CalculatorResponseHelper, CalculatorServiceResponse, CalculatorResponseCaseEnum } from "src/app/api/calculator.api";
import { CalculatorService } from "src/app/api/calculator.service";
import { DEFAULT_SHOP_ID } from "src/app/Constants/Globals";
import { CalculatorComponentValue } from "src/app/models/calculatorValue.model";
import { ModalPromptComponent } from "../modal/modal.component";
import { ToasterService } from "../toaster/toaster.service";

@Component({
    selector: 'calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => (CalculatorComponent)),
        multi: true
      }
    ]
  })
  export class CalculatorComponent implements OnInit, ControlValueAccessor {

    @Output() askedAmount: EventEmitter<number> = new EventEmitter<number>();
    private _lastUsedValue!: number; 
    private _inputValue!: number; 
    private _isModified!: boolean;
    private _availableCards!: number[];
    public onChange: any = () => {};
    public onTouched: any = () => {};

    constructor(private calculatorService: CalculatorService, private modalService: NgbModal, private toasterService: ToasterService) {}
   
    writeValue(componentValue: CalculatorComponentValue): void {
      this.availableCards = componentValue.cards;
      this.inputValue = componentValue.value;
    }
  
    registerOnChange(fn: any){
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any){
      this.onTouched = fn;
    }

    ngOnInit(): void {
      this.isModified = false;
    }
  
    public handleValueChanged(){
      // We want the button validate to be enable only if the curent value is different than the last validation
      this.isModified =  this.lastUsedValue !== this.inputValue;
      if (this.isModified){
        this.resetComponent();
      }
    }
    public submitAmount(){
      this.lastUsedValue = this.inputValue;
      console.log('submitAmount(): ', this.inputValue);
      this.askedAmount.emit(this.inputValue);
      this.calculatorService.getNeededCards$(DEFAULT_SHOP_ID, this.inputValue).pipe(
        take(1)
      ).subscribe((response: CalculatorServiceResponse) => {
        console.log('service response: ', response);
        switch (CalculatorResponseHelper.getCurentResponseCase(response)) {
          case CalculatorResponseCaseEnum.EQUAL:
            this.availableCards = response.equal!.cards;
            this.emitCurentValue();
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
      this.inputValue = newAmout;
      this.submitAmount();
      this.isModified = false;
    }

    public promptUser(floorValue: number, ceilValue: number){
      console.log('promptUser(): floorValue -> ', floorValue, ' / ceilValue -> ', ceilValue);
      const modalPrompt = this.modalService.open(ModalPromptComponent);
      (modalPrompt.componentInstance as ModalPromptComponent).initModale(floorValue, ceilValue);
      (modalPrompt.componentInstance as ModalPromptComponent).selectedData.pipe(take(1)).subscribe((data) => this.autoUpdateAmout(data))
    }

    public getPreviousAmount(){
      this.getAmount(false);
    }
    
    public getNextAmount(){
      this.getAmount(true);
    }
    
    private resetComponent(){
      this.availableCards = [];
      this.emitCurentValue();
    }

    private getAmount(isRequiredAmountSuperiorToCurentOne: boolean){
      // If curent value is udefined or negativ, try with 0
      // else if required is next, try with curent +1 but if required is previous, try with curent - 1
      const askedValue: number = this.inputValue && this.inputValue > 0 ? (isRequiredAmountSuperiorToCurentOne ? this.inputValue + 1 : this.inputValue - 1) : 0
      this.calculatorService.getNeededCards$(DEFAULT_SHOP_ID, askedValue).pipe(
        take(1)
      ).subscribe((response: CalculatorServiceResponse) => {
        console.log('service response: ', response);
        // Tried to get previous value, but none available
        // either we're already lower or at minimum
        if ((!response.floor || response.floor.value === this.inputValue) && !isRequiredAmountSuperiorToCurentOne){
          this.toasterService.show('bg-danger text-light', 'Aucun montant inferieur disponible');
        }
        // Tried to get next value, but none available
        // either we're already higher or at maximum
        else if ((!response.ceil || response.ceil.value === this.inputValue) && isRequiredAmountSuperiorToCurentOne){
          this.toasterService.show('bg-danger text-light', 'Aucun montant superieur disponible');
        } else if (!isRequiredAmountSuperiorToCurentOne){
          this.inputValue = response.floor!.value;
          this.availableCards = response.floor!.cards;
          this.isModified = false;
          this.emitCurentValue();
        } else if (isRequiredAmountSuperiorToCurentOne){
          this.inputValue = response.ceil!.value;
          this.availableCards = response.ceil!.cards;
          this.isModified = false;
          this.emitCurentValue();
        }
      })
    }

    private emitCurentValue(){
      this.onChange({value: this.inputValue, cards: this.availableCards} as CalculatorComponentValue);
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

    get availableCards(): number[] {
      return this._availableCards;
    }
  
    set availableCards(availableCards: number[]) {
      this._availableCards = availableCards;
    }
  }