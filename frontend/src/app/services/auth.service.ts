import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../entities/user.entity';
import { Router } from '@angular/router';
import { Movimento } from '../entities/Movimento.entity';
import { HttpHeaders } from '@angular/common/http';
import { MovimentiDTO } from '../entities/MovimentiDTO';
import { Categoria } from '../entities/categorie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser2$ = new BehaviorSubject<User | null>(null);

  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);

  protected _currentUser$ = new ReplaySubject<User | null>(1);
  currentUser$ = this._currentUser$.asObservable();

  constructor() {
    const token = this.jwtSrv.getToken();

    if (token) {
      const decoded = this.jwtSrv.decodeToken<User>();
      if (decoded) {
        this._currentUser$.next(decoded);
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  isAuthenticated$ = this.currentUser$
                      .pipe(
                        map(user => !!user),
                        distinctUntilChanged()
                      );


 login(username: string, password: string): Observable<User | null> {
  return this.http.post<{ user: User, token: string }>('/api/login', { username, password })
    .pipe(
      tap(res => {
        if (res?.token) {
          this.jwtSrv.setToken(res.token);           // salva il token
        }
        if (res?.user) {
          this._currentUser$.next(res.user);        // aggiorna lo stato dell’utente
        }
      }),
      map(res => res?.user || null),               // restituisci l’utente o null
      catchError(err => {
        // Stampa l’errore completo su console per debugging
        console.error('Login error', err);

        // Estrai un messaggio leggibile, fallback a stringa generica
        const errorMsg = err?.error?.message || err?.message || 'Errore imprevisto durante il login';
        
        // Puoi anche mostrare un alert direttamente qui, oppure restituire un Observable
        alert(errorMsg);

        // Restituisci null per continuare il flusso senza crash
        return of(null);
      })
    );
}
  getMovimenti(): Observable<Movimento[]> {
    return this.http.get<Movimento[]>('/api/movimenti/ricerca');
  }

  getMovimentoById(id: string): Observable<Movimento> {
    return this.http.get<Movimento>(`/api/movimenti/${id}`);
}

  register(user: {cognomeTitolare: string;nomeTitolare: string; iban:string; username: string; password:string;}) {
  return this.http.post<User>('/api/register', user)
}
 getToken(): string | null {
    return this.jwtSrv.getToken();
  }


  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
  }

  updateCurrentUser(user: any) {
  this._currentUser2$.next(user);
  localStorage.setItem('user', JSON.stringify(user));
}

 eseguiBonifico(dto: MovimentiDTO, mittenteId: string): Observable<any> {
    return this.http.post(`/api/movimenti/bonifico`, dto);
  }

    ricarica(ricaricaDto: MovimentiDTO) {
    const token = this.getToken(); 
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
    return this.http.post<{message: string}>('/api/movimenti/ricarica', ricaricaDto, { headers });
  }

  getCategorie(): Observable<Categoria[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
    Authorization: token ? `Bearer ${token}` : ''
    });
    return this.http.get<Categoria[]>('/api/categorie', { headers });
}

}