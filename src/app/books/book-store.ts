/*import { Injectable, signal } from '@angular/core';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookStore {

  private readonly books = signal<Book[]>([]);

  getBooks() {
    return this.books.asReadonly();
  }

  addBook(book: Book) {
    this.books.update((books) => [...books, book]);
  }
}
*/