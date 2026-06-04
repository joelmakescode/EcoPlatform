export interface Balance {
  balance: number;
}

export interface DailyClaimStatus {
  can_claim: boolean
}

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface UserHeaderInfo {
  username: string;
  balance: number;
}

export interface UserSuggestion {
  id: number;
  username: string;
}
