import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BookClient } from '../book-client';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  imports: [ReactiveFormsModule],
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


  // Campo donde el usuario escribe lo que quiere buscar
  readonly search = new FormControl<string>('', { nonNullable: true });

  // debounce para que no dispare eventos en cada tecla 
  private readonly searchTerm = toSignal(
    this.search.valueChanges.pipe(
      startWith(''),                 // empieza vacío
      debounceTime(200),             // pequeño delay
      map(v => v.trim().toLowerCase()) // limpio espacios y paso a minúsculas
    ),
    { initialValue: '' }
  );
  
  // Filtro para mostrar: todos / disponibles / no disponibles
  readonly availabilityFilter = signal<'all' | 'available' | 'unavailable'>('all');

  // Mostrar/ocultar menú de filtros
  showFilter = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  // Filtro principal: combina búsqueda por texto + disponibilidad
  protected readonly filteredBooks = computed(() => {
    const q = this.searchTerm();          // texto buscado
    const avail = this.availabilityFilter(); // categoría seleccionada

    return (this.books() ?? [])
      // Primer filtro: buscar en todos los campos del libro
      .filter(b =>
        Object.values(b).join(' ').toLowerCase().includes(q)
      )
      // Segundo filtro: disponible / no disponible
      .filter(b =>
        avail === 'all'
          ? true
          : avail === 'available'
            ? b.available
            : !b.available
      );
  });

}
