import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from './book';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BookClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/books';

  getBooks() {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getAvailableBooks() {
    return this.http.get<Book[]>(`${this.baseUrl}/?available=true`);
  }  

  getBookById(id: string | number) {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  addBook(book: Book) {
    return this.http.post<Book>(this.baseUrl, book);
  }

  updateBook(book: Book, id: string | number) {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  deleteBook(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  existsISBN(isbn: string) {
    return this.http.get<Book[]>(`${this.baseUrl}/?ISBN=${isbn}`);
  }  

}