import { Routes } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { BookForm } from './books/book-form/book-form';
import { BookDetails } from './books/book-details/book-details';
import { LandingComponent } from './landing/landing';
import { MainMenuComponent } from './main-menu/main-menu';
import { LoginComponent } from './auth/login/login';
import { unsavedFormGuard } from './books/unsaved-form-guard';
import { authGuard } from './auth/auth-guard';
import { UserList } from './users/user-list/user-list';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: LandingComponent, title: 'Bienvenido a Bibliotecar' },
    { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },

    { path: 'menu', component: MainMenuComponent, title: 'Menú principal', canActivate: [authGuard] },


    { path: 'biblioteca', component: BookList, title: 'Bibliotecar' },
    { path: 'biblioteca/:id', component: BookDetails, title: 'Detalles de Libro' },
    { path: 'agregar-libro', 
      component: BookForm, 
      title: "Agregar Libro",
      canActivate: [authGuard], 
      canDeactivate: [unsavedFormGuard] },
    { path: 'users', component: UserList, title: 'Lista de Usuarios' },

    { path: '**', redirectTo: 'inicio' },
    
];
