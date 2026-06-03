import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, switchMap} from 'rxjs';
import {CasinoService} from './casino.service';
import {CasinoBalance} from '../../client/models/casino/casino.model';


@Injectable({ providedIn: 'root' })
export class CasinoStatesService {
  private casinoService: CasinoService = inject(CasinoService);
  private casinoBalanceSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public casinoBalance$: Observable<number> = this.casinoBalanceSubject.asObservable();
  private reload$: Subject<void> = new Subject<void>();

  constructor() {
    this.reload$.pipe(switchMap((): Observable<CasinoBalance>  => this.casinoService.getBalance())).subscribe((response: CasinoBalance): void => {
      this.casinoBalanceSubject.next(response.balance / 100);
    });
  }

  load(): void {
    this.reload$.next();
  }
}
