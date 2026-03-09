import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html'
})
export class App implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Verifichiamo se l'utente è loggato prima di reindirizzare
    if (this.auth.isLoggedIn()) {
      this.eseguiRedirect();
    }
  }

  eseguiRedirect() {
    // Logica di reindirizzamento basata sui ruoli di Keycloak
    if (this.auth.hasRole('docente')) {
      this.router.navigate(['/docente']);
    } 
    else if (this.auth.hasRole('studente')) {
      this.router.navigate(['/studente']);
    }
  }
}