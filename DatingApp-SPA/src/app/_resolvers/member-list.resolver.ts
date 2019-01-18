import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/Alertify.service';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_Services/User.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

    constructor(private alertify: AlertifyService, private userService: UserService,
                private router: Router) {}

        resolve(route: ActivatedRouteSnapshot): Observable<User[]>   {

            return this.userService.getUsers().pipe(
                catchError( error => {
                    this.alertify.error('');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
        }
}


