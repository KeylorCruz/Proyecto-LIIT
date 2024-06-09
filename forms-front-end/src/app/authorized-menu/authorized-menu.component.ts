import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorized-menu',
  templateUrl: './authorized-menu.component.html',
  styleUrl: './authorized-menu.component.scss'
})
export class AuthorizedMenuComponent {
  title = 'Menú usuario autorizado';
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/']); // Redirige a la página de inicio de sesión
  }
}
