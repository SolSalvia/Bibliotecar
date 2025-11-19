import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserClient } from '../user-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserForm } from '../user-form/user-form';
import { User } from '../user';

@Component({
  selector: 'app-User-details',
  imports: [UserForm],
  templateUrl: './User-details.html',
  styleUrl: './User-details.css'
})

export class UserDetails {

  private readonly client = inject(UserClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly id = this.route.snapshot.paramMap.get('id');

  protected readonly UsersSource = toSignal(this.client.getUserById(this.id!));
  protected readonly User = linkedSignal(() => this.UsersSource());
  protected readonly isEditing = signal(false);

  isAdminUser(){
    const user = this.User();
    return user?.isAdmin;
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  handleEdit(User: User) {
    this.User.set(User);
    this.toggleEdit();
  }

  deleteUser() {
    if (confirm('¿Desea borrar el usuario?')) {
      this.client.deleteUser(this.id!).subscribe(() => {
        alert('¡Usuario borrado con éxito!');
        this.router.navigateByUrl('/usuarios');
      });
    }
  }
}