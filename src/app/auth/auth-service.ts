import { Injectable, signal, inject, computed } from '@angular/core';
import { UserClient } from '../users/user-client'; 
import { User } from '../users/user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public readonly client = inject(UserClient);

  // Usuario actualmente logueado (reactivo)
  private readonly activeUser = signal<User | null>(null);
  public readonly isLoggedIn = computed(() => this.activeUser() !== null);

  // lista de usuarios reactiva (opcional si ya lo hiciste)
  readonly users = signal<User[]>([]);

  constructor() {
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
      return true;
    }

    return false;
  }

  logout() {
    this.activeUser.set(null);
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
