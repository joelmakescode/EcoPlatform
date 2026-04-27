import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorService} from '../../../../services/messages/error/error.service';
import {ToastService} from '../toastservice/toast.service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.css',
})

export class ErrorToastComponent implements OnInit {
  message: string | null = null;
  status?: number;
  visible = false;
  top: number = 80;

  constructor(private errorService: ErrorService, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.toastService.topPosition$.subscribe(position => {
      this.top = position;
      this.cdr.markForCheck();
    })

    this.errorService.error$.subscribe(error => {
      this.message = error.message;
      this.status = error.status;
      this.visible = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.visible = false,
        this.cdr.markForCheck();
      }, 4000);
    });
  }
}
