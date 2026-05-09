export interface ApplicationError {
  message: string;
  status?: number;
}

export interface ApplicationSuccess {
  message: string;
  additionalInfo?: string;
}
