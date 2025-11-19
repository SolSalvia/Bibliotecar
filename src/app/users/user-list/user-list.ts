import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserClient } from '../user-client';

@Component({
  selector: 'app-user-list',
  imports: [],
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

}
