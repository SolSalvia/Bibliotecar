import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookClient } from '../book-client';
import { Book } from '../book';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm {

  private readonly client = inject(BookClient);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);


  readonly isEditing = input(false);
  readonly book = input<Book>();
  readonly edited = output<Book>();

  //Estas variables son para el GUARD de formulario,
  //Ya que hay inputs que no manejamos 100% con el form (ej: el autocomplet de libros)
  //Nuestra lógica de negocio define que siempre se debe preguntar al salir del formulario
  public confirmOnLeave = false;
  public formSubmitted = false;

  ngOnInit(): void {
    // Activamos la lógica de preguntar al salir aunque no haya cambios
    this.confirmOnLeave = true;
  }    


  protected readonly categories = [
    'Novela',
    'Ciencia Ficción',
    'Fantasía',
    'Historia',
    'Biografía',
    'Infantil',
    'Educativo',
    'Autoayuda',
    'Tecnología'
  ];

 
  /*protected readonly form = this.formBuilder.nonNullable.group({
    ISBN: ['', Validators.required],
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    publicationYear: ['', Validators.required],
    synopsis: [''],
    available: [false]
  });*/

  protected readonly form = this.formBuilder.nonNullable.group({
    ISBN: [
      '', 
      [
        Validators.required,
        Validators.pattern(/^\d+-\d+-\d+-\d+-\d+$/)   // ISBN con 5 grupos
      ]
    ],
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    publicationYear: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{4}$/)                // año de 4 dígitos
      ]
    ],
    synopsis: [''],
    available: [false]
  });

  formatISBN(event: Event) {
    const input = event.target as HTMLInputElement;
  
    // Solo números
    let digits = input.value.replace(/\D/g, '');
  
    // Limitar a 13 dígitos
    if (digits.length > 13) {
      digits = digits.slice(0, 13);
    }
  
    let formatted = '';
  
    // Grupos: 3 - 1 - 2 - 6 - 1
    if (digits.length <= 3) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4)}`;
    } else if (digits.length <= 12) {
      formatted =
        `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    } else {
      formatted =
        `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 12)}-${digits.slice(12)}`;
    }
  
    this.form.controls.ISBN.setValue(formatted, { emitEvent: false });
  }



  constructor() {
    effect(() => {
      if (this.isEditing() && this.book()) {
        this.form.patchValue(this.book()!);
      }
    });
  }
  //VOLVER AL MENU PRINCIPAL
    goToMenu() {
      this.router.navigateByUrl('/menu');
    }

  get ISBN() { return this.form.controls.ISBN; }
  get title() { return this.form.controls.title; }
  get author() { return this.form.controls.author; }
  get category() { return this.form.controls.category; }
  get publicationYear() { return this.form.controls.publicationYear; }
  get synopsis() { return this.form.controls.synopsis; }
  get available() { return this.form.controls.available; }

  get dirty() {
    return this.form.dirty;
  }

  handleSubmit() {
    if (this.form.invalid) {
      alert('El formulario es inválido');
      return;
    }

    if (confirm('¿Desea confirmar el libro?')) {

      this.formSubmitted = true;        

      const book = this.form.getRawValue();

      //Agregar nuevo libro
      if (!this.isEditing()) {
        this.client.addBook(book).subscribe(() => {
          alert('¡Libro agregado con éxito!');
          this.form.reset();
          this.router.navigateByUrl('/biblioteca');
        });
      } 
      else if (this.book()) {      //Editar libro 
        this.client.updateBook(book, this.book()?.id!).subscribe((b) => {
          alert('¡Libro modificado con éxito!');
          this.edited.emit(b);
        });
      }
    }
  }
}
