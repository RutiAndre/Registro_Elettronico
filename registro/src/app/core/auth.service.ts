import { Injectable, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inietta l'istanza globale di Keycloak configurata in app.config.ts
  private keycloak = inject(Keycloak);

  /**
   * Avvia la procedura di login di Keycloak
   */
  login(): void {
    this.keycloak.login({
      redirectUri: window.location.origin
    });
  }

  /**
   * Effettua il logout
   */
  logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  /**
   * Verifica se l'utente è autenticato
   */
  isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  /**
   * Recupera lo username dell'utente (es. prof_rossi)
   */
  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  /**
   * Restituisce il token JWT (serve al backend Flask per la verifica)
   */
  getToken(): string | undefined {
    return this.keycloak.token;
  }

  /**
   * Controlla se l'utente ha un ruolo specifico nel Realm
   * Molto utile per mostrare/nascondere bottoni nell'HTML
   */
  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  /**
   * Restituisce tutti i ruoli dell'utente (per debug)
   */
  getRoles(): string[] {
    const roles = this.keycloak.realmAccess?.roles || [];
    console.log("I tuoi ruoli su Keycloak sono:", roles); // <--- AGGIUNGI QUESTO
    return roles;
  }
}