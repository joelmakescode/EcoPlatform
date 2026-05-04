import {Pipe, PipeTransform} from '@angular/core';


@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'rejected': return 'Rejected';
      case 'refund': return 'Refunded';
      default: return status;
    }
  }
}
