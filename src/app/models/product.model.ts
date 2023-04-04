import { CategoryModel } from './category.model';

export class ProductModel {
  productname: string;
  amount: string;
  price: number;
  imageName: string;
  note: string;
  productId: string;
  image: File;
  categoryId: string;
  category: CategoryModel;
}
