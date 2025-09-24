import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfermaEmailService } from '../../services/conferma-email.service';

@Component({
  selector: 'app-conferma-email',
  standalone: false,
  templateUrl: './conferma-email.component.html',
  styleUrl: './conferma-email.component.css'
})

export class ConfermaEmailComponent {
  confirmForm: FormGroup<{ username: FormControl<string | null> }>;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private userService: ConfermaEmailService) {
    this.confirmForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.email])
    });
  }

  conferma() {
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;

    this.userService.confirmEmail(this.email).subscribe({
      next: (res) => {
        this.successMessage = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Errore durante la conferma';
        this.loading = false;
      },
    });
  }
}
