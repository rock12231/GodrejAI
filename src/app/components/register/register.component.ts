import { Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    public fauth: FirebaseService,
  ) { }

}
