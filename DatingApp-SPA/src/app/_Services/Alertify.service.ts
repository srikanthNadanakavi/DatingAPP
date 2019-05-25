import { Injectable } from '@angular/core';

declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() {}

confirm(message: string, okCallBack: () => any) {

  alertify.confirm(message, function(e) {

    if (e) {
      okCallBack();
    } else {}
  });
}

success(message: string) {
  alertify.success(message);
}
warning(message: string) {
  alertify.warning(message);
}
error(message: string) {
  alertify.error(message);
}
}
