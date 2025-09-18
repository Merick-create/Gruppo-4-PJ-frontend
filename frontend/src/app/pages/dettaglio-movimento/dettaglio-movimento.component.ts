import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movimento } from '../../entities/Movimento.entity';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dettaglio-movimento',
  templateUrl: './dettaglio-movimento.component.html',
  styleUrls: ['./dettaglio-movimento.component.css'],
  standalone: false,
})
export class DettaglioMovimentoComponent implements OnInit {
  movimento?: Movimento;
    protected authSrv = inject(AuthService);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.authSrv.getMovimentoById(id).subscribe({
      next: (res) => this.movimento = res,
      error: () => console.error('Errore caricamento movimento')
    });
  }

  goHome() {
    this.router.navigate(['/homepage']);
  }
}

