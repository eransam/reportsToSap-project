import { CityEnum } from './city.enum';
import { RoleEnum } from './role.enum';

export class UserModel {
  firstName: string;
  lastName: string;
  userId: number;
  status: boolean;
  role: RoleEnum; // 1 = User , 2 = Admin  Admin does not have street and city but uses same model.
}
