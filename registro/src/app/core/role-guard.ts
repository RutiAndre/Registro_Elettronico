import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

export const roleGuard: CanActivateFn = (route, state) => {
  const keycloak = inject(Keycloak);
  const router = inject(Router);

  // Recuperiamo il ruolo richiesto definito nelle rotte (app.routes.ts)
  const expectedRole = route.data['role'];

  // 1. Verifichiamo se l'utente è loggato
  if (!keycloak.authenticated) {
    keycloak.login();
    return false;
  }

  // 2. Verifichiamo se l'utente ha il ruolo necessario nel Realm
  if (keycloak.hasRealmRole(expectedRole)) {
    return true;
  }

  // 3. Se non ha il ruolo, lo mandiamo alla pagina "Accesso Negato"
  router.navigate(['/accesso-negato']);
  return false;
};