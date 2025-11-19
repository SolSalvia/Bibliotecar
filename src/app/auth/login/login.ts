import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  private readonly auth  = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected capsLockOn = false;
  protected showPassword = false;

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    this.auth.logout(); 
  }

  login() {
    if (this.form.invalid) {
      alert('Formulario Inválido');
      return;
    }

    const { username, password } = this.form.getRawValue();

    const ok = this.auth.login(username, password);

    if (!ok) {
      alert('Usuario o contraseña incorrectos');
      return;
    }

    this.router.navigateByUrl('/menu');
  }

  checkCapsLock(event: KeyboardEvent) {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }  

}
