import { CanDeactivateFn } from '@angular/router';
import { UserForm } from './user-form/user-form';

export const unsavedUserGuard: CanDeactivateFn<UserForm> = (component) => {
  // Si ya guardó, dejar salir
  if (component.formSubmitted) return true;

  // Si la bandera está activada, preguntar siempre
  if (component.confirmOnLeave) {
    return confirm('⚠️ ¿Desea salir sin guardar?');
  }
  
  return true;
};