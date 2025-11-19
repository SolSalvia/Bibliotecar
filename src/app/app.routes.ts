import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing';

import { MainMenuComponent } from './main-menu/main-menu';

import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth-guard';

import { BookList } from './books/book-list/book-list';
import { BookForm } from './books/book-form/book-form';
import { BookDetails } from './books/book-details/book-details';
import { unsavedBookGuard } from './books/unsaved-book-guard';

import { UserForm } from './users/user-form/user-form';
import { UserList } from './users/user-list/user-list';
import { UserDetails } from './users/user-details/user-details';
import { unsavedUserGuard } from './users/unsaved-user-guard';

import { LoanForm } from './loans/loan-form/loan-form';
import { LoanList } from './loans/loan-list/loan-list';
import { LoanDetails } from './loans/loan-details/loan-details';
import { unsavedLoanGuard } from './loans/unsaved-loan-guard';

import { BookReturnForm } from './bookReturns/bookReturn-form/bookReturn-form';
import { BookReturnList } from './bookReturns/bookReturn-list/bookReturn-list';
import { BookReturnDetails } from './bookReturns/bookReturn-details/bookReturn-details';
import { unsavedBookReturnGuard } from './bookReturns/unsaved-bookReturn-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: LandingComponent, title: 'Bienvenido a Bibliotecar' },

    { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },

    { path: 'menu', component: MainMenuComponent, title: 'Menú principal', canActivate: [authGuard] },

    { path: 'agregar-libro', component: BookForm, title: "Agregar Libro", canActivate: [authGuard], canDeactivate: [unsavedBookGuard] },
    { path: 'biblioteca', component: BookList, title: 'Lista de Libros', canActivate: [authGuard] },
    { path: 'biblioteca/:id', component: BookDetails, title: 'Detalles de Libro', canActivate: [authGuard] },

    { path: 'agregar-usuario', component: UserForm, title: 'Agregar Usuario', canActivate: [authGuard], canDeactivate: [unsavedUserGuard] },  
    { path: 'usuarios', component: UserList, title: 'Lista de Usuarios', canActivate: [authGuard]},
    { path: 'usuarios/:id', component: UserDetails, title: 'Detalles de Usuario', canActivate: [authGuard]},

    { path: 'agregar-prestamo', component: LoanForm, title: 'Agregar Préstamo', canActivate: [authGuard], canDeactivate: [unsavedLoanGuard] },
    { path: 'prestamos', component: LoanList, title: 'Lista de Préstamos', canActivate: [authGuard] },
    { path: 'prestamos/:id', component: LoanDetails, title: 'Detalles de Libro', canActivate: [authGuard] },

    { path: 'agregar-devolucion', component: BookReturnForm, title: 'Agregar Devolución', canActivate: [authGuard], canDeactivate: [unsavedBookReturnGuard] },
    { path: 'devoluciones', component: BookReturnList, title: 'Lista de Devoluciones', canActivate: [authGuard] },
    { path: 'devoluciones/:id', component: BookReturnDetails, title: 'Detalles de Devolución', canActivate: [authGuard] },    

    { path: '**', redirectTo: 'inicio' },
    
];
