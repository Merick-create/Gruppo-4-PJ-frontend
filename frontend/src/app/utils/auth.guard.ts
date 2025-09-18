import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  return authSrv.isAuthenticated$
    .pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate([`/register`], {queryParams: {requestedUrl: state.url}});
        }else{
            router.navigate([`/login`], {queryParams: {requestedUrl: state.url}});
        }
      })
    );
};