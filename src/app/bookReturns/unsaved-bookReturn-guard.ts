import { CanDeactivateFn } from '@angular/router';
import { BookReturnForm } from './bookReturn-form/bookReturn-form';

export const unsavedBookReturnGuard: CanDeactivateFn<BookReturnForm> = (component) => {
  // Si ya guardó, dejar salir
  if (component.formSubmitted) return true;

  // Si la bandera está activada, preguntar siempre
  if (component.confirmOnLeave) {
    return confirm('⚠️ ¿Desea salir sin guardar?');
  }
  
  return true;
};