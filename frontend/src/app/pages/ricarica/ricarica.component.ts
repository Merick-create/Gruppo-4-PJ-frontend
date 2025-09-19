import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


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

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.ricaricaForm = this.fb.group({
      numeroTelefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      importo: ['', [Validators.required, Validators.min(1)]],
      operatore: ['', Validators.required]
    });
  }
  onSubmit(): void {
    this.message = '';
    this.error = '';
    if (this.ricaricaForm.invalid) {
      this.error = 'Compila tutti i campi correttamente.';
      return;
    }

    this.loading = true;

    const ricaricaDto = {
      numeroTelefono: this.ricaricaForm.value.numeroTelefono,
      importo: this.ricaricaForm.value.importo,
      operatore: this.ricaricaForm.value.operatore,
      ContoCorrenteId: 'ID_DEL_CONTO_CORRENTE' // sostituire con l'ID reale del conto dell'utente
    };

    this.http.post<{message: string}>('/api/movimenti/ricarica', ricaricaDto).subscribe({
      next: (res) => {
        this.message = res.message;
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
