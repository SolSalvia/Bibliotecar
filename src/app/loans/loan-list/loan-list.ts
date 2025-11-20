import { Component, computed, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoanClient } from '../loan-client';
import { BookClient } from '../../books/book-client';
import { UserClient } from '../../users/user-client';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loan-list',
  imports: [ReactiveFormsModule, DatePipe],
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

  
  
  //Búsqueda y filtros

  // Campo de búsqueda. Lo que escriba el usuario se guarda acá.
  readonly search = new FormControl<string>('', { nonNullable: true });
  
  // Armo un texto grande con (usuario, libro, fechas, estado)
  private buildSearchText(loan: any): string {
    const userName = this.getUserName(loan.userId);
    const bookTitle = this.getBookTitle(loan.bookId);
    return ` ${loan.id} ${userName} ${bookTitle} ${loan.startDate} ${loan.endDate} ${this.getStatusText(loan.isActive)}`.toLowerCase();
  }

  // espero 200ms antes de filtrar
  private readonly searchTerm = toSignal(
    this.search.valueChanges.pipe(
      startWith(''),               // arranca vacío
      debounceTime(200),           // espera un poquito entre tipeos
      map(v => v.trim().toLowerCase()) // lo paso a minúsculas
    ),
    { initialValue: '' }
  );

  // Filtro por estado del préstamo: todos / activo / finalizado
  readonly availabilityFilter = signal<'all' | 'Finalizado' | 'Pendiente de Devolución'>('all');

  // Muestra u oculta el menú despebagle de filtros
  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  // Acá se combinan los dos filtros:
  // 1) búsqueda por texto
  // 2) filtro por estado
  protected readonly filteredLoans = computed(() => {
    const q = this.searchTerm();          // texto que buscó el usuario
    const avail = this.availabilityFilter(); // estado elegido

    return (this.loans() ?? [])
      // filtro por texto: compara contra el buildSearchText
      .filter(loan => this.buildSearchText(loan).includes(q))
      // filtro por el estado elegido
      .filter(loan =>
        avail === 'all'
          ? true
          : avail === 'Pendiente de Devolución'
            ? loan.isActive    // activo = pendiente
            : !loan.isActive   // no activo = finalizado
      );
  });


}
