import { Component, computed, inject } from '@angular/core';
//import { MovieStore } from '../movie-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BookClient } from '../book-client';

@Component({
  selector: 'app-book-list',
  imports: [],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList {
  
  private readonly client = inject(BookClient);
  private readonly router = inject(Router);
  protected readonly books = toSignal(this.client.getBooks());
  protected readonly isLoading = computed(() => this.books() === undefined);

  navigateToDetails(id: string) {
    this.router.navigateByUrl(`biblioteca/${id}`);
  }
  
}
