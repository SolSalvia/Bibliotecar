import { HttpClient } from '@angular/common/http';
import { inject, Injectable, computed, signal } from '@angular/core';
import { BookReturn } from './bookReturn';
import { LoanClient } from '../loans/loan-client';
import { BookClient } from '../books/book-client';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})

export class BookReturnClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/bookReturns';
  protected readonly bookClient = inject(BookClient);
  protected readonly loanClient = inject(LoanClient);  
  protected readonly loans = toSignal(this.loanClient.getLoans()); 
  protected readonly books = toSignal(this.bookClient.getBooks());   

  getBookReturns() {
    return this.http.get<BookReturn[]>(this.baseUrl);
  }

  getBookReturnById(id: string | number) {
    return this.http.get<BookReturn>(`${this.baseUrl}/${id}`);
  }

  addBookReturn(bookReturn: BookReturn) {
    return this.http.post<BookReturn>(this.baseUrl, bookReturn);
  }

  updateBookReturn(bookReturn: BookReturn, id: string | number) {
    return this.http.put<BookReturn>(`${this.baseUrl}/${id}`, bookReturn);
  }

  deleteBookReturn(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`); 
  }

  getBookByLoanId(loanId: string) {
    const loan = this.loans()?.find(l => l.id === loanId);
    if (!loan) return undefined;
    return this.books()?.find(b => b.id === loan.bookId);
  }  
  
}