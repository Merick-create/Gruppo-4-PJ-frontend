import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimento } from '../entities/Movimento.entity';

@Injectable({
   providedIn: 'root' 
})

export class LoginService {
  private baseUrl = 'http://localhost:3000/api'; // in caso modificare per url backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  getMovimenti(): Observable<Movimento[]> {
    return this.http.get<Movimento[]>(`${this.baseUrl}/movimenti`);
  }

  getMovimentoById(id: string): Observable<Movimento> {
    return this.http.get<Movimento>(`${this.baseUrl}/movimenti/${id}`);
  }
}
