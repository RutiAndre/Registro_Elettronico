import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accesso-negato',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
      <h1 style="font-size: 50px; color: red;">🛑 ACCESSO NEGATO 🛑</h1>
      <p style="font-size: 20px;">Non hai i permessi per entrare in questa sezione!</p>
      <img src="https://media.giphy.com/media/njYrp176NQsHS/giphy.gif" width="400" alt="You shall not pass">
      <br><br>
      <button routerLink="/" style="padding: 10px 20px; font-size: 18px; cursor: pointer;">
        Torna alla Home
      </button>
    </div>
  `
})
export class AccessoNegato {}