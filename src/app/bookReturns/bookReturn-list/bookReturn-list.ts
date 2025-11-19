import { Component, computed, inject, signal, effect, Signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BookReturnClient } from '../bookReturn-client';
import { BookClient } from '../../books/book-client';
import { LoanClient } from '../../loans/loan-client';
import { Book } from '../../books/book';

@Component({
  selector: 'app-bookReturn-list',
  imports: [],
  templateUrl: './bookReturn-list.html',
  styleUrl: './bookReturn-list.css'
})
export class BookReturnList {
  
  private readonly client = inject(BookReturnClient);
  protected readonly bookReturnClient = inject(BookReturnClient);
  protected readonly bookClient = inject(BookClient);
  protected readonly loanClient = inject(LoanClient);
  private readonly router = inject(Router);

  protected readonly bookReturns = toSignal(this.client.getBookReturns());
  protected readonly isLoading = computed(() => this.bookReturns() === undefined);
  protected readonly loans = toSignal(this.loanClient.getLoans()); 
  protected readonly books = toSignal(this.bookClient.getBooks()); 

  navigateToDetails(id: string) {
    this.router.navigateByUrl(`devoluciones/${id}`);
  }

}
