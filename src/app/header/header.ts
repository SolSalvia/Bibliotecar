import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private readonly router =inject(Router);
  protected readonly auth = inject(AuthService);

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  //VOLVER AL MENU PRINCIPAL
  goToMenu() {
    this.router.navigateByUrl('/menu');
  }

  //VOLVER AL INICIO
  goToLanding() {
    this.router.navigateByUrl('/inicio');
  }  

  get path(){
    return window.location.pathname;
  }
}
