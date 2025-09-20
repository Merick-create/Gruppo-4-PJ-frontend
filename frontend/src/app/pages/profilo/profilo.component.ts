import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-profilo',
  standalone: false,
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit {
  currentUser: any;
  profilo: any;
  passwordForm!: FormGroup;
  message: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadProfile(user.id || user.id); // dipende da come lo ricevi
      }
    });

    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: [''], // opzionale
      CognomeTitolare: ['', Validators.required],
      NomeTitolare: ['', Validators.required],
      DataApertura: [{ value: '', disabled: true }],
      IBAN: [{ value: '', disabled: true }],
      oldPassword:[''],        
      newPassword: ['', [Validators.minLength(6)]]
    });
  }

  loadProfile(userId: string) {
    this.http.get(`/api/contocorrente/${userId}/fullprofile`).subscribe({
      next: (res: any) => {
        this.profilo = res;

        // carico i dati nel form
        this.passwordForm.patchValue({
          Email: res.Email,
          CognomeTitolare: res.CognomeTitolare,
          NomeTitolare: res.NomeTitolare,
          DataApertura: res.DataApertura,
          IBAN: res.IBAN
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore nel caricamento del profilo.';
      }
    });
  }

  onSubmit() {
    if (this.passwordForm.get('newPassword')?.invalid) {
      this.error = 'Inserisci una password valida (minimo 6 caratteri).';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const payload = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.http.post(`/api/updatePassword`, payload).subscribe({
      next: () => {
        this.message = 'Password aggiornata con successo!';
        this.loading = false;
        this.passwordForm.get('newPassword')?.reset();
        this.passwordForm.get('oldPassword')?.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore durante il cambio password.';
        this.loading = false;
      }
    });
  }

}
