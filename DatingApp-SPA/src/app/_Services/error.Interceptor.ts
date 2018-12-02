import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError(error => {

                if (error instanceof HttpErrorResponse) {

                    if (error.status === 401) {
                        return throwError(error.statusText);
                    }
                     const applicationError = error.headers.get('Application-Error');

                     if (applicationError) {
                     return throwError(applicationError);
                     }

                     const serverError = error.error;
                     let modelStateErrors = '';
                     if (serverError && typeof serverError === 'object') {

                     for (const key in serverError) {

                        if (serverError[key]) {
                            modelStateErrors += serverError[key] + '\n';
                        }
                     }
                }

                     return throwError(modelStateErrors || serverError || 'something different error');
                }
            })
        );
    }
}

export const ErrorInterceptorProvider = {

    provide : HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
