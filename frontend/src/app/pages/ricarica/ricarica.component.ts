import { Component,inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MovimentiDTO } from '../../entities/MovimentiDTO';
import { Categoria } from '../../entities/categorie';

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

  nomeCategoria: string = 'Ricarica';
  categoriaRicaricaId: string = '';
  contoCorrenteId: string = '';

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  ngOnInit(): void {
    // 1. Inizializzo il form
    this.ricaricaForm = this.fb.group({
      numeroTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      importo: ['', [Validators.required, Validators.min(1)]],
      operatore: ['', Validators.required]
    });

    // 2. Recupero l'ID del conto corrente dell'utente
    this.authService.currentUser$.subscribe(user => {
      if (user) this.contoCorrenteId = user.id;
    });

    // 3. Recupero l'ID della categoria "Ricarica"
    this.http.get<{ id: string }>(`/api/categorie/nome/${this.nomeCategoria}`)
      .subscribe({
        next: (res) => this.categoriaRicaricaId = res.id,
        error: (err) => {
          console.error('Categoria "Ricarica" non trovata', err);
          this.error = 'Impossibile recuperare la categoria ricarica.';
        }
      });
  }

  // 4. Al click del bottone "Ricarica"
  onSubmit(): void {
    this.message = '';
    this.error = '';

    // Controlli sul form
    if (this.ricaricaForm.invalid) {
      this.error = 'Compila tutti i campi correttamente.';
      return;
    }

    if (!this.categoriaRicaricaId || !this.contoCorrenteId) {
      this.error = 'Dati non disponibili per eseguire la ricarica.';
      return;
    }

    this.loading = true;

    // 5. Costruisco il DTO da inviare al backend
    const ricaricaDto: MovimentiDTO = {
      ContoCorrenteId: this.contoCorrenteId,
      numeroTelefono: this.ricaricaForm.value.numeroTelefono,
      operatore: this.ricaricaForm.value.operatore,
      CategoriaMovimentoid: this.categoriaRicaricaId,
      importo: this.ricaricaForm.value.importo,
      descrizione: `Ricarica ${this.ricaricaForm.value.operatore} numero ${this.ricaricaForm.value.numeroTelefono}`,
    };
    this.http.post<{ message: string }>('/api/movimenti/ricarica', ricaricaDto)
      .subscribe({
        next: (res) => {
          this.message = res.message || 'Ricarica eseguita con successo!';
          this.loading = false;
          this.ricaricaForm.reset();
        },
        error: (err) => {
          this.error = err.error?.message || 'Errore durante la ricarica.';
          this.loading = false;
        }
      });
  }
}
