import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ToastService {
  private top$: BehaviorSubject<number> = new BehaviorSubject<number>(80);

  topPosition$: Observable<number> = this.top$.asObservable();

  setTopPosition(position: number): void {
    this.top$.next(position);
  }
}
