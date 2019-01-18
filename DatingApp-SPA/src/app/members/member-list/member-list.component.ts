import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_Services/User.service';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_Services/Alertify.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Photo } from '../../_models/Photo';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {


  users: User[];
  constructor(private userService: UserService, private alertifyService: AlertifyService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data =>  {
      this.users = data['users'];
    });
  }
}
