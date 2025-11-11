import { computed, Injectable, signal } from '@angular/core';
import { UserClient } from '../users/user-client'; 
import { User } from '../users/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*private readonly users: User[] = [
    {
      username: 'SSalvia',
      password: '123456',
      isAdmin: false,
    },
    {
      username: 'admin',
      password: 'admin',
      isAdmin: true
    }
  ]*/

  private users: User[] = [];
  private loaded = false;

  private readonly activeUser = signal<User | undefined>(undefined);
  public readonly isLoggedIn = computed(() => this.activeUser() !== undefined);
  public readonly isAdmin = computed(() => this.activeUser()?.isAdmin);

  constructor(private userClient: UserClient) {
    this.loadUsers(); // carga al iniciar
  }

  private loadUsers(): void {
    this.userClient.getUsers().subscribe({
      next: (list) => { this.users = list; this.loaded = true; },
      error: (e)   => console.error('Error cargando usuarios:', e)
    });
  }
  

  /*login(username: string, password: string) {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.activeUser.set(user);
    }
  }*/

  login(username: string, password: string): void {
    if (!this.loaded && this.users.length === 0) {
      this.userClient.getUsers().subscribe({
        next: (list) => {
          this.users = list; this.loaded = true;
          this.tryLogin(username, password);
        },
        error: (e) => console.error('Error cargando usuarios en login:', e)
      });
      return;
    }
    this.tryLogin(username, password);
  }

  private tryLogin(username: string, password: string): void {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.activeUser.set(user);
      console.log('Sesión iniciada como', user.username);
    } else {
      console.warn('Usuario o contraseña incorrectos');
    }
  }    

  logout() {
    this.activeUser.set(undefined);
  }

  username(): string | undefined {
    return this.activeUser()?.username;
  }

}