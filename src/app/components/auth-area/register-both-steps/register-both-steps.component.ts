import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-register-both-steps',
  templateUrl: './register-both-steps.component.html',
  styleUrls: ['./register-both-steps.component.scss']
})
export class RegisterBothStepsComponent {
  user = new UserModel()
  // completed: boolean = false
  // state: string;

  constructor(private notify: NotifyService, private authService: AuthService, private router: Router) { }

  async userInfoFromStepOne(userStepOne: UserModel) {
    try {
    this.user.firstName = userStepOne.firstName
    this.user.lastName = userStepOne.lastName
    this.user.userId = userStepOne.userId
    this.user.status = userStepOne.status
    this.user.role = userStepOne.role
    await this.authService.register(this.user)
    // this.notify.success('You have been registered')
    this.router.navigateByUrl('/home')
    }catch (err: any) {
    // this.notify.error(err)
  }

  }

}




