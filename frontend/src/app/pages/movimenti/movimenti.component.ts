import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimentiService } from '../../services/movimenti.service';
import { Movimento } from '../../entities/Movimento.entity';

@Component({
  selector: 'app-movimenti',
  templateUrl: './movimenti.component.html',
  styleUrls: ['./movimenti.component.css'],
  standalone: false
})
export class RicercaMovimentiComponent {
  form!: FormGroup;
  movimenti: Movimento[] = [];
  saldoFinale: number | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private movimentiSrv: MovimentiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoRicerca: ['1', Validators.required],
      n: [5, [Validators.required, Validators.min(1)]],
      categoria: [''],
      dataInizio: [''],
      dataFine: ['']
    });

      this.cerca();
  }

  cerca(): void {
    if (this.form.invalid) {
      this.error = 'Compila correttamente tutti i campi.';
      return;
    }

    const { tipoRicerca, n, categoria, dataInizio, dataFine } = this.form.value;
    this.movimenti = [];
    this.saldoFinale = null;
    this.error = '';
    this.loading = true;

    if (tipoRicerca === '1') {
      this.movimentiSrv.ricercaMov1(n).subscribe({
        next: res => {
          this.movimenti = res.movimenti;
          this.saldoFinale = res.saldo;
          this.loading = false;
        },
        error: err => {
          this.error = err.error?.message || 'Errore durante la ricerca';
          this.loading = false;
        }
      });
    } 
    else if (tipoRicerca === '2') {
      if (!categoria) {
        this.error = 'Inserisci una categoria per filtrare';
        this.loading = false;
        return;
      }
      this.movimentiSrv.ricercaMov2(n, categoria).subscribe({
        next: res => {
          this.movimenti = res;
          this.saldoFinale = res.reduce((acc, m) => acc + m.importo, 0);
          this.loading = false;
        },
        error: err => {
          this.error = err.error?.message || 'Errore durante la ricerca per categoria';
          this.loading = false;
        }
      });
    } 
    else if (tipoRicerca === '3') {
      if (!dataInizio || !dataFine) {
        this.error = 'Inserisci entrambe le date per filtrare';
        this.loading = false;
        return;
      }
      const start = new Date(dataInizio).toISOString();
      const end = new Date(dataFine).toISOString();
      this.movimentiSrv.ricercaMov3(n, start, end).subscribe({
        next: res => {
          this.movimenti = res;
          this.saldoFinale = res.reduce((acc, m) => acc + m.importo, 0);
          this.loading = false;
        },
        error: err => {
          this.error = err.error?.message || 'Errore durante la ricerca per date';
          this.loading = false;
        }
      });
    }
  }

  exportCSV(): void {
    this.movimentiSrv.exportMovimenti().subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'movimenti.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        this.error = 'Errore durante l\'esportazione del CSV';
      }
    });
  }
}
