import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookClient } from '../book-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookForm } from '../book-form/book-form';
import { Book } from '../book';

@Component({
  selector: 'app-book-details',
  imports: [BookForm],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails {

  private readonly client = inject(BookClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly isbn = this.route.snapshot.paramMap.get('isbn');

  protected readonly bookSource = toSignal(this.client.getBookByISBN(this.isbn!));
  protected readonly book = linkedSignal(() => this.bookSource());
  protected readonly isEditing = signal(false);

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  handleEdit(book: Book) {
    this.book.set(book);
    this.toggleEdit();
  }

  deleteBook() {
    if (confirm('Desea borrar el libro?')) {
      this.client.deleteBook(this.isbn!).subscribe(() => {
        alert('Libro borrado con éxito');
        this.router.navigateByUrl('/biblioteca');
      });
    }
  }
}
