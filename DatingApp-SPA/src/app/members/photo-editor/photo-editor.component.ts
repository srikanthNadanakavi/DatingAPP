import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { Photo } from '../../_models/Photo';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_Services/auth.service';
import { UserService } from '../../_Services/User.service';
import { AlertifyService } from '../../_Services/Alertify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();

   uploader:FileUploader;
   hasBaseDropZoneOver = false;
   baseUrl = environment.apiUrl;
   currentMain:Photo;
 
  constructor(private authService:AuthService,private userService:UserService,
              private alertifyService:AlertifyService) {
   }

  ngOnInit() {

    this.initilizeUploader();
  }

  public fileOverBase(e: any): void {

    this.hasBaseDropZoneOver = e;
  }
 
  initilizeUploader(){

    this.uploader = new FileUploader({
      url:this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken:'Bearer ' + localStorage.getItem('token'),
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize: 10 * 1024 * 1024   
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false;};

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

      if(response){

        const res = JSON.parse(response);
        const photo = {
          id : res.id,
          url: res.url,
          dateAdded : res.dateAdded,
          description : res.description,
          isMain : res.isMain
        };
        this.photos.push(photo);  

        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem("user",JSON.stringify(this.authService.currentUser));
        }
      }
    }
  }

  setMainPhoto(photo:Photo){

    this.userService.setMainPhoto(this.authService.decodedToken.nameid,photo.id).subscribe(() =>{
      
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.authService.changeMemberPhoto(photo.url);

      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem("user",JSON.stringify(this.authService.currentUser));

    },(error) => {
      this.alertifyService.error(error);
    })
  }


  deletePhoto(photo:Photo){

      this.alertifyService.confirm("Are you sure you want to delete this photo?",()=>{

        this.userService.deletePhoto(this.authService.decodedToken.nameid,photo.id).subscribe(()=>{

          this.photos.splice(this.photos.findIndex(p => p.id == photo.id),1);
         
          this.alertifyService.success("Photo has been deleted");
         },error => {
    
          this.alertifyService.error(error);

         })
      })
  
  }
}
