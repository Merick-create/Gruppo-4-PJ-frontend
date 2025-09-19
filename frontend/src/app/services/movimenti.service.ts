import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimento } from '../entities/Movimento.entity';

@Injectable({ providedIn: 'root' })
export class MovimentiService {
  private apiUrl = 'http://localhost:3000/api/movimenti';

  constructor(private http: HttpClient) {}

  ricercaMov1(n: number): Observable<{ movimenti: Movimento[], saldo: number }> {
    return this.http.get<{ movimenti: Movimento[], saldo: number }>(
      `${this.apiUrl}/ricerca?n=${n}`
    );
  }

  ricercaMov2(n: number, categoria: string): Observable<Movimento[]> {
    return this.http.get<Movimento[]>(
      `${this.apiUrl}/categoria?n=${n}&categoria=${categoria}`
    );
  }

  ricercaMov3(n: number, dataInizio: string, dataFine: string): Observable<Movimento[]> {
    return this.http.get<Movimento[]>(
      `${this.apiUrl}/date?n=${n}&dataInizio=${dataInizio}&dataFine=${dataFine}`
    );
  }

  exportMovimenti(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob'
    });
  }
}
