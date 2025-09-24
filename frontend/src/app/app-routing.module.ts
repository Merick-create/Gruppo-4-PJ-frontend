import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/homepage/homepage.component';
import { authGuard } from './utils/auth.guard';
import { RicaricaComponent } from './pages/ricarica/ricarica.component';
import { RicercaMovimentiComponent } from './pages/movimenti/movimenti.component';
import { ProfiloComponent } from './pages/profilo/profilo.component';
import { BonificoComponent } from './pages/bonifico/bonifico.component';
import { ConfermaEmailComponent } from './pages/conferma-email/conferma-email.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' 
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'ricarica', 
    component: RicaricaComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'movimenti',
    component: RicercaMovimentiComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profilo',
    component: ProfiloComponent,
    canActivate: [authGuard]
  },
  {
    path: 'bonifico',
    component: BonificoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'conferma',
    component: ConfermaEmailComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
