import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Loan } from './loan';

@Injectable({
  providedIn: 'root'
})

export class LoanClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/loans';

  getLoans() {
    return this.http.get<Loan[]>(this.baseUrl);
  }

  getLoanById(id: string | number) {
    return this.http.get<Loan>(`${this.baseUrl}/${id}`);
  }

  addLoan(loan: Loan) {
    return this.http.post<Loan>(this.baseUrl, loan);
  }

  updateLoan(loan: Loan, id: string | number) {
    return this.http.put<Loan>(`${this.baseUrl}/${id}`, loan);
  }

  deleteLoan(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}