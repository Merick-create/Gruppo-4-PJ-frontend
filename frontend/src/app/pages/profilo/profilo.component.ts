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
  modificaForm!: FormGroup;
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
      this.currentUser = user;
      if (user) {
        this.initForm(user);
      }
    });
  }
  initForm(user: any) {
    this.modificaForm = this.fb.group({
      fullname: [user.fullname, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phoneNumber: [user.phoneNumber, Validators.required],
      address: [user.address, Validators.required],
      password: [''] 
    });
  }
  onSubmit() {
    if (this.modificaForm.invalid) {
      this.error = 'Compila tutti i campi correttamente.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const updateData: any = {
      fullname: this.modificaForm.value.fullname,
      email: this.modificaForm.value.email,
      phoneNumber: this.modificaForm.value.phoneNumber,
      address: this.modificaForm.value.address
    };

    const credentials: any = {};
    if (this.modificaForm.value.password) {
      credentials.password = this.modificaForm.value.password;
    }

    const payload: any = Object.keys(credentials).length > 0
      ? { updateData, credentials }
      : { updateData };

    this.http.put(`/api/user/${this.currentUser._id}`, payload).subscribe({
      next: (res: any) => {
        this.message = 'Profilo aggiornato con successo!';
        this.loading = false;
        this.authService.updateCurrentUser(res);
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore durante l\'aggiornamento del profilo.';
        this.loading = false;
      }
    });
  }

}
