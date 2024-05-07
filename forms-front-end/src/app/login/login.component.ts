import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  login(event: Event) {
    if (event) {
      event.preventDefault();
    }
    const usernameElement = document.getElementById('username') as HTMLInputElement;
    const username = usernameElement.value;

    const passwordElement = document.getElementById('password') as HTMLInputElement;
    const password = passwordElement.value;
    // Agregar lógica de login
    console.log("DEBUG: ", username, " | ", password);
  }

}
