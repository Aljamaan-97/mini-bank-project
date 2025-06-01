export interface Transaction {
  id: number;
  type: "withdraw" | "deposit" | "transfer";
  amount: number;
  date: string; // format: 'YYYY-MM-DDTHH:mm:ssZ'
  from?: string; // optional
  to?: string; // optional
  createdAt?: string;
}
