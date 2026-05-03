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

  @Output() search = new EventEmitter<string>();
  @Output() userSelected = new EventEmitter<UserSuggestion>();
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  showSuggestions: boolean = false;

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value
    this.showSuggestions = value.length > 0;
    this.search.emit(value);
    this.valueChange.emit(value);
  }

  selectUser(user: UserSuggestion) {
    this.value = user.username;
    this.showSuggestions = false;
    this.userSelected.emit(user);
    this.valueChange.emit(user.username);
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
