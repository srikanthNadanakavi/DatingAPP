import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/auth.service';
import { AlertifyService } from '../_Services/Alertify.service';
import { FormGroup, FormControl, Validators, AbstractControl, FormGroupName, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = { };
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  bsConfig:Partial<BsDatepickerConfig>;
  user:User;

  constructor(private authService: AuthService, private alertifyService: AlertifyService,
              private fb:FormBuilder, private router: Router ) { }

  ngOnInit() {

    this.CeateRegistrationForm();
    this.bsConfig = {
      containerClass: 'theme-red'
    }

    }

  CeateRegistrationForm(){

    this.registerForm = this.fb.group( {
      gender : ['male'],
      knownAs : ['',Validators.required],
      dateOfBirth :['',Validators.required],
      city : ['',Validators.required],
      country :['',Validators.required],
      userName : ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required]]
    },{ validator : this.passwordMatchValidatior} )
  }
 
  passwordMatchValidatior(g:FormGroup){
   return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch':true};
  }
 
  register() {

    if(this.registerForm.valid){

      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(() => {

        this.alertifyService.success('User registred successfully...');
      },error => this.alertifyService.error(error),()=> {

        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(["members"]);
        })
      });

    }



    // this.authService.register(this.model).subscribe(() => {
    //   this.alertifyService.success('User registred successfully...');
    // }, error => this.alertifyService.error(error));
  }

  Cancle() {
    this.cancelRegister.emit(false);
  }
}
