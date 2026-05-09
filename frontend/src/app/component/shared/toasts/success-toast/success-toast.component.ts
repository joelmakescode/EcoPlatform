import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuccessService} from '../../../../services/messages/success/success.service';
import {ToastService} from '../toastservice/toast.service';
import {ApplicationSuccess} from '../../../../client/models/messages/message.model';

@Component({
  selector: 'app-success-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-toast.component.html',
  styleUrl: './success-toast.component.css',
})
export class SuccessToastComponent implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private successService: SuccessService = inject(SuccessService);
  private toastService: ToastService = inject(ToastService);

  message: string | null = null;
  visible: boolean = false;
  top: number = 80;

  ngOnInit(): void {
    this.toastService.topPosition$.subscribe((position: number): void => {
      this.top = position;
      this.cdr.markForCheck();
    })

    this.successService.success$.subscribe((success: ApplicationSuccess): void => {
      this.message = success.message;
      this.visible = true;
      this.cdr.markForCheck();

      setTimeout((): void => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 3000)
    })
  }
}
