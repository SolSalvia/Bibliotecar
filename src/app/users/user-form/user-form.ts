import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserClient } from '../user-client';
import { User } from '../user';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm {

  private readonly authService = inject(AuthService);
  private readonly client = inject(UserClient);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly isEditing = input(false);
  readonly user = input<User>();
  readonly edited = output<User>();

  //Estas variables son para el GUARD de formulario,
  //Ya que hay inputs que no manejamos 100% con el form (ej: el autocomplet de libros)
  //Nuestra lógica de negocio define que siempre se debe preguntar al salir del formulario
  public confirmOnLeave = false;
  public formSubmitted = false;

  ngOnInit(): void {
    // Activamos la lógica de preguntar al salir aunque no haya cambios
    this.confirmOnLeave = true;
  }    

  protected capsLockOn = false;
  protected showPassword = false;  

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      if (this.isEditing() && this.user()) {
        this.form.patchValue({
          username: this.user()!.username,
          password: this.user()!.password,
        });
      }
    });
  }

  // Volver al menú principal
  goToMenu() {
    this.router.navigateByUrl('/menu');
  }

  // Getters para la validación en la plantilla
  get username() { return this.form.controls.username; }
  get password() { return this.form.controls.password; }

  get dirty() {
    return this.form.dirty;
  }

  handleSubmit() {
    if (this.form.invalid) {
      alert('❌ El formulario es inválido.');
      return;
    }
  
    if (confirm('⚠️ ¿Desea confirmar el usuario?')) {

      this.formSubmitted = true;
      
      // SIEMPRE isAdmin = false DESDE EL FORM
      const user: User = {
        ...this.form.getRawValue(),
        isAdmin: false
      };
    
      if (!this.isEditing()) {
        this.client.addUser(user).subscribe(() => {

          //Refrescamos la lista de usuarios en AuthService, para que si cerramos sesión, el nuevo usuario ya se pueda utilizar para loguearnos
          this.authService.client.getUsers().subscribe(users => {
            this.authService.users.set(users);
          });

          alert('✅ ¡Usuario agregado con éxito!');
          this.form.reset();
          this.router.navigateByUrl('/usuarios');

        });
      } else if (this.user()) {
        this.client.updateUser(user, this.user()?.id!).subscribe((u) => {
          alert('✅ ¡Usuario modificado con éxito!');
          this.edited.emit(u);
        });
      }
    }
  }

  checkCapsLock(event: KeyboardEvent) {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
