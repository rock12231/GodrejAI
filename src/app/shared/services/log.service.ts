import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Database, push, ref } from '@angular/fire/database';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  user: any;

  constructor(
    private router: Router, 
    private db: Database
  ) {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('user')) {
      this.user = localStorage.getItem('user');
      this.user = JSON.parse(this.user);
    }
  }

  initLogListener() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      const navigation = event as NavigationEnd; 

      if (this.user) {
        this.logNavigation(this.user.uid, navigation.urlAfterRedirects);
      }
    });
  }

  logNavigation(userId: string, url: string) {
    const logRef = ref(this.db, `users/${userId}/Logs`)
    const formattedDate = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logData = {
      url: "https://godrej-chat.web.app"+url,
      timestamp: formattedDate
    }
    push(logRef, logData);
  }
}
