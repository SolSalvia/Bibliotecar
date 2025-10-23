import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';

export const routes: Routes = [
  { path: '', component: Landing },  // <-- Página inicial
  {
    path: 'book',
    loadComponent: () => import('./features/book/form/book').then(m => m.BookComponent)
  },
  { path: '**', redirectTo: '' } // Redirige cualquier ruta desconocida al landing page
];
