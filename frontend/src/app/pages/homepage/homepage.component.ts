import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movimento } from '../../entities/Movimento.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  saldo = "Caricamento";
  movimenti: Movimento[] = [];
  protected AuthService = inject(AuthService);
  currentUser$ = this.AuthService.currentUser$;

  constructor(private router: Router) {}

  ngOnInit() {
    this.AuthService.getMovimenti().subscribe({
      next: (res) => {
        this.movimenti = res;
        this.saldo = '€ ' + this.calcolaSaldo(res);
      },
      error: () => {
        this.saldo = 'Errore nel caricamento saldo';
      }
    });
  }

  dettagli(id: string) {
    this.router.navigate(['/dettaglio', id]);
  }

  private calcolaSaldo(movs: Movimento[]): number {
    return movs.reduce((tot, m) => tot + m.importo, 0);
  }
}
