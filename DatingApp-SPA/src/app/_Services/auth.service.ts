import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser:User;
  photoUrl = new BehaviorSubject('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {}

   changeMemberPhoto(photoUrl:string){

     this.photoUrl.next(photoUrl);

   }

  login(model: any) {

    return this.http.post(this.baseUrl + 'Login', model).pipe(
      map((response: any) => {
        const user = response;

        if (user) {

          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          localStorage.setItem('photo', user.user.photoUrl);
          this.currentUser = user.user;

        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'Register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
