import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  private timer: any;
  protected authSrv = inject(AuthService);

  constructor(private router: Router) {}

  startTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.email = '';
      this.password = '';
      this.message = 'Tempo scaduto! Riprova.';
    }, 30000);
  }

  doLogin() {
    this.authSrv.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.token) {
            localStorage.setItem('token', res.token);
          }
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

