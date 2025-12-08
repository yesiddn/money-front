export interface Account {
  id: number;
  name: string;
  description: string;
  currency: string;
  created_at: string;
  updated_at: string;
  user: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Record {
  id: number;
  title: string;
  description: string;
  amount: string;
  account: Account;
  typeRecord: 'expense' | 'income' | 'transfer' | 'investment';
  category: Category;
  paymentType: 'cash' | 'transfer' | 'card';
  currency: string;
  date_time: Date;
  created_at: string;
  updated_at: string;
}
