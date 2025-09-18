import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService, Movimento } from '../../services/login.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomeComponent implements OnInit {
  saldo = "Caricamento";
  nome = "";
  movimenti: Movimento[] = [];

  constructor(private login: LoginService, private router: Router) {}

  ngOnInit() {
    this.login.getMovimenti().subscribe({
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
