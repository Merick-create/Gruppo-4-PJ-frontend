import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/homepage/homepage.component';
import { AuthGuard } from './utils/auth.guard';
import { RicaricaComponent } from './pages/ricarica/ricarica.component';
import { RicercaMovimentiComponent } from './pages/movimenti/movimenti.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    canActivate: [AuthGuard], 
  },
  { 
    path: 'ricarica', 
    component: RicaricaComponent 
  },
  {
    path: 'movimenti',
    component: RicercaMovimentiComponent
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
