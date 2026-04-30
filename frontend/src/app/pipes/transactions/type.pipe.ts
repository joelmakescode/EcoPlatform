import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'type' })
export class TypePipe implements PipeTransform {
  transform(type: 'send' | 'request' | 'refund'): string {
    switch (type) {
      case "send": return 'Send';
      case "refund": return 'Refund';
      case "request": return 'Request';
      default: return type;
    }
  }
}
