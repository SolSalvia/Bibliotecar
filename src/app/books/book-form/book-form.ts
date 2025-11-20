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

  isbnExists: boolean = false;

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
  
  constructor() {
    effect(() => {
      if (this.isEditing() && this.book()) {
        this.form.patchValue(this.book()!);
      }
    });
  }  

  checkISBN() {
    // Obtenemos el valor actual del campo ISBN del formulario
    const isbn = this.ISBN.value;

    if (!isbn) {
      this.isbnExists = false; 
      return;                  
    }

    // Llamamos al cliente que consulta si el ISBN ya existe en la base de datos
    this.client.existsISBN(isbn).subscribe(result => {

      // result es un array de libros que coinciden con ese ISBN
      const existeEnBD = result.length > 0;

      // Si estamos editando un libro, debemos permitir que se mantenga el mismo ISBN
      const esElMismo =
        this.isEditing() &&          // Verificamos si estamos en modo edición
        this.book() &&               // Verificamos que exista un libro cargado
        this.book()!.ISBN === isbn;  // Comparamos si el ISBN es el mismo

      // La variable isbnExists indica si realmente hay un conflicto de ISBN
      this.isbnExists = existeEnBD && !esElMismo;

      if (this.isbnExists) {
        // Creamos un error personalizado 'exists' para mostrar en la UI
        this.ISBN.setErrors({ exists: true });
      } else {
        // Si no hay conflicto, debemos eliminar el error 'exists' si estaba presente
        if (this.ISBN.hasError('exists')) {
          // Hacemos una copia del objeto de errores actual
          const actualErrors = { ...this.ISBN.errors };

          // Eliminamos solo la propiedad 'exists' para no borrar otros errores
          delete actualErrors['exists'];

        // Si no quedan más errores, ponemos null; si quedan otros, los mantenemos
          if (Object.keys(actualErrors).length === 0)
            this.ISBN.setErrors(null);        // No hay errores, control válido
          else
            this.ISBN.setErrors(actualErrors); // Quedan otros errores, los mantenemos
        }
      }
    });
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
        Validators.pattern(/^[\d-]+$/), // Solo números y guiones
         this.hasHyphenValidator
      ]
    ],
    title: ['', Validators.required],
    author: ['', [ Validators.required, Validators.pattern(/^[^\d]+$/)]], // No números en el nombre del autor
    category: ['', Validators.required],
    publicationYear: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{1,4}$/)
      ]
    ],
    synopsis: [''],
    available: [false]
  });

  hasHyphenValidator(control: any) {
    const value = control.value;
    if (!value) return null;
  
    return value.includes('-') ? null : { noHyphen: true };
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
      alert('❌ El formulario es inválido.');
      return;
    }

    if (confirm('⚠️ ¿Desea confirmar el libro?')) {

      this.formSubmitted = true;        

      const book = this.form.getRawValue();

      //Agregar nuevo libro
      if (!this.isEditing()) {
        this.client.addBook(book).subscribe(() => {
          alert('✅ ¡Libro agregado con éxito!');
          this.form.reset();
          this.router.navigateByUrl('/biblioteca');
        });
      } 
      else if (this.book()) {      //Editar libro 
        this.client.updateBook(book, this.book()?.id!).subscribe((b) => {
          alert('✅ ¡Libro modificado con éxito!');
          this.edited.emit(b);
        });
      }
    }
  }
}
