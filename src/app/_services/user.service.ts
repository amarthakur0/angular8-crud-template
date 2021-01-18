import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../_models';

const apiUrl = `${environment.apiUrl}/user`;

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get(`${apiUrl}/getall`)
      .pipe(map((response: any) => {
        return response.data.user;
      }));
  }

  getUserDetails(userId: number): Observable<User> {
    return this.http.get(`${apiUrl}/get/${userId}`)
      .pipe(map((response: any) => {
        return response.data.user[0];
      }));
  }

  create(user: User) {
    return this.http.post(`${apiUrl}/create`, user);
  }

  update(user: User) {
    return this.http.post(`${apiUrl}/update`, user);
  }

  delete(userId: number) {
    return this.http.post(`${apiUrl}/delete`, { userId });
  }
}
