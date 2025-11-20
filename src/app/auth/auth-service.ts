import { Injectable, signal, inject, computed } from '@angular/core';
import { UserClient } from '../users/user-client'; 
import { User } from '../users/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public readonly client = inject(UserClient);
   private readonly router = inject(Router);

  // Usuario actualmente logueado (reactivo)
  private readonly activeUser = signal<User | null>(null);
  public readonly isLoggedIn = computed(() => this.activeUser() !== null);

  // lista de usuarios reactiva (opcional si ya lo hiciste)
  readonly users = signal<User[]>([]);

  constructor() {

    // Recuperar el usuario logueado de localStorage
    const savedUser = localStorage.getItem('activeUser');
    if (savedUser) {
      this.activeUser.set(JSON.parse(savedUser));
    }

    // Cargar usuarios una sola vez al iniciar
    this.client.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  login(username: string, password: string) {
    const found = this.users().find(
      u => u.username === username && u.password === password
    );

    if (found) {
      this.activeUser.set(found);
      localStorage.setItem('activeUser', JSON.stringify(found));
      return true;
    }

    return false;
  }

  logout() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
    //this.activeUser.set(null);
    //localStorage.removeItem('activeUser');
    //Movemos esto a forceLogout para que se ejecute solo cuando el usuario confirme que quiere desloguearse con el EXIT-MENU-GUARD
  }

  forceLogout() {
    this.activeUser.set(null);
    localStorage.removeItem('activeUser');
  }  

  username() {
    return this.activeUser()?.username ?? null;
  }

  //Función para cambiar Menú principal en caso de ser admin
  isAdmin() {
    return this.activeUser()?.isAdmin === true;
  }

  getActiveUser(): User | null {
    return this.activeUser();
  }  


}
