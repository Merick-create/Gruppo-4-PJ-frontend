import { Component,OnInit,inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovimentiDTO } from '../../entities/MovimentiDTO';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';
import { HttpClient } from '@angular/common/http';
import { Movimento } from '../../entities/Movimento.entity';
import { MovimentiService } from '../../services/movimenti.service';


@Component({
  selector: 'app-bonifico',
  standalone: false,
  templateUrl: './bonifico.component.html',
  styleUrl: './bonifico.component.css'
})
export class BonificoComponent implements OnInit {
 bonificoForm!: FormGroup;
  loading = false;
  message = '';
  error = '';
  showConfirm = false;

  ultimiBonifici: Movimento[] = [];
  saldo = 0;
  utente: User | null = null;

  categoriaBonificoId = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private movimentiSrv = inject(MovimentiService);

  ngOnInit(): void {
    this.initForm();
    this.loadUtente();
    this.loadCategoriaBonifico();
    this.loadUltimiBonifici();
  }

  private initForm(): void {
    this.bonificoForm = this.fb.group({
      ibanDestinatario: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(34)]],
      importo: [null, [Validators.required, Validators.min(0.01)]],
      descrizione: ['', Validators.required]
    });
  }

  private loadUtente(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.utente = user;
        this.loadSaldo(user.id);
      }
    });
  }

  private loadSaldo(contoCorrenteId: string): void {
    this.http.get<{ saldo: number; nomeCompleto: string }>(`/api/saldo/${contoCorrenteId}`)
      .subscribe({
        next: res => {
          this.saldo = res.saldo; 
        },
        error: err => console.error('Errore caricamento saldo', err)
      });
  }

  private loadCategoriaBonifico(): void {
    this.http.get<{ id: string }>(`/api/categorie/nome/Bonifico`).subscribe({
      next: res => this.categoriaBonificoId = res.id,
      error: err => {
        console.error('Categoria "Bonifico" non trovata', err);
        this.error = 'Impossibile recuperare la categoria bonifico.';
      }
    });
  }

  onSubmit(): void {
    this.message = '';
    this.error = '';

    if (this.bonificoForm.invalid) {
      this.error = 'Compila correttamente tutti i campi.';
      return;
    }

    this.showConfirm = true;
  }

  confirmBonifico(): void {
    if (!this.utente?.id || !this.categoriaBonificoId) {
      this.error = 'Dati utente o categoria non disponibili.';
      return;
    }

    this.loading = true;

    const payload: MovimentiDTO = {
      ContoCorrenteId: this.bonificoForm.value.ibanDestinatario,
      importo: this.bonificoForm.value.importo,
      descrizione: this.bonificoForm.value.descrizione,
      CategoriaMovimentoid: this.categoriaBonificoId
    };

    this.authService.eseguiBonifico(payload, this.utente.id).subscribe({
      next: res => {
        this.message = res.message || 'Bonifico eseguito con successo!';
        this.loading = false;
        this.bonificoForm.reset();
        this.showConfirm = false;
        this.loadUltimiBonifici();
        this.loadSaldo(this.utente!.id); 
      },
      error: err => {
        this.error = err.error?.message || 'Errore durante il bonifico.';
        this.loading = false;
      }
    });
  }

  cancelConfirm(): void {
    this.showConfirm = false;
  }

  private loadUltimiBonifici(): void {
    const n = 5;
    const categoria = 'Bonifico';

    this.movimentiSrv.ricercaMov2(n, categoria).subscribe({
      next: res => this.ultimiBonifici = res,
      error: err => console.error('Errore caricamento ultimi bonifici', err)
    });
  }

  get f() {
    return this.bonificoForm.controls;
  }
}
