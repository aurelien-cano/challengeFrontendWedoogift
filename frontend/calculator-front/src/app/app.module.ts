import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { NgbModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalPromptComponent as ModalPromptComponent } from './components/modal/modal.component';
import { MontantCardsPipe } from './pipes/montant.pipe';
import { ToasterComponent } from './components/toaster/toaster.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    ModalPromptComponent,
    MontantCardsPipe,
    ToasterComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [ ModalPromptComponent, ToasterComponent ]
})
export class AppModule { }
