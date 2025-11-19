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