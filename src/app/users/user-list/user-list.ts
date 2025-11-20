import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserClient } from '../user-client';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [ReactiveFormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList {
  
  private readonly client = inject(UserClient);
  private readonly router = inject(Router);
  protected readonly users = toSignal(this.client.getUsers());
  protected readonly isLoading = computed(() => this.users() === undefined);
    
  navigateToDetails(id: string) {
    this.router.navigateByUrl(`/usuarios/${id}`);
  }

  // Input del usuario para buscar
  readonly search = new FormControl<string>('', { nonNullable: true });
  
  // Señal que contiene el término de búsqueda en minúsculas y sin espacios
  private readonly searchTerm = toSignal(
    this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      map(v => v.trim().toLowerCase())
    ),
    { initialValue: '' }
  );
  
  // Filtra únicamente por el campo "username"
  protected readonly filteredUsers = computed(() => {
    const list = this.users() ?? [];
    const q = this.searchTerm();
  
    if (!q) return list;
  
    return list.filter(user => {
      const username = String(user.username ?? '').toLowerCase();
      return username.includes(q);
    });
  });


}
