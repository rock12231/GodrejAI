import { Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Database, push, ref } from '@angular/fire/database';
import { ToastAlertService } from '../../shared/services/toast-alert.service';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user: any;

  constructor(
    public fauth: FirebaseService,
    public db: Database,
    private toastService: ToastAlertService,
    private spinnerService: SpinnerService
  ) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('user')) {
      this.user = localStorage.getItem('user');
      this.user = JSON.parse(this.user);
    }
  }

  async contactUs(name: string, email: string, message: string) {
    this.spinnerService.show();
    const userRef = ref(this.db, `users/contact`);
    await push(userRef, { name, email, message })
      .then(() => {
        this.spinnerService.hide();
        this.toastService.showToast('Message sent successfully', 'success', 'top-end');
      })
      .catch((error) => {
        this.spinnerService.hide();
        this.toastService.showToast('Error sending message', 'error', 'top-end');
      });
  }

}
