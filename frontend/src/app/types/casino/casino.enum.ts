export enum CasinoOverviewTransferMoneyType {
  DEPOSIT_MONEY = "Deposit",
  CASH_OUT_MONEY = "Cash Out",
}

export const CasinoOverviewTransferMoneyInfoMessages: Record<CasinoOverviewTransferMoneyType, string> = {
  [CasinoOverviewTransferMoneyType.DEPOSIT_MONEY]: 'The amount will be immediately charged from your account.',
  [CasinoOverviewTransferMoneyType.CASH_OUT_MONEY]: 'The amount will be transferred to your account instantly.',
}
