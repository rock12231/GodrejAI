import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:5000'
  // private baseUrl = 'https://godreja.onrender.com'

  constructor(
    private http: HttpClient, 
    private fauth: FirebaseService
  ) { }

  async generate(prompt: string, user_data:any): Promise<Observable<any>> {
    const url = `${this.baseUrl}/generate`;
    const body = { prompt, user_data };
    try {
      const token = await this.fauth.getAuthToken()
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(url, body, { headers }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(error);
    }
  }
  
  async recentNews(user_data:any): Promise<Observable<any>> {
    const url = `${this.baseUrl}/recent-news`;
    const body = { user_data };
    try {
      const token = await this.fauth.getAuthToken()
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return this.http.post(url, body, { headers }).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      return throwError(error);
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
