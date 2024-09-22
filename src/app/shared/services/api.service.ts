import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private flaskApiUrl = 'http://127.0.0.1:5000/test'; // Change this to your actual Flask API URL

  constructor(private http: HttpClient, private fauth: FirebaseService) {}

  async postData(data: any): Promise<Observable<any>> {
    const token = await this.fauth.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.flaskApiUrl, data, { headers });
  }
}
