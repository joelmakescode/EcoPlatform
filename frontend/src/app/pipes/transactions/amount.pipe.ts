import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {
  transform(value: number, senderId: number, receiverId: number, currentId: number | null): string {
    let sign = '';

    if (currentId === senderId) {
      sign = '-';
    } else {
      sign = '+'
    }

    return `${sign} ${value.toFixed(2)}$`
  }
}
