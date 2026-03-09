import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpesaService } from '../../services/spesa-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-docente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>👨‍🏫 Area Docente - Inserimento Voti</h1>
      
      <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h3>Nuovo Voto</h3>
  
  <!-- MENÙ A TENDINA -->
  <select [(ngModel)]="form.studente" style="padding: 5px; margin-right: 10px;">
    <option value="" disabled selected>Seleziona uno studente...</option>
    @for (s of studenti(); track s.username) {
      <option [value]="s.username">{{ s.username }}</option>
    }
  </select>

  <input [(ngModel)]="form.materia" placeholder="Materia">
  <input type="number" [(ngModel)]="form.voto" placeholder="Voto" min="1" max="10">
  
  <button (click)="salvaVoto()" [disabled]="!form.studente || !form.materia">
    Registra Voto
  </button>
</div>

      <h3>Registro di Classe (Tutti i voti)</h3>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr style="background: #eee;">
          <th>Studente</th><th>Materia</th><th>Voto</th><th>Docente</th>
        </tr>
        @for (v of voti(); track v.id) {
          <tr>
            <td>{{v.studente_nome}}</td>
            <td>{{v.materia}}</td>
            <td><b>{{v.voto}}</b></td>
            <td>{{v.docente_nome}}</td>
          </tr>
        }
      </table>
    </div>
  `
})
export class Docente implements OnInit {
  private api = inject(SpesaService);
  voti = signal<any[]>([]);
  studenti = signal<any[]>([]); // <--- Signal per la lista a tendina
  
  form = { studente: '', materia: '', voto: 0 };

  ngOnInit() {
    this.caricaTutto();
    this.caricaStudenti(); // <--- Carichiamo gli studenti all'avvio
  }

  caricaStudenti() {
    this.api.getItemsCustom('/studenti').subscribe(res => {
      this.studenti.set(res.studenti);
    });
  }

  caricaTutto() {
    this.api.getItemsCustom('/voti/tutti').subscribe((res: any) => this.voti.set(res.voti));
  }

  salvaVoto() {
    this.api.addItemCustom('/voti/inserisci', this.form).subscribe(() => {
      this.caricaTutto();
      this.form = { studente: '', materia: '', voto: 0 };
    });
  }
}