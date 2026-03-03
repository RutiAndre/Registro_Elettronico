import { Component, OnInit, inject, signal } from '@angular/core';
import { SpesaService } from '../../services/spesa-service';

@Component({
  selector: 'app-studente',
  standalone: true,
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>🎓 Area Studente - I Miei Voti</h1>
      
      @if (voti().length > 0) {
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
          @for (v of voti(); track $index) {
            <div style="border: 2px solid blue; padding: 15px; border-radius: 10px; text-align: center;">
              <h2 style="margin: 0;">{{v.voto}}</h2>
              <p style="color: gray;">{{v.materia}}</p>
              <small>Docente: {{v.docente_nome}}</small>
            </div>
          }
        </div>
      } @else {
        <p>Ancora nessun voto caricato per il tuo profilo.</p>
      }
    </div>
  `
})
export class Studente implements OnInit {
  private api = inject(SpesaService);
  voti = signal<any[]>([]);

  ngOnInit() {
    this.api.getItemsCustom('/voti/miei').subscribe((res: any) => this.voti.set(res.voti));
  }
}