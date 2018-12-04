import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../_Services/Alertify.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {

  }

  login() {

    this.authService.login(this.model).subscribe( response => {
    this.alertifyService.success('Logged in Successfully...');
    }, error => this.alertifyService.error(error));
  }

  loggedIn() {
      return this.authService.loggedIn();

  }

  logOut() {
    localStorage.removeItem('token');
    this.alertifyService.warning('logged out successfully....');
  }

}
