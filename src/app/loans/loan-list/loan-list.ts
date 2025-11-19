import { Component, computed, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoanClient } from '../loan-client';
import { BookClient } from '../../books/book-client';
import { UserClient } from '../../users/user-client';

@Component({
  selector: 'app-loan-list',
  imports: [],
  templateUrl: './loan-list.html',
  styleUrl: './loan-list.css'
})
export class LoanList {
  
  private readonly client = inject(LoanClient);
  private readonly bookClient = inject(BookClient);
  private readonly userClient = inject(UserClient);
  private readonly router = inject(Router);

  protected readonly loans = toSignal(this.client.getLoans());
  protected readonly isLoading = computed(() => this.loans() === undefined);

  protected readonly usersMap = signal<Record<string, string>>({});
  protected readonly booksMap = signal<Record<string, string>>({});

  constructor() {
    //Cargar todos los usuarios y mapearlos por ID
    this.userClient.getUsers().subscribe(users => {
      const map: Record<string, string> = {};
      users.forEach(user => map[user.id!] = `${user.username} (ID: ${user.id})`);
      this.usersMap.set(map);
    });

    //Cargar todos los libros y mapearlos por ID
    this.bookClient.getBooks().subscribe(books => {
      const map: Record<string, string> = {};
      books.forEach(book => map[book.id!] = `${book.title} (ID: ${book.id})`);
      this.booksMap.set(map);
    });
  }

  //Funciones para obtener nombres desde el map
  getUserName(id: string | undefined) {
    if (!id) return '';
    return this.usersMap()[id] || id;
  }

  getBookTitle(id: string | undefined) {
    if (!id) return '';
    return this.booksMap()[id] || id;
  }

  navigateToDetails(id: string) {
    this.router.navigateByUrl(`prestamos/${id}`);
  }

  getStatusText(isActive: boolean | undefined) {
    return isActive ? 'Pendiente de Devolución' : 'Finalizado';
  }
}
