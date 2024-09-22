import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { verifyPasswordResetCode, applyActionCode, Auth } from '@angular/fire/auth';
import { ToastAlertService } from '../../shared/services/toast-alert.service';
import { Database, ref, update } from '@angular/fire/database';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
 
  constructor(
    private route: ActivatedRoute, 
    private auth: Auth, 
    private router: Router, 
    private toastService: ToastAlertService,
    private db: Database
  ) { }

  verifyEmail() {
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    if (oobCode) {
      applyActionCode(this.auth, oobCode)
        .then(() => {
          const user = this.auth.currentUser;
          
          if (user) {
            // Update the emailVerified field in the Realtime Database
            const userRef = ref(this.db, `users/${user.uid}/info`);
            update(userRef, { emailVerified: true })
              .then(() => {
                this.toastService.showToast('Email verified successfully. You can now log in.', 'success', 'top-end');
                this.router.navigate(['login']);
              })
              .catch((error) => {
                this.toastService.showToast('Error updating user data in the database', 'error', 'top-end');
                console.error('Database update error:', error);
              });
          }
        })
        .catch((error) => {
          this.toastService.showToast('Error verifying email', 'error', 'top-end');
          console.error('Email verification error:', error);
        });
    }
  }
}
