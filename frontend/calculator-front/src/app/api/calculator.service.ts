import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculatorServiceResponse } from './calculator.api';
import { DEFAULT_AUTH_HEADER } from '../Constants/Globals';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  constructor(private httpClient: HttpClient) {}

  getNeededCards$(storeNumber: number, amount: number): Observable<CalculatorServiceResponse> {
    
    return this.httpClient.get<CalculatorServiceResponse>(`http://localhost:3000/shop/${storeNumber}/search-combination?amount=${amount}`, { 'headers': DEFAULT_AUTH_HEADER });
  }
}