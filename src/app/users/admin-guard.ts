import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getActiveUser();

  // Si está logueado Y es admin, permitir
  if (user && user.isAdmin === true) {
    return true;
  }
  
  // Si NO es admin, bloquear y redirigir
  alert('❌ Acceso denegado. Solo el Administrador logueado puede acceder a esta página.');
  return router.createUrlTree(['/menu']);
};
