export interface FilterPassiveIncomeDto {
  userId: number;
  from: string;
  to: string;
  keyword?: string;
}

export interface FilterMonthlyPassiveIncomeDto {
  userId: number;
  from: string;
  to: string;
}