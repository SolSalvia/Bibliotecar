import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {

  contactWhatsapp() {
    window.open('https://wa.me/542235061211', '_blank');
  }
  
}
