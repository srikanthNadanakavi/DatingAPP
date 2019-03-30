import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../_models/User";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<object> {
    return this.http.get<object>(this.baseUrl + 'users');
  }

  getUser(id: number): Observable<User> {

    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId:number,id:number) {

    return this.http.post(this.baseUrl + 'users/' + userId +'/photos/' + id + '/setMain',{} );
  }

  deletePhoto(userId:number,id:number){
 
    return this.http.delete(this.baseUrl + 'users/'+ userId +'/photos/'+ id,{});
  }
}
