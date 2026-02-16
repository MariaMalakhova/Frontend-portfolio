export type TransactionType = 'expense' | 'income';

export type CurrencyCode = 'PLN' | 'USD' | 'EUR';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  date: string;
  categoryId: string;
  merchant: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  receiptPath: string | null;
}

export type TransactionCreate = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt' | 'receiptPath'
> & { receiptPath?: null };

export type TransactionUpdate = Partial<
  Pick<Transaction, 'type' | 'amount' | 'currency' | 'date' | 'categoryId' | 'merchant' | 'note'>
>;
