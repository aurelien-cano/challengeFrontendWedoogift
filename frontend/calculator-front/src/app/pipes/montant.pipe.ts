import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'montantCard'
})
export class MontantCardsPipe implements PipeTransform {

  transform(value: number): string {
    // Return the formatted string
    return `${value},00 €`;
  }

}