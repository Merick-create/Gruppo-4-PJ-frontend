import { Component, inject} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  protected authSrv = inject(AuthService);
  protected router=inject(Router);

  currentUser$ = this.authSrv.currentUser$;
  menuOpen: boolean = false;


  logout() {
    this.authSrv.logout();
    this.router.navigate(['/login']);
    this.menuOpen = false;
  }

  
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  showMenu(): void {
    this.menuOpen = true;
  }

  hideMenu(): void {
    this.menuOpen = false;
  }
}
