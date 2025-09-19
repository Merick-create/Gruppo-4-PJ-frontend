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
  private fb = inject(FormBuilder);
  private movimentiSrv = inject(MovimentiService);

  form: FormGroup;
  movimenti: Movimento[] = [];
  saldoFinale: number | null = null;

  constructor() {
    this.form = this.fb.group({
      tipoRicerca: ['1', Validators.required],
      n: [5, Validators.required],
      categoria: [''],
      dataInizio: [''],
      dataFine: ['']
    });
  }

  cerca(): void {
    const { tipoRicerca, n, categoria, dataInizio, dataFine } = this.form.value;

    this.movimenti = [];
    this.saldoFinale = null;

    if (tipoRicerca === '1') {
      this.movimentiSrv.ricercaMov1(n).subscribe(res => {
        this.movimenti = res.movimenti;
        this.saldoFinale = res.saldo;
      });
    } else if (tipoRicerca === '2') {
      this.movimentiSrv.ricercaMov2(n, categoria).subscribe(res => {
        this.movimenti = res;
      });
    } else if (tipoRicerca === '3') {
      this.movimentiSrv.ricercaMov3(n, dataInizio, dataFine).subscribe(res => {
        this.movimenti = res;
      });
    }
  }

  exportCSV(): void {
    this.movimentiSrv.exportMovimenti().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movimenti.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
