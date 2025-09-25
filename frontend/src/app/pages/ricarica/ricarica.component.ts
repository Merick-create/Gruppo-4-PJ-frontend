import { Component,inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MovimentiDTO } from '../../entities/MovimentiDTO';
import { Categoria } from '../../entities/categorie';
import { environment } from '../../../enviroments/environment.prod';

@Component({
  selector: 'app-ricarica',
  standalone: false,
  templateUrl: './ricarica.component.html',
  styleUrl: './ricarica.component.css'
})
export class RicaricaComponent implements OnInit {
 ricaricaForm!: FormGroup;
  message: string = '';
  error: string = '';
  loading: boolean = false;

  showConfirm: boolean = false;
  ultimeRicariche: MovimentiDTO[] = [];

  readonly nomeCategoria: string = 'Ricarica';
  contoCorrenteId: string = '';
  categoriaId: string = '';

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // URL del backend

  ngOnInit(): void {
    this.ricaricaForm = this.fb.group({
      numeroTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      importo: ['', [Validators.required, Validators.min(1)]],
      operatore: ['', Validators.required]
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) this.contoCorrenteId = user.id;
    });

    this.http.get<{ id: string }>(this.apiUrl+`/api/categorie/nome/${this.nomeCategoria}`)
    .subscribe({
      next: (res) => {
        if (res && res.id) {
          this.categoriaId = res.id;
        } else {
          console.warn('Categoria "Ricarica" non trovata');
        }
      },
      error: (err) => console.error('Errore recupero categoria:', err)
    });
      this.caricaUltimeRicariche();
    }

  onSubmit(): void {
    this.message = '';
    this.error = '';

    if (this.ricaricaForm.invalid) {
      this.error = 'Compila tutti i campi correttamente.';
      return;
    }

    this.showConfirm = true;
  }

  confirmRicarica(): void {
    if (!this.contoCorrenteId || !this.categoriaId) {
      this.error = 'Dati non disponibili per eseguire la ricarica.';
      return;
    }

    this.loading = true;

    const ricaricaDto: MovimentiDTO = {
      ContoCorrenteId: this.contoCorrenteId,
      numeroTelefono: this.ricaricaForm.value.numeroTelefono,
      operatore: this.ricaricaForm.value.operatore,
      CategoriaMovimentoid: this.categoriaId, // ✅ Usa l'ID recuperato
      importo: this.ricaricaForm.value.importo,
      descrizione: `Ricarica ${this.ricaricaForm.value.operatore} numero ${this.ricaricaForm.value.numeroTelefono}`,
    };

    this.http.post<{ message: string }>(this.apiUrl+'/api/movimenti/ricarica', ricaricaDto)
      .subscribe({
        next: (res) => {
          this.message = res.message || 'Ricarica eseguita con successo!';
          this.loading = false;
          this.ricaricaForm.reset();
          this.showConfirm = false;
          this.caricaUltimeRicariche();
        },
        error: (err) => {
          this.error = err.error?.message || 'Errore durante la ricarica.';
          this.loading = false;
        }
      });
  }

  cancelConfirm(): void {
    this.showConfirm = false;
  }

  private caricaUltimeRicariche(): void {
    this.http.get<MovimentiDTO[]>(this.apiUrl+`/api/movimenti/categoria?n=5&categoria=${this.nomeCategoria}`)
      .subscribe({
        next: (res) => {
          this.ultimeRicariche = res
            .filter(m => m.descrizione?.includes('Ricarica'))
            .slice(0, 5)
            .map(m => {
              const match = m.descrizione?.match(/Ricarica (\w+) numero (\d{10})/);
              return {
                ...m,
                operatore: match ? match[1] : '',
                numeroTelefono: match ? match[2] : ''
              };
            });
        },
        error: (err) => {
          console.error('Errore nel recupero ultime ricariche', err);
        }
      });
  }
}
