import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/books';

  getBooks() {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getBookByISBN(isbn: string | number) {
    return this.http.get<Book>(`${this.baseUrl}/${isbn}`);
  }

  addBook(book: Book) {
    return this.http.post<Book>(this.baseUrl, book);
  }

  updateBook(book: Book, isbn: string | number) {
    return this.http.put<Book>(`${this.baseUrl}/${isbn}`, book);
  }

  deleteBook(isbn: string | number) {
    return this.http.delete(`${this.baseUrl}/${isbn}`);
  }
}
