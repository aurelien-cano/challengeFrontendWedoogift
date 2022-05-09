import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from './components/toaster/toaster.service';
import { PARTNERS_ARRAY } from './Constants/Globals';
import { validatorCalculatorComponent } from './directives/calculator.validator.directive';
import { CalculatorComponentValue } from './models/calculatorValue.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _calculatorForm!: FormGroup;
  private _partnerName!: string;
  private _calculatorValue!: CalculatorComponentValue;

  constructor(private toasterService: ToasterService) {}

  ngOnInit(): void {
    this.calculatorForm = new FormGroup({
      inputCalculatorComponent: new FormControl('', [Validators.required, validatorCalculatorComponent()]),
      partnerName: new FormControl('', [Validators.required])
    });
    this.calculatorForm.valueChanges.subscribe(x => {
      console.log('changed! -> ', x);
    })
  }

  submit(){
    if (this.calculatorForm.valid){
      this.toasterService.show('bg-success text-light', 'Formulaire enregistré!');
    } else {
      const errorText = this.calculatorForm.controls['inputCalculatorComponent'].errors ? 'Montant requis' : 'Nom du partenaire requis';
      this.toasterService.show('bg-danger text-light', errorText);
    }
  }

  public logReceivedAmount(event: number){
    console.log(`appComponent -> recived asked amount of: ${event}`);
  }

  get calculatorForm(): FormGroup {
    return this._calculatorForm;
  }

  set calculatorForm(calculatorForm: FormGroup) {
    this._calculatorForm = calculatorForm;
  }

  get partnerName(): string {
    return this._partnerName;
  }

  set partnerName(partnerName: string) {
    this._partnerName = partnerName;
  }
  get calculatorValue(): CalculatorComponentValue {
    return this._calculatorValue;
  }

  set calculatorValue(calculatorValue: CalculatorComponentValue) {
    this._calculatorValue = calculatorValue;
  }

  get partners(): readonly string[] {
    return PARTNERS_ARRAY;
  }
}
