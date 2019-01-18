import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/Alertify.service';
import { UserService } from '../_Services/User.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable()
export class MemberDetailResolver implements Resolve<User> {

    constructor(private alertify: AlertifyService, private userService: UserService,
                private router: Router) {}

        resolve(route: ActivatedRouteSnapshot): Observable<User>   {
            return this.userService.getUser(route.params['id']).pipe(
                catchError( error => {
                    this.alertify.error('');
                    this.router.navigate(['/members']);
                    return of(null);
                })
            );
        }
}


