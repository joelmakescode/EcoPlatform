import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuccessService} from '../../../../services/messages/success/success.service';
import {ToastService} from '../toastservice/toast.service';

@Component({
  selector: 'app-success-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-toast.component.html',
  styleUrl: './success-toast.component.css',
})
export class SuccessToastComponent {
  message: string | null = null;
  visible: boolean = false;
  top: number = 80;

  constructor(private successService: SuccessService, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.toastService.topPosition$.subscribe(position => {
      this.top = position;
      this.cdr.markForCheck();
    })

    this.successService.success$.subscribe(success => {
      this.message = success.message;
      this.visible = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.visible = false;
        this.cdr.markForCheck();
      }, 3000)
    })
  }
}
