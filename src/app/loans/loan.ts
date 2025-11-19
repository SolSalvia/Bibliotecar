export interface Loan {
  id?: string;
  userId: string;
  bookId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}