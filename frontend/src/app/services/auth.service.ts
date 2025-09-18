import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../entities/user.entity';
import { Router } from '@angular/router';
import { Movimento } from '../entities/Movimento.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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


  login(username: string, password: string) {
    return this.http.post<any>('/api/login', {username, password})
      .pipe(
        tap(res => this.jwtSrv.setToken(res.token)),
        tap(res => this._currentUser$.next(res.user)),
        map(res => res.user)
      );
  }
  getMovimenti(): Observable<Movimento[]> {
    return this.http.get<Movimento[]>(`/api/movimenti`);
  }

  getMovimentoById(id: string): Observable<Movimento> {
    return this.http.get<Movimento>(`/api/movimenti/${id}`);
  }

  register(user: {cognomeTitolare: string;nomeTitolare: string; iban:string; username: string; password:string;}) {
  return this.http.post<User>('/api/register', user)
}


  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
  }

}