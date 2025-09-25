import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfermaEmailService {
  private apiUrl = environment.apiUrl; // URL del backend
  constructor(private http: HttpClient) { }
   confirmEmail(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/confirmEmail`, { username });
  }
}
