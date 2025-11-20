import { CanDeactivateFn } from '@angular/router';
import { LoanForm } from './loan-form/loan-form';

export const unsavedLoanGuard: CanDeactivateFn<LoanForm> = (component) => {
  // Si ya guardó, dejar salir
  if (component.formSubmitted) return true;

  // Si la bandera está activada, preguntar siempre
  if (component.confirmOnLeave) {
    return confirm('⚠️ ¿Desea salir sin guardar?');
  }
  
  return true;
};