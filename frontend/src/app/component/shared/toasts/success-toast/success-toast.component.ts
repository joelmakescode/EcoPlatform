import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastService} from '../toastservice/toast.service';
import {ApplicationSuccess} from '../../../../client/models/messages/message.model';
import {MessageService} from '../../../../services/messages/message.service';

@Component({
  selector: 'app-success-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-toast.component.html',
  styleUrl: './success-toast.component.css',
})
export class SuccessToastComponent implements OnInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);
  private toastService: ToastService = inject(ToastService);

  message: string | null = null;
  visible: boolean = false;
  top: number = 80;

  ngOnInit(): void {
    this.toastService.topPosition$.subscribe((position: number): void => {
      this.top = position;
      this.cdr.markForCheck();
    })

    this.messageService.success$.subscribe((success: ApplicationSuccess): void => {
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
