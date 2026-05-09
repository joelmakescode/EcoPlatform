import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserSuggestion} from '../../../client/models/user-suggestions/user-suggestion.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-username-input',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './username-input.component.html',
  styleUrl: './username-input.component.css',
})
export class UsernameInputComponent {
  @Input() placeholderTitle!: string;
  @Input() placeholder!: string;
  @Input() disabled: boolean = false;
  @Input() suggestions: UserSuggestion[] = [];

  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() userSelected: EventEmitter<UserSuggestion> = new EventEmitter<UserSuggestion>();
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  value: string = '';
  showSuggestions: boolean = false;

  onInput(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.value = value
    this.showSuggestions = value.length > 0;
    this.search.emit(value);
    this.valueChange.emit(value);
  }

  selectUser(user: UserSuggestion): void {
    this.value = user.username;
    this.showSuggestions = false;
    this.userSelected.emit(user);
    this.valueChange.emit(user.username);
  }
}
