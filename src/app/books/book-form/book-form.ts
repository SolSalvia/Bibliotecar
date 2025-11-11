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

 
  protected readonly form = this.formBuilder.nonNullable.group({
    ISBN: ['', Validators.required],
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    publicationYear: ['', Validators.required],
    synopsis: [''],
    available: [false]
  });


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

    if (confirm('¿Desea confirmar los datos?')) {
      const book = this.form.getRawValue();

      //Agregar nuevo libro
      if (!this.isEditing()) {
        this.client.addBook(book).subscribe(() => {
          alert('Libro agregado con éxito');
          this.form.reset();
        });
      } 
      else if (this.book()) {      //Editar libro 
        this.client.updateBook(book, this.book()?.id!).subscribe((b) => {
          alert('Libro modificado con éxito');
          this.edited.emit(b);
        });
      }
    }
  }
}
