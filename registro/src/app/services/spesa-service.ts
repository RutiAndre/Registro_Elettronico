import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Observable } from 'rxjs';

// Definizione dell'interfaccia per il Registro Elettronico
export interface Voto {
  id?: number;
  studente_nome: string;
  materia: string;
  voto: number;
  docente_nome?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpesaService {
  private http = inject(HttpClient);
  private keycloak = inject(Keycloak);

  // Modifica questo URL con quello del tuo backend Flask
  private baseUrl = 'https://fantastic-lamp-97vv7gx6xggvc76wv-5000.app.github.dev'; 

  /**
   * Genera gli header con il token JWT di Keycloak
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.keycloak.token}`,
      'Content-Type': 'application/json'
    });
  }

  // ======================================================
  // METODI PER IL REGISTRO ELETTRONICO (Esercizio Voti)
  // ======================================================

  /**
   * Metodo generico per fare GET a percorsi specifici
   * Usato da: Docente (/voti/tutti) e Studente (/voti/miei)
   */
  getItemsCustom(path: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${path}`, { 
      headers: this.getHeaders() 
    });
  }

  /**
   * Metodo generico per fare POST a percorsi specifici
   * Usato da: Docente (/voti/inserisci)
   */
  addItemCustom(path: string, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${path}`, body, { 
      headers: this.getHeaders() 
    });
  }

  // ======================================================
  // METODI PER LA LISTA DELLA SPESA (Esercizi precedenti)
  // ======================================================

  getItems(): Observable<{ items: any[], user: string }> {
    return this.http.get<{ items: any[], user: string }>(`${this.baseUrl}/items`, {
      headers: this.getHeaders()
    });
  }

  addItem(item: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, { item }, {
      headers: this.getHeaders()
    });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${id}`, {
      headers: this.getHeaders()
    });
  }
}