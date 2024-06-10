import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private apiUrl = 'http://158.23.137.77/apiS3/login.php';
  errorMessage: string = '';
  constructor(private http: HttpClient, private router: Router) {}
  login(event: Event) {
    if (event) {
      event.preventDefault();
    }
    const usernameElement = document.getElementById('username') as HTMLInputElement;
    const username = usernameElement.value;

    const passwordElement = document.getElementById('password') as HTMLInputElement;
    const password = passwordElement.value;
    this.http.post<any>(this.apiUrl, { user_id: username, password: password }).subscribe({
      next: response => {
        if (response.success) {
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message;
          
        }
      },
      error: error => {
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

}
