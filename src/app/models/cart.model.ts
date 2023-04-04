import { UserModel } from './user.model';

export class CartModel {
  cartId: number;
  date: string;
  _id: string;
  isClosed: boolean;
  createdAt: Date;
  userId: string;
  user: UserModel;
}
