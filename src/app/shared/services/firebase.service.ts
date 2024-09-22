import { Inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { User } from '../services/user';
import { Router } from '@angular/router';
import { Database, ref, set, get } from '@angular/fire/database';
import { ToastAlertService } from './toast-alert.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  userData: any;

  constructor(
    private auth: Auth,
    @Inject(Router) public router: Router,
    public db: Database,
    private toastService: ToastAlertService
  ) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.userData = user;
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('user', JSON.stringify(user));
          JSON.parse(localStorage.getItem('user')!);
        }
      } else {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      }
    });
  }

  logInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        this.SetUserData(result.user);
        this.router.navigate(['/'])
        this.toastService.showToast('Signed in successfully', 'success', 'top-end');
      })
      .catch((error) => {
        this.toastService.showToast('Error signing in', 'error', 'top-end');
        console.error('Error signing in', error);
      });
  }

  logInWithEmailPassword(email: string, password: string) {
    if (email === '' || password === '') {
      this.toastService.showToast('Please fill in all fields', 'error', 'top-end');
      return;
    }
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        // Check if the user's email is verified
        if (!user.emailVerified) {
          sendEmailVerification(user)
            .then(() => {
              this.toastService.showToast('Please verify your email. Verification email sent again.', 'info', 'top-end');
            })
            .catch((error) => {
              this.toastService.showToast('Failed to send verification email', 'error', 'top-end');
              console.error('Verification email error:', error);
            });
          this.auth.signOut();  // Logout immediately if not verified
          return;
        }
  
        // Email is verified, proceed with login
        this.SetUserData(user);
        this.router.navigate(['/']);
        this.toastService.showToast('Signed in successfully', 'success', 'top-end');
      })
      .catch((error) => {
        this.toastService.showToast('Error signing in', 'error', 'top-end');
        console.error('Error signing in', error);
      });
  }
  
  

  registerWithEmailPassword(email: string, password: string, displayName: string) {
    if (email === '' || password === '' || displayName === '') {
      this.toastService.showToast('Please fill in all fields', 'error', 'top-end');
      return;
    }
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        // Update display name
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
  
        // Send verification email
        if (!userCredential.user.emailVerified) {
          sendEmailVerification(userCredential.user)
            .then(() => {
              this.toastService.showToast('Verification email sent. Please verify your email.', 'info', 'top-end');
            })
            .catch((error) => {
              this.toastService.showToast('Failed to send verification email', 'error', 'top-end');
              console.error('Verification email error:', error);
            });
        }
  
        // Log the user out immediately
        this.auth.signOut().then(() => {
          this.toastService.showToast('Registered successfully. Please verify your email to log in.', 'success', 'top-end');
          this.router.navigate(['login']); // Redirect to login page
        });
  
      })
      .catch((error) => {
        this.toastService.showToast('Error registering', 'error', 'top-end');
        console.error('Error registering', error);
      });
  }
  

  forgotPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.toastService.showToast('Password reset email sent', 'success', 'top-end');
      })
      .catch((error) => {
        this.toastService.showToast('Error sending password reset email', 'error', 'top-end');
        console.error('Error sending password reset email', error);
      });
  }

  logout() {
    this.auth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(['login']);
      this.toastService.showToast('Logout successfully', 'success', 'top-end');
      this.userData = null;

    });
  }

  get isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = JSON.parse(localStorage.getItem('user')!);
      return user !== null;
    }
    return false;
  }

  async SetUserData(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('loadProfile', JSON.stringify(user?.uid));
    const userRef = ref(this.db, `users/${user.uid}/info`);
    const formattedDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  
    try {
      const snapshot = await get(userRef);
  
      if (!snapshot.exists()) {
        await set(userRef, {
          ...userData,
          joinAt: formattedDate,
        });
      }
    } catch (error) {
      console.error('Error saving user data', error);
      console.log('Error saving user data');
    }
  }

  async getAuthToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return null;
  }

}