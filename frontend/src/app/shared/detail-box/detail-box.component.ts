import {Component, EventEmitter, inject, Input, model, Output} from '@angular/core';

@Component({
  selector: 'app-detail-box',
  standalone: true,
  templateUrl: './detail-box.component.html',
  styleUrl: './detail-box.component.css',
})
export class DetailBoxComponent {
  @Input() title!: string;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
