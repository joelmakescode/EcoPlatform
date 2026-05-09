import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {
  transform(value: number, senderId: number, currentId: number | null): string {
    let sign: string = '';

    if (currentId === senderId) {
      sign = '-';
    } else {
      sign = '+'
    }

    value = value / 100;

    return `${sign} $${value.toFixed(2)}`
  }
}
