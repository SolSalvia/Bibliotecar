import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanClient } from '../loan-client';
import { Loan } from '../loan';
import { BookClient } from '../../books/book-client';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-loan-form',
  imports: [ReactiveFormsModule],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.css'
})
export class LoanForm {

  private readonly client = inject(LoanClient);
  private readonly bookClient = inject(BookClient);
  private readonly auth = inject(AuthService);

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  public readonly isEditing = input(false);
  public readonly loan = input<Loan>();
  public readonly edited = output<Loan>();

  protected books = signal<any[]>([]);
  protected bookSearch = '';                // texto visible en el input
  protected showDropdown = signal(false);
  protected filteredBooks = signal<any[]>([]);

  //Estas variables son para el GUARD de formulario,
  //Ya que hay inputs que no manejamos 100% con el form (ej: el autocomplet de libros)
  //Nuestra lógica de negocio define que siempre se debe preguntar al salir del formulario
  public confirmOnLeave = false;
  public formSubmitted = false;

  ngOnInit(): void {
    // Activamos la lógica de preguntar al salir aunque no haya cambios
    this.confirmOnLeave = true;
  }  

  protected readonly form = this.formBuilder.nonNullable.group({
    userId: [''],
    bookId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isActive: this.formBuilder.control({ value: true, disabled: true }, { nonNullable: true }),
    clientName: ['',[Validators.required,Validators.minLength(3),Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)]],
    clientEmail: ['', [Validators.required, Validators.email]],
    clientPhone: ['',[Validators.required,Validators.minLength(7),Validators.pattern(/^[0-9]+$/)]
  ]
  },
  { validators: this.dateValidator });
  
  dateValidator(form: any): any {
    const start = form.get('startDate')?.value;
    const end = form.get('endDate')?.value;

    // Si falta alguna fecha → no validamos
    if (!start || !end) {
      return null;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Si la fecha de inicio es mayor que la de fin → error
    if (startDate > endDate) {
      return { dateOrder: true };
    }

    return null; // todo ok
  }  


 constructor() {
  //Cargar libros 
  this.bookClient.getBooks().subscribe(books => {
    // Filtrar solo disponiles
    const availableBooks = books.filter(b => b.available);

    this.books.set(availableBooks);
    this.filteredBooks.set(availableBooks);

    if (this.isEditing() && this.loan()) {
      const loanData = this.loan()!;
      this.form.patchValue(loanData);

      const loanBookId = loanData.bookId;

      // En edición, incluimos el libro que ya estaba prestado aunque esté no disponible
      const book = books.find(b => b.id === loanBookId);
      if (book) {
        this.bookSearch = `${book.title} — ISBN: ${book.ISBN}`;
        //También lo agregamos al listado para que aparezca en el select
        if (!availableBooks.some(b => b.id === book.id)) {
          this.books.set([...availableBooks, book]);
          this.filteredBooks.set([...availableBooks, book]);
        }
      }
    }
  });
}

  //Cuando el input recibe foco: mostramos el dropdown con todas las opciones
  onBookFocus() {
    this.filteredBooks.set(this.books());
    this.showDropdown.set(true);
  }

  //al escribir: filtramos (si está vacío, mostramos todas)
  onBookSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.bookSearch = value;

    const input = value.toLowerCase();
    this.filteredBooks.set(
      this.books().filter(b =>
        (b.title || '').toLowerCase().includes(input) ||
        ((b.ISBN || b.isbn || '') + '').toLowerCase().includes(input)
      )
    );

    this.showDropdown.set(true); //desde el HTML, se va mostrando/ocultando la lista desplegable según este valor
  }

  //  Al seleccionar un libro de la lista, seteamos el bookId en el form y el texto visible
  selectBook(book: any) {
    this.form.controls.bookId.setValue(book.id);
    this.bookSearch = `${book.title} — ISBN: ${book.ISBN || book.isbn}`;
    this.showDropdown.set(false); //ocultamos lista desplegable
  }

  //En blur (cuando clickeamos fuera de la busququeda), cerramos el dropdown con pequeño delay para permitir el click
  validateBookInput() {
    const match = this.books().find(b =>
      (`${b.title} — ISBN: ${b.ISBN || b.isbn}`) === this.bookSearch
    );
    if (!match) {
      this.form.controls.bookId.setValue('');
      this.bookSearch = '';
    }
    this.showDropdown.set(false);
  }

  goToMenu() {
    this.router.navigateByUrl('/menu');
  }

  get userId() { return this.form.controls.userId; }
  get bookId() { return this.form.controls.bookId; }
  get startDate() { return this.form.controls.startDate; }
  get endDate() { return this.form.controls.endDate; }
  get isActive() { return this.form.controls.isActive; }
  get clientName() { return this.form.controls.clientName; }
  get clientEmail() { return this.form.controls.clientEmail; }
  get clientPhone() { return this.form.controls.clientPhone; }

  get dirty() {
    return this.form.dirty;
  }

  //Mandamos el formulario al guard (ya que acá es protected)
  get formGuard(){
    return this.form;
  }

  
  handleSubmit() {
    
    if (this.form.invalid) {
      alert('El formulario es inválido');
      return;
    }

    const activeUser = this.auth.getActiveUser()!; //Marcamos que el usuario nunca será nulo

    if (confirm('¿Desea confirmar el préstamo?')) {

      this.formSubmitted = true;

      const loan: Loan = {
        ...this.form.getRawValue(),
        userId: activeUser.id!,
        isActive: true
      };

      if (!this.isEditing()) {
        //creación de préstamo
        this.client.addLoan(loan).subscribe(() => {
          alert('¡Préstamo agregado con éxito!');
          this.form.reset();

          //Marcar libro como no disponible
          this.bookClient.getBookById(loan.bookId!).subscribe(book => {
            if (book) {
              this.bookClient.updateBook({ ...book, available: false }, book.id!).subscribe();
            }
          });

          this.router.navigateByUrl('/prestamos');
        });
      } else if (this.loan()) {
        // Recuperamos el id del libro prestado anteriormente (osea el que se quiere "editar")
        const previousBookId = this.loan()!.bookId;

        this.client.updateLoan(loan, this.loan()!.id!).subscribe((b) => {
          alert('¡Préstamo modificado con éxito!');
          this.edited.emit(b);

          // En el caso de que se haya cambiado el libro prestado, debemos actualizar la disponibilidad de ambos libros
          if (previousBookId && previousBookId !== loan.bookId) {
            this.bookClient.getBookById(previousBookId).subscribe(book => {
              if (book) {
                this.bookClient.updateBook({ ...book, available: true }, book.id!).subscribe();
              }
            });
          }

          //Pero también marcamos el libro nuevo como no disponible
          this.bookClient.getBookById(loan.bookId!).subscribe(book => {
            if (book) {
              this.bookClient.updateBook({ ...book, available: false }, book.id!).subscribe();
            }
          });
        });
      }
    }
  }


}