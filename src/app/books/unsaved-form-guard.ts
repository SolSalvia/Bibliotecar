import { CanDeactivateFn } from '@angular/router';
import { BookForm } from './book-form/book-form';

export const unsavedFormGuard: CanDeactivateFn<BookForm> = (form, currentRoute, currentState, nextState) => {
  if (form.dirty) {
    return confirm('Desea salir sin guardar?');
  }
  return true;
};
