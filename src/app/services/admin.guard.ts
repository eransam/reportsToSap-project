import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoleEnum } from '../models/role.enum';
import store from '../redux/store';
import { NotifyService } from './notify.service';

// כך אנו מצהירים שכל הפרוייקט שלנו יוכל להשתמש בקומפוננטה הזו
@Injectable({
    providedIn: 'root'
})
//CanActivate תחזיר תשובה בוליאנית אנו נידע איך להתייחס לתשובה לפי ה canActivate או סרויס מסיפריית הראוטים והוא מסוג בוליאני שזה אומר שבמידה והפונ CanActivate
export class AdminGuard implements CanActivate {

    public constructor(private notify: NotifyService, private router: Router) { }

    canActivate(): boolean {
        if (store.getState().authState.user?.role === RoleEnum.Admin) {
            return true;
        }

        // this.notify.error("You are not an Admin!");
        this.router.navigateByUrl("/home");
        return false;

    }

}
