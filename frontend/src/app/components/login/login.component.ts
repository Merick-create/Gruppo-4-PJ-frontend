import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  private timer: any;

  constructor(private router: Router, private login: LoginService) {}

  startTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.email = '';
      this.password = '';
      this.message = 'Tempo scaduto! Riprova.';
    }, 30000);
  }

  doLogin() {
    this.login.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.token) localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        } else {
          this.message = 'Credenziali non valide';
        }
      },
      error: () => {
        this.message = 'Errore di connessione al server';
      }
    });
  }
}

