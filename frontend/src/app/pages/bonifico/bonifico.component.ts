import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovimentiDTO } from '../../entities/MovimentiDTO';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';


@Component({
  selector: 'app-bonifico',
  standalone: false,
  templateUrl: './bonifico.component.html',
  styleUrl: './bonifico.component.css'
})
export class BonificoComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  currentUserId: string = '';

  ibanDestinatario: string = '';
  importo: number | null = null;
  descrizione: string = '';

  bonificoForm!: FormGroup;
  loading: boolean = false;
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bonificoForm = this.fb.group({
      ibanDestinatario: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(34)]],
      importo: [null, [Validators.required, Validators.min(0.01)]],
      descrizione: ['', Validators.required],
      categoria: ['', Validators.required]
    });

    // prendi id utente corrente
    this.currentUser$ = this.authService.currentUser$;
    this.authService.currentUser$.subscribe(user => {
      if (user) this.currentUserId = user.id;
    });
  }

  onSubmit(): void {
    if (this.bonificoForm.invalid) {
      this.error = 'Compila correttamente tutti i campi.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const payload: MovimentiDTO = {
      ContoCorrenteId: this.bonificoForm.value.ibanDestinatario,
      importo: this.bonificoForm.value.importo,
      descrizione: this.bonificoForm.value.descrizione,
      CategoriaMovimentoid: 'bonifico uscita'
    };

    this.authService.eseguiBonifico(payload, this.currentUserId).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Bonifico eseguito con successo!';
        this.loading = false;
        this.bonificoForm.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore durante il bonifico.';
        this.loading = false;
      }
    });
  }
  get f() {
    return this.bonificoForm.controls;
  }
}
