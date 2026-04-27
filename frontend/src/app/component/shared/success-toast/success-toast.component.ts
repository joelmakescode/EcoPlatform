import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SuccessService} from '../../../services/messages/success/success.service';

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

  constructor(private successService: SuccessService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
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
