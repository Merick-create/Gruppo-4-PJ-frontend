import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfermaEmailService {
  private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }
   confirmEmail(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirmEmail`, { username });
  }
}
