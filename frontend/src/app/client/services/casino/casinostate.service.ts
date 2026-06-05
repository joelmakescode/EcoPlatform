import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, startWith, Subject, switchMap} from 'rxjs';
import {CasinoService} from './casino.service';
import {CasinoBalance} from '../../../types/casino/casino.interface';


@Injectable({ providedIn: 'root' })
export class CasinoStateService {
  private casinoService: CasinoService = inject(CasinoService);
  private casinoBalanceSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public casinoBalance$: Observable<number> = this.casinoBalanceSubject.asObservable();
  private reload$: Subject<void> = new Subject<void>();

  constructor() {
    this.reload$
      .pipe(
        startWith(void 0),
        switchMap((): Observable<CasinoBalance>  => this.casinoService.getBalance())
      )
      .subscribe((response: CasinoBalance): void => {
        this.casinoBalanceSubject.next(response.balance);
      });
  }

  load(): void {
    this.reload$.next();
  }
}
