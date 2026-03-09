import { Routes } from '@angular/router';
import { Docente } from './pages/docente/docente';
import { Studente } from './pages/studente/studente';
import { roleGuard } from './core/role-guard';

export const routes: Routes = [
  { 
    path: 'docente', 
    component: Docente, 
    canActivate: [roleGuard], 
    data: { role: 'docente' } 
  },
  { 
    path: 'studente', 
    component: Studente, 
    canActivate: [roleGuard], 
    data: { role: 'studente' } 
  },

  { path: '', redirectTo: 'studente', pathMatch: 'full' }
];