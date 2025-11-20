import { Component, computed, inject, signal, effect, Signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BookReturnClient } from '../bookReturn-client';
import { BookClient } from '../../books/book-client';
import { LoanClient } from '../../loans/loan-client';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookReturn-list',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './bookReturn-list.html',
  styleUrl: './bookReturn-list.css'
})
export class BookReturnList {
  
  private readonly client = inject(BookReturnClient);
  protected readonly bookReturnClient = inject(BookReturnClient);
  protected readonly bookClient = inject(BookClient);
  protected readonly loanClient = inject(LoanClient);
  private readonly router = inject(Router);

  //protected readonly bookReturns = toSignal(this.client.getBookReturns());
  protected readonly bookReturns = signal<any[]>([]);

  constructor() {
    this.reloadBookReturns(); // cargar por primera vez
  }

  protected readonly isLoading = computed(() => this.bookReturns() === undefined);
  protected readonly loans = toSignal(this.loanClient.getLoans()); 
  protected readonly books = toSignal(this.bookClient.getBooks()); 

  reloadBookReturns() {
    this.client.getBookReturns().subscribe(list => {
      this.bookReturns.set(list);
    });
  }  

  navigateToDetails(id: string) {
    this.router.navigateByUrl(`devoluciones/${id}`);
  }


  // Campo donde el usuario escribe para buscar por text
  readonly search = new FormControl<string>('', { nonNullable: true });

  // Me quedo con lo que el usuario escribe, pero con un pequeño delay
  private readonly searchTerm = toSignal(
    this.search.valueChanges.pipe(
      startWith(''),                 // arranca vacío
      debounceTime(200), //delay
      map(v => v.trim().toLowerCase()) // limpio el texto
    ),
    { initialValue: '' }
  );

  // Filtro principal: combina texto + rango de fechas
  protected readonly filteredBookReturns = computed(() => {
    const list = this.bookReturns() ?? []; // lista completa
    const q = this.searchTerm();           // texto que se busca
    const from = this.startDateTerm();     // fecha desde
    const to = this.endDateTerm();         // fecha hasta

    return list.filter(r => {
      // Armo un texto con todos los valores de la devolución
      const texto = Object.values(r)
        .map(v => String(v).toLowerCase())
        .join(' ');

      // Si se escribió texto, y no está en la devolución, no se muestra
      if (q && !texto.includes(q)) return false;

      // Para poder comparar, me quedo con la fecha
      const date = r.returnDate as string | undefined;
      if (!date) return false;

      // Filtro por fecha "desde" si el usuario la eligió
      if (from && date < from) return false;

      // Filtro por fecha "hasta"
      if (to && date > to) return false;

      return true; // si pasó todo, queda en la lista
    });
  });

  // Inputs para filtrar por fecha
  readonly startDate = new FormControl<string>('', { nonNullable: true });
  readonly endDate   = new FormControl<string>('', { nonNullable: true });

  // Convierto los valores de los inputs de fecha a signals
  private readonly startDateTerm = toSignal(
    this.startDate.valueChanges.pipe(startWith(''))
  );

  private readonly endDateTerm = toSignal(
    this.endDate.valueChanges.pipe(startWith(''))
  );

  // Botón para limpiar ambos filtros de fecha
  resetDateFilters() {
    this.startDate.setValue('');
    this.endDate.setValue('');
  }

}
