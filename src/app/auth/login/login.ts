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

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    this.auth.logout(); 
  }

  login () {
    
    if (this.form.invalid) {
      alert('Formulario Inválido');
      return;
    }

    const { username, password } = this.form.getRawValue();

    this.auth.login(username, password);
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/menu');
    }
  }
}
