import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { AlertifyService } from '../_Services/Alertify.service';
import { UserService } from '../_Services/User.service';
import { AuthService } from '../_Services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class MemberEditResolver implements Resolve<User> {

    constructor(private alertify: AlertifyService, private userService: UserService,
                private router: Router, private authService: AuthService) {}

        resolve(route: ActivatedRouteSnapshot): Observable<User>   {

            return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
                catchError( error => {
                    this.alertify.error('');
                    this.router.navigate(['/members']);
                    return of(null);
                })
            );
        }
}
