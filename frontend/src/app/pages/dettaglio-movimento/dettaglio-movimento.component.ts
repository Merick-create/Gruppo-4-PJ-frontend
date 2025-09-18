import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Movimento } from '../../entities/Movimento.entity';

@Component({
  selector: 'app-dettaglio-movimento',
  templateUrl: './dettaglio-movimento.component.html',
  styleUrls: ['./dettaglio-movimento.component.css'],
  standalone: false,
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

