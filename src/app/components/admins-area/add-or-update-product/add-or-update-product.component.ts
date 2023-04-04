import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-or-update-product',
  templateUrl: './add-or-update-product.component.html',
  styleUrls: ['./add-or-update-product.component.scss']
})

export class AddOrUpdateProductComponent implements OnInit {
    // יוצרים משתנים
  product: ProductModel;
  isAddAction = true;
  editWasClicked = false

// @Input פה אנו יוצרים פונ שמקבלת ערך מבחוץ בגלל ה 
  @Input('productToBeEdited') set productToBeEdited(product: any) {
    console.log("product123: " , product);
    
    // הפו מקבלת פרמטר ושואלת האם היא קבלה ערך בפרמטר ובמידה וכן
    if (product) {
        //יהיה שווה לערך product המשתנה 
        console.log("this.product in add or update: " , this.product);
        
      this.product = product;
    //   ערך המשתנים האלו ישתנה
      this.isAddAction = false;
      this.editWasClicked = true
    }
  }

  //We need this so edit button can be clicked more than once - (see productsService line 16 for reference)
//   פונ שמקבלת משתנה בוליאני
  @Input('isAddActionInput') set isAddActionInput(isAdd: boolean) { }

//   מזמנים סרויס אשר יש לקומפוננטה שלונו תלות בו
  constructor(private productsService: ProductsService) { }

//   כמו היוז אפקט
  ngOnInit(): void {

    //שהוא מסוג איבנט אמיטר שזה אומר שבכל פעם שהאמיט מעביר מידע אנו נאזין למידע ונעביר את הערך המועבר  isAddAction אנו מאזינים למשתנה  subscribeבעזרת פונ ה
    //this.isAddAction דרך פונקציית החץ ונזין את הערך שמועבר באמיט למשתנה שלנו 
    //this.isAddAction יעבור לערך של המשתנה שלנו  true אז אוטומטית גם הערך  isAddAction.emit(true); לדוגמא במידה והתבצע הפעולה 
    this.productsService.isAddAction.subscribe((isOpen => {
      this.isAddAction = isOpen;
    }));
  }
  //יוצרים פונ אשר מחילה ערכים למשתנים שלנו
  addProduct() {
    this.isAddAction = true;
    this.product = null;
    this.productsService.isAddAction.emit(true);
  }
}
