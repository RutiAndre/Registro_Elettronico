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
        <input [(ngModel)]="form.studente" placeholder="Nome Utente Studente">
        <input [(ngModel)]="form.materia" placeholder="Materia">
        <input type="number" [(ngModel)]="form.voto" placeholder="Voto (1-10)">
        <button (click)="salvaVoto()" style="background: green; color: white;">Registra Voto</button>
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
  form = { studente: '', materia: '', voto: 0 };

  ngOnInit() { this.caricaTutto(); }

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