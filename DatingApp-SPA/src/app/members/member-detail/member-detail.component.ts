import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_Services/User.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_Services/Alertify.service';
import { NgxGalleryModule, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private route: ActivatedRoute,
              private alertify: AlertifyService) { }

  ngOnInit() {

   this.route.data.subscribe(data => {
     this.user = data['user'];
   });

  this.galleryOptions = [
    {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
    }
  ];
  this.galleryImages = this.getimages();
  }


  getimages() {
    const imageUrl = [];
    for (let i = 0; i < this.user.photos.length; i++) {

   imageUrl.push({
     small: this.user.photos[i].url,
     medium: this.user.photos[i].url,
     big: this.user.photos[i].url,
     description: this.user.photos[i].description
   });
  }

  return imageUrl;
 }
}
