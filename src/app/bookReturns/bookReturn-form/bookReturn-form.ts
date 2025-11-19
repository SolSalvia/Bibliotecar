import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookReturnClient } from '../bookReturn-client';
import { LoanClient } from '../../loans/loan-client';
import { BookClient } from '../../books/book-client';
import { AuthService } from '../../auth/auth-service';
import { BookReturn } from '../bookReturn';
import { Loan } from '../../loans/loan';
import { Book } from '../../books/book';

type LoanWithBook = Loan & { book?: Book };

@Component({
  selector: 'app-bookReturn-form',
  imports: [ReactiveFormsModule],
  templateUrl: './bookReturn-form.html',
  styleUrl: './bookReturn-form.css'
})
export class BookReturnForm {

  private readonly bookReturnClient = inject(BookReturnClient);
  private readonly loanClient = inject(LoanClient);
  private readonly bookClient = inject(BookClient);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly isEditing = input(false);
  readonly bookReturn = input<BookReturn>();
  readonly edited = output<BookReturn>();

  //Estas variables son para el GUARD de formulario,
  //Ya que hay inputs que no manejamos 100% con el form (ej: el autocomplet de libros)
  //Nuestra lógica de negocio define que siempre se debe preguntar al salir del formulario
  public confirmOnLeave = false;
  public formSubmitted = false;

  ngOnInit(): void {
    // Activamos la lógica de preguntar al salir aunque no haya cambios
    this.confirmOnLeave = true;
  }    

  // Señales
  loans = signal<LoanWithBook[]>([]);
  filteredLoans = signal<LoanWithBook[]>([]);
  loanSearch = '';
  showDropdown = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    loanId: ['', Validators.required],
    returnDate: ['', Validators.required]
  });

  // mapa interno de libros (id -> Book)
  private booksMap = new Map<string, Book>();

  constructor() {
    // Cargar libros primero (una sola vez)
    this.bookClient.getBooks().subscribe(books => {
      for (const b of books) {
        if (b.id) this.booksMap.set(b.id, b);
      }

      // luego cargar préstamos y enriquecer con libro (si existe)
      this.loadLoans();
    });
  }

  private loadLoans() {
    this.loanClient.getLoans().subscribe(loans => {
      // filtramos préstamos activos inicialmente
      const activeLoans = loans.filter(l => l.isActive);

      // creamos la versión enriquecida
      const enriched: LoanWithBook[] = activeLoans.map(l => ({
        ...l,
        book: this.booksMap.get(l.bookId)
      }));

      this.loans.set(enriched);
      this.filteredLoans.set(enriched);

      // Si estamos en edición, parchear el form y asegurar que el préstamo seleccionado se muestre
      if (this.isEditing() && this.bookReturn()) {
        const br = this.bookReturn()!;
        this.form.patchValue(br);

        // buscar en TODOS los loans (no solo activos) para incluir el que estaba seleccionado
        const selected = loans.find(l => l.id === br.loanId);
        if (selected) {
          const selectedWithBook: LoanWithBook = { ...selected, book: this.booksMap.get(selected.bookId) };

          // Si no está en activeLoans, lo agregamos para que aparezca en el combo
          if (!this.loans().some(l => l.id === selectedWithBook.id)) {
            const merged = [...this.loans(), selectedWithBook];
            this.loans.set(merged);
            this.filteredLoans.set(merged);
          }

          // Mostrar texto del préstamo seleccionado
          this.loanSearch = this.formatLoan(selectedWithBook);
        }
      }
    });
  }

  // ---- helpers ----
  protected formatLoan(loan: LoanWithBook) {
    const isbn = loan.book?.ISBN ?? 'N/A';
    const title = loan.book?.title ?? 'Título desconocido';
    return `ID Préstamo: ${loan.id} — ISBN Libro: ${isbn} — Título: ${title}`;
  }

  // ---- eventos del input ----
  onLoanFocus() {
    this.filteredLoans.set(this.loans());
    this.showDropdown.set(true);
  }

  onLoanSearch(event: Event) {
    const raw = (event.target as HTMLInputElement).value.trim();
    this.loanSearch = raw;
    const q = raw.toLowerCase();

    this.filteredLoans.set(
      this.loans().filter(l => {
        const id = (l.id ?? '').toLowerCase();
        const isbn = (l.book?.ISBN ?? '').toLowerCase();
        const title = (l.book?.title ?? '').toLowerCase();

        return id.includes(q) || isbn.includes(q) || title.includes(q);
      })
    );
    this.showDropdown.set(true);
  }

  selectLoan(loan: LoanWithBook) {
    this.form.controls.loanId.setValue(loan.id ?? '');
    this.loanSearch = this.formatLoan(loan);
    this.showDropdown.set(false);
  }

  validateLoanInput() {
    const match = this.loans().find(l =>
      this.formatLoan(l) === this.loanSearch
    );

    if (!match) {
      this.form.controls.loanId.setValue('');
      this.loanSearch = '';
    }
    this.showDropdown.set(false);
  }

  // ---- navegación / getters ----
  goToMenu() {
    this.router.navigateByUrl('/menu');
  }

  get loanId() { return this.form.controls.loanId; }
  get returnDate() { return this.form.controls.returnDate; }
  get dirty() { return this.form.dirty; }

  // ---- submit ----
  handleSubmit() {
    if (this.form.invalid) {
      alert('El formulario es inválido');
      return;
    }

    if (!confirm('¿Desea confirmar la devolución?')) return;

    this.formSubmitted = true;

    const bookReturn: BookReturn = this.form.getRawValue();

    const loan = this.loans().find(l => l.id === bookReturn.loanId);
    if (!loan) {
      alert('Préstamo no válido');
      return;
    }

    // Registrar devolución
    this.bookReturnClient.addBookReturn(bookReturn).subscribe(() => {
      alert('¡Devolución registrada con éxito!');

      // Marcar préstamo como finalizado
      this.loanClient.updateLoan({ ...loan, isActive: false }, loan.id!).subscribe();

      // Liberar el libro
      if (loan.book?.id) {
        this.bookClient.getBookById(loan.book.id!).subscribe(book => {
          if (book) {
            this.bookClient.updateBook({ ...book, available: true }, book.id!).subscribe();
          }
        });
      } else {
        // si no tenemos book en memoria, pedimos por bookId
        this.bookClient.getBookById(loan.bookId!).subscribe(book => {
          if (book) {
            this.bookClient.updateBook({ ...book, available: true }, book.id!).subscribe();
          }
        });
      }

      this.form.reset();
      this.loanSearch = '';
      this.router.navigateByUrl('/devoluciones');
    });
  }
}
