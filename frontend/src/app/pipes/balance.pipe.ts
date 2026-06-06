import {Pipe, PipeTransform} from '@angular/core';


@Pipe({ name: 'balance' })
export class BalancePipe implements PipeTransform {
  transform(amount: number): string {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    return formatter.format(amount / 100);
  }
}
