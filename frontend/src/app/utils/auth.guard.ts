import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  return authSrv.isAuthenticated$.pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/login'], { queryParams: { requestedUrl: state.url } });
        return false;
      }
      return true;
    })
  );
};