import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = { };
  @Output() cancelRegister = new EventEmitter();
  constructor(private authService: AuthService ) { }

  ngOnInit() {
  }

  register() {

    this.authService.register(this.model).subscribe(() => {
      console.log('registration successfull');
    }, error => console.log(error));
  }

  Cancle() {
    this.cancelRegister.emit(false);
    console.log('canclledd');
  }

}
