export interface Account {
  id: number;
  name: string;
  description: string;
  currency: string;
  balance: string;
  created_at: string;
  updated_at: string;
  user: string;
}

export interface CreateAccount {
  name: string;
  description?: string;
  currency: string;
  balance: string;
}
