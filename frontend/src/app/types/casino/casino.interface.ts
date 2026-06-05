export interface Bets {
  [key: string]: number;
}

export interface CasinoBalance {
  balance: number;
}

export interface RollADiceState {
  dice1: number | null;
  dice2: number | null;
  timeLeft: number | null;
  isLocked: boolean;
  isRolling: boolean;
  winAmount: number;
}
