// src/app/main-menu/main-menu.ts
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css'
})

export class MainMenuComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  get username(): string {
    return this.auth.username() ?? 'Usuario';
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin() === true;
  }

}















  /*
  
  private handlingBack = false;
  // Captura el botón Atrás del navegador mientras estás en el menú
  @HostListener('window:popstate', ['$event'])
  onPopState(_e: PopStateEvent) {
    if (this.handlingBack) return;

    const ok = window.confirm('⚠️ Estás por desloguearte. ¿Deseas continuar?');

    if (ok) {
      // ✅ Solo acá cerramos sesión y salimos
      this.auth.logout?.();
      this.router.navigateByUrl('/login');
    } else {
      // ❌ Canceló: lo traemos de vuelta al menú sin desloguear
      this.handlingBack = true;
      // Volvemos al menú de forma explícita
      this.router.navigateByUrl('/menu').finally(() => {
        // pequeño delay para soltar el flag
        setTimeout(() => (this.handlingBack = false), 0);
      });
    }
  }

  // (Opcional) Botón "Cerrar sesión" dentro del menú
  logout() {
    const ok = confirm('¿Deseas cerrar sesión?');
    if (!ok) return;
    this.auth.logout?.();
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  // Empuja un estado para que el primer "Atrás" vuelva a este mismo lugar
  history.replaceState({ __menuAnchor: true }, '');
  history.pushState({ __menuAnchor: true }, '');
}*/

  /*// (Opcional) Mostrar nombre en el saludo
  displayname(): string {
    return localStorage.getItem('username') ?? 'Usuario';
  }*/