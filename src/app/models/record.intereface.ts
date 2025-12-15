import { Category } from "./category.interface";

export interface Account {
  id: number;
  name: string;
  description: string;
  currency: string;
  created_at: string;
  updated_at: string;
  user: string;
}

export interface RecordsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Record[];
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

export interface CreateRecord {
  title: string;
  description?: string;
  amount: string;
  account_id: number;
  typeRecord: 'expense' | 'income' | 'transfer' | 'investment';
  category_id?: number;
  paymentType: 'cash' | 'transfer' | 'card';
  currency: string;
  date_time?: string;
}

export interface TransactionFilters {
  searchTerm?: string;
  typeRecord?: 'expense' | 'income' | 'transfer' | '';
  dateFrom?: string;
  dateTo?: string;
}
