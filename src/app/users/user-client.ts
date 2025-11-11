import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class UserClient {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/users';
  getUsers() {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: string | number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  addUser(user: User) {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(user: User, id: string | number) {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}