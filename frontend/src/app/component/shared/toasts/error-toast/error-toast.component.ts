import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorService} from '../../../../services/messages/error/error.service';
import {ToastService} from '../toastservice/toast.service';
import {ApplicationError} from '../../../../client/models/messages/message.model';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.css',
})

export class ErrorToastComponent implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private errorService: ErrorService = inject(ErrorService);
  private toastService: ToastService = inject(ToastService);

  message: string | null = null;
  status?: number;
  visible: boolean = false;
  top: number = 80;

  ngOnInit(): void {
    this.toastService.topPosition$.subscribe((position: number): void => {
      this.top = position;
      this.cdr.markForCheck();
    })

    this.errorService.error$.subscribe((error: ApplicationError): void => {
      this.message = error.message;
      this.status = error.status;
      this.visible = true;
      this.cdr.markForCheck();

      setTimeout((): void => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 4000);
    });
  }
}
