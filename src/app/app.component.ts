import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from "./components/base/base.component";
import { SpinnerComponent } from './components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BaseComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Godrej AI';
}
