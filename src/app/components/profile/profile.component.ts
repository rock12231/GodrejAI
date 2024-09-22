import { Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Database, get, ref, update } from '@angular/fire/database';
import { ToastAlertService } from '../../shared/services/toast-alert.service';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: any;
  profile: any;

  constructor(
    public fauth: FirebaseService,
    private router: Router,
    public db: Database,
    private toastService: ToastAlertService,
    private spinnerService: SpinnerService
  ) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('user')) {
      this.user = localStorage.getItem('user');
      this.user = JSON.parse(this.user);
    }
  }

  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    const userRef = ref(this.db, `users/${this.user.uid}/info`);
    const snapshot = await get(userRef);
    this.profile = snapshot.val();
  }

  async updateProfile(department: string, interests: string, skills: string) {
    this.spinnerService.show();
    const interestsArray = interests.split(',').map((interest: string, index: number) => ({ [index]: interest }));
    const skillsArray = skills.split(',').map((skill: string, index: number) => ({ [index]: skill }));
    const interestsObject = Object.assign({}, ...interestsArray);
    const skillsObject = Object.assign({}, ...skillsArray);

    const userRef = ref(this.db, `users/${this.user.uid}/info`);
    await update(userRef, { department, interests: interestsObject, skills: skillsObject })
      .then(() => {
        this.spinnerService.hide();
        this.getProfile();
        this.toastService.showToast('Profile updated successfully', 'success', 'top-end');
      })
      .catch((error) => {
        this.spinnerService.hide();
        this.getProfile();
        this.toastService.showToast('Error updating profile', 'error', 'top-end');
      });
  }

}
