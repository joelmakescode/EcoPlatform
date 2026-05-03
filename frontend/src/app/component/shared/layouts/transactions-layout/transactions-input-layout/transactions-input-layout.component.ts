import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UsernameInputComponent} from '../../../username-input/username-input.component';
import {NumberInputComponent} from '../../../number-input/number-input.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-transactions-input-layout',
  standalone: true,
  imports: [
    UsernameInputComponent,
    NumberInputComponent,
    FormsModule
  ],
  templateUrl: './transactions-input-layout.component.html',
  styleUrl: './transactions-input-layout.component.css',
})
export class TransactionsInputLayoutComponent {
  @Input() placeholderTitle!: string;
  @Input() placeholder!: string;
  @Input() infoMessage!: string;
  @Input() buttonMessage!: string;

  @Output() submit = new EventEmitter<{
    username: string;
    amount: number;
  }>();

  username: string = '';
  amount: number = 0;
  sendConfirmed: boolean = false;

  onSubmit() {
    if (!this.sendConfirmed) {
      return;
    }

    this.submit.emit({
      username: this.username,
      amount: this.amount
    })
  }
}
