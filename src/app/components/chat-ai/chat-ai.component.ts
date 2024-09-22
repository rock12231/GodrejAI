import { Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Router } from '@angular/router';
import { Database, get, ref } from '@angular/fire/database';
import { ToastAlertService } from '../../shared/services/toast-alert.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css'
})
export class ChatAIComponent {

  user: any;
  chats: any;
  activeSection: string = 'AI Chat';

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

  async ngOnInit() {
    const userRef = ref(this.db, `users/${this.user.uid}/info`);
    const userSnapshot = await get(userRef);
    const profile = userSnapshot.val()
    if(profile.department == undefined || profile.interests == undefined || profile.skills == undefined){
      this.toastService.showToast('Please complete your profile first', 'error', 'top-end');
      this.router.navigate(['profile', this.user.displayName]);
    }
    this.getChat();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  async getChat(){
    const chatRef = ref(this.db, `users/${this.user.uid}/chat`);
    const chatSnapshot = await get(chatRef);
    const chat = chatSnapshot.val()
    const chatArray = Object.keys(chat).map(key => ({
      key: key,
      question: chat[key].question,
      response: chat[key].response
    }));
    this.chats = chatArray;
  }
}
