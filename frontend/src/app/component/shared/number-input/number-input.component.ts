import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-number-input',
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css',
})
export class NumberInputComponent {
  value: number = 0;

  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.value = value;
    this.valueChange.emit(value);
  }
}
