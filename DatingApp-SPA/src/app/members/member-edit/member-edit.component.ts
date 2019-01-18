import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_Services/Alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../_Services/User.service';
import { AuthService } from '../../_Services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;
  user: User;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {

    if (this.editForm.dirty) {

      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alerityService: AlertifyService,
             private  userService : UserService,private authService:AuthService) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  updateUser() {

    this.userService.updateUser(this.authService.decodedToken.nameid,this.user).subscribe( next => {

      console.log(next);

      this.alerityService.success('Save Changed Successuflly');
      this.editForm.reset(this.user);
    },error => {
      this.alerityService.error(error);
    });  
  }
}
