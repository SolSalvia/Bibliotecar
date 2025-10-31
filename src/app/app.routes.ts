import { Routes } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { BookForm } from './books/book-form/book-form';
import { BookDetails } from './books/book-details/book-details';

export const routes: Routes = [
    {
        path: '', redirectTo: 'biblioteca', pathMatch: 'full'
    },
    {
        path: 'biblioteca', component: BookList,
        title: 'Bibliotecar'
    },
    {
        path: 'biblioteca/:isbn', component: BookDetails,
        title: 'Detalles de Libro'
    },
    {
        path: 'agregar-libros', component: BookForm,
        title: "Agregar Libros"
    },
    {
        path: '**', redirectTo: 'biblioteca'
    }
];
