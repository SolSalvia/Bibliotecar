import { CanDeactivateFn } from '@angular/router';
import { BookForm } from './book-form/book-form';

export const unsavedBookGuard: CanDeactivateFn<BookForm> = (component) => {
  // Si ya guardó, dejar salir
  if (component.formSubmitted) return true;

  // Si la bandera está activada, preguntar siempre
  if (component.confirmOnLeave) {
    return confirm('¿Desea salir sin guardar?');
  }
  
  return true;
};