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
  saldo: number = 0;
  movimenti: Movimento[] = [];
  protected authSrv = inject(AuthService);
  currentUser$ = this.authSrv.currentUser$;
  loadingSaldo: boolean = true;
  errorSaldo: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {

  this.authSrv.getMovimenti().subscribe({
    next: (res: any) => {

      this.movimenti = Array.isArray(res.movimenti) ? res.movimenti : [];
      this.saldo = res.saldo ?? 0;
      this.loadingSaldo = false;
    },
    error: () => {
      this.errorSaldo = true;
      this.loadingSaldo = false;
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
