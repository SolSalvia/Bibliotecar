import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AuthService } from '../auth/auth-service';

export const exitMenuGuard: CanDeactivateFn<any> = (component,currentRoute,currentState,nextState) => {
  const auth = inject(AuthService);

  // Si va para atrás
  if (!nextState) {
    const ok = confirm("↩️  Está a punto de desloguearse, ¿Desea continuar?");
    if (ok) auth.forceLogout();
    return ok;
  }

  const next = nextState.url;

  // Si va a login o inicio
  if (next === '/login' || next === '/inicio') {
    const ok = confirm("↩️  Está a punto de desloguearse, ¿Desea continuar?");
    if (ok) auth.forceLogout();
    return ok;
  }

  return true;
};
