import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../_Services/Alertify.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  photoUrl:string;

  constructor( public authService: AuthService,
               private alertifyService: AlertifyService,
               private router: Router) { }

  ngOnInit() {
    
    this.authService.currentPhotoUrl.subscribe(photoUrl => { 
      this.photoUrl = photoUrl;      
    });

  }

  login() {

    this.authService.login(this.model).subscribe( response => {

    this.alertifyService.success('Logged in Successfully...');
     var obj = JSON.parse(localStorage.getItem('user'));
      this.photoUrl =obj["photoUrl"];
    }, error => this.alertifyService.error(error), () => {
        this.router.navigate(['/members']);
    });
  }

  loggedIn() {
    
      return this.authService.loggedIn();

  }

  logOut() {
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     localStorage.removeItem('photo');
    this.authService.currentUser = null;
    this.authService.decodedToken =  null;
    this.photoUrl =null;
  
    this.alertifyService.warning('logged out successfully....');
    this.router.navigate(['home']);
  }

}
