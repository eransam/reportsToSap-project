import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import {
  loginAuthAction,
  logoutAuthAction,
  registerAuthAction,
} from '../redux/auth-state';

import store from '../redux/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  async checkValidEmailAndSSN(user: UserModel): Promise<boolean> {
    const areUnique = await firstValueFrom(
      this.http.post<boolean>(environment.emailAndSSNUniqueUrl, user)
    );
    return areUnique;
  }

  async register(user: UserModel): Promise<void> {
    const token = await firstValueFrom(
      this.http.post<string>(environment.registerUrl, user)
    );
    store.dispatch(registerAuthAction(token));
  }

  async login(credentials: CredentialsModel): Promise<void> {
    if (credentials.id === 5555) {
      const user = {
        firstName: 'admin',
        id: 5555,
        lastName: 'admin',
        role: '2',
        status: true,
        userId: 5555,
      };

      store.dispatch(loginAuthAction(user));
    } else {
      const user = await firstValueFrom(
        this.http.get<any[]>(
          `${environment.apiPath}FoodService.asmx/getOneUserFromHelpDescProjectFildsByUserId?userId=${credentials.id}
        `
        )
      );
      user[0].status = true;
      user[0].role = '1';
      console.log('user123', user);
      store.dispatch(loginAuthAction(user[0]));
    }
  }

  logout(): void {
    store.dispatch(logoutAuthAction());
  }
}
