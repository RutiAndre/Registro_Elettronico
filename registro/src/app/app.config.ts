import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <--- Importante
import { routes } from './app.routes';
import Keycloak from 'keycloak-js';
import keycloak from 'keycloak-js';

// ... (tua configurazione keycloak esistente)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // <--- Deve esserci questo!
    { provide: Keycloak, useValue: keycloak },
    // ... altri provider
  ]
};