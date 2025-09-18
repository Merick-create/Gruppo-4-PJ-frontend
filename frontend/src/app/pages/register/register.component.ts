import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy  {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);

  protected destroyed$ = new Subject<void>();
  registerError = '';

  registerForm = this.fb.group({
    nomeTitolare: ['', Validators.required],
    cognomeTitolare: ['', Validators.required],
    iban:['',Validators.required],
    username: ['', Validators.required,Validators.email],
    password: ['', Validators.required],
    confirmpasword:['',Validators.required]
  });

  ngOnInit(): void {
    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.registerError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
  const formValue = this.registerForm.value;

   if (formValue.password !== formValue.confirmpasword) {
    this.registerError = 'Le password non coincidono. Reinseriscile.';
    return;
  }

  this.authSrv.register({
    nomeTitolare: formValue.nomeTitolare || '',
    cognomeTitolare: formValue.cognomeTitolare || '',
    iban:formValue.iban || '',
    username : formValue.username || '',
    password: formValue.password || ''
  })
  .pipe(
    catchError(err => {
      this.registerError = err.error.message || 'Registration failed';
      return throwError(() => err);
    })
  )
  .subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
