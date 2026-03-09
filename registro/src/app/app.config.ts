import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://fantastic-lamp-97vv7gx6xggvc76wv-8080.app.github.dev',
  realm: 'registro',
  clientId: 'registro_elettronico'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: Keycloak, useValue: keycloak },
    provideAppInitializer(async () => {
      await keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false
      });
    })
  ]
};