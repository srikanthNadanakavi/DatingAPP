import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { AlertifyService } from '../_Services/Alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = { };
  @Output() cancelRegister = new EventEmitter();
  constructor(private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  register() {

    this.authService.register(this.model).subscribe(() => {
      this.alertifyService.success('User registred successfully...');
    }, error => this.alertifyService.error(error));
  }

  Cancle() {
    this.cancelRegister.emit(false);
    console.log('Canclled');
  }

}
