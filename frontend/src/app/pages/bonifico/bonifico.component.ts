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
  loading: boolean = false;
  message: string = '';
  error: string = '';
  showConfirm: boolean = false;
  ultimiBonifici: Movimento[] = [];
  

  currentUser$!: Observable<User | null>;
  currentUserId: string = '';
  categoriaBonificoId: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private movimentiSrv = inject(MovimentiService); 

  ngOnInit(): void {
    this.bonificoForm = this.fb.group({
      ibanDestinatario: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(34)]],
      importo: [null, [Validators.required, Validators.min(0.01)]],
      descrizione: ['', Validators.required]
    });

    this.currentUser$ = this.authService.currentUser$;
    this.authService.currentUser$.subscribe(user => {
      if (user) this.currentUserId = user.id;
      this.loadUltimiBonifici();
    });


    this.http.get<{ id: string }>(`/api/categorie/nome/Bonifico`).subscribe({
      next: (res) => this.categoriaBonificoId = res.id,
      error: (err) => {
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
    if (!this.currentUserId || !this.categoriaBonificoId) {
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

    this.authService.eseguiBonifico(payload, this.currentUserId).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Bonifico eseguito con successo!';
        this.loading = false;
        this.bonificoForm.reset();
        this.showConfirm = false;
        this.loadUltimiBonifici();
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore durante il bonifico.';
        this.loading = false;
      }
    });
  }

  cancelConfirm(): void {
    this.showConfirm = false;
  }
  private loadUltimiBonifici(): void {
    const n = 5; // numero di bonifici da mostrare
    const categoriaBonifico = 'Bonifico';

    this.movimentiSrv.ricercaMov2(n, categoriaBonifico).subscribe({
      next: res => {
        this.ultimiBonifici = res;
      },
      error: err => {
        console.error('Errore caricamento ultimi bonifici', err);
      }
    });
  }

  get f() {
    return this.bonificoForm.controls;
  }
}
