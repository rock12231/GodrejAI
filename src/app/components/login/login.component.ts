import { Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    public fauth: FirebaseService,
  ) { }

}
