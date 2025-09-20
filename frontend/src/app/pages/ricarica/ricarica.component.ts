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

  categoriaRicaricaId: string = '';
  contoCorrenteId: string = '';

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.ricaricaForm = this.fb.group({
      numeroTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      importo: ['', [Validators.required, Validators.min(1)]],
      operatore: ['', Validators.required]
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) this.contoCorrenteId = user.id; 
    });
    this.authService.getCategorie().subscribe({
      next: (res: Categoria[]) => {
        const ricaricaCat = res.find(c => c.Nome.toLowerCase().includes('ricarica'));
        if (ricaricaCat) this.categoriaRicaricaId = ricaricaCat.id;
        else console.error('Categoria "Ricarica" non trovata!');
      },
      error: (err) => console.error('Errore caricamento categorie', err)
    });
  }

  onSubmit(): void {
    this.message = '';
    this.error = '';

    if (this.ricaricaForm.invalid) {
      this.error = 'Compila tutti i campi correttamente.';
      return;
    }

    if (!this.categoriaRicaricaId || !this.contoCorrenteId) {
      this.error = 'Dati non disponibili per eseguire la ricarica.';
      return;
    }

    this.loading = true;

    const ricaricaDto: MovimentiDTO = {
      ContoCorrenteId: this.contoCorrenteId,
      numeroTelefono: this.ricaricaForm.value.numeroTelefono,
      operatore: this.ricaricaForm.value.operatore,
       CategoriaMovimentoid: this.categoriaRicaricaId,
      importo: this.ricaricaForm.value.importo,
      descrizione: `Ricarica ${this.ricaricaForm.value.operatore} numero ${this.ricaricaForm.value.numeroTelefono}`,
    };

    this.authService.ricarica(ricaricaDto).subscribe({
      next: (res: any) => {
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
