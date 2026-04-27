import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ToastService {
  private top$ = new BehaviorSubject<number>(80);

  topPosition$ = this.top$.asObservable();

  setTopPosition(position: number) {
    this.top$.next(position);
  }
}
