import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  login() {

    this.authService.login(this.model).subscribe( response => {
       console.log('success');
    }, error => console.log(error));
  }

  loggedIn() {

     const token = localStorage.getItem('token');
     return !!token;
  }

  logOut() {
    localStorage.removeItem('token');
  }

}
