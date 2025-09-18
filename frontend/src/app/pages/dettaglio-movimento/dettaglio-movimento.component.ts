import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService, Movimento } from '../../services/login.service';

@Component({
  selector: 'app-dettaglio-movimento',
  templateUrl: './dettaglio-movimento.component.html',
  styleUrls: ['./dettaglio-movimento.component.css']
})
export class DettaglioMovimentoComponent implements OnInit {
  movimento?: Movimento;

  constructor(private route: ActivatedRoute, private router: Router, private login: LoginService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.login.getMovimentoById(id).subscribe({
      next: (res) => this.movimento = res,
      error: () => console.error('Errore caricamento movimento')
    });
  }

  goHome() {
    this.router.navigate(['/homepage']);
  }
}

