import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  //יוצרים משתנים
  selectedFile: any = null;
  dynamicClass: string = '';
  products: ProductModel[]; //In order to check unique name only

  //משתנה אשר מקבל ערך מבחוץ
  @Input()
  addButtonClicked: boolean;
  displayError = false;

  //   משתנה מסוג פרודקט מודל
  product = new ProductModel();
  categories: CategoryModel[];

  // FormGroup  משתנה מסוג
  productForm: FormGroup;
  //  FormControl משתנים מסוג
  productnameInput: FormControl;
  priceInput: FormControl;
  amountInput: FormControl;
  noteInput: FormControl;
  //   productIdInput: FormControl;
  categoryIdInput: FormControl;
  imageInput: FormControl;

  // html זו פקודה המאפרת לנו לקחת אלמנטים מקובץ ה @ViewChild
  //אשר יכול להחזיר אובייקטים מהדום ע''י  imageBoxRef ונכניס אותו למשתנה  #imageBox בקוד זה אנו נקח את התג עם ה
  // ElementRef<HTMLInputElement> הפקודה
  @ViewChild('imageBox')
  imageBoxRef: ElementRef<HTMLInputElement>;

  isDisabled: boolean = false;

  //   מזמנים קבצים אשר אנו רוצים להשתמש בשירותים שלהם בקומפוננטה
  constructor(
    public router: Router,
    private productsService: ProductsService,
    private notify: NotifyService
  ) {}

  //שזה אומר שהיא מקבלת אובייקט אשר מכיל את כל הפרטים של האיבנט שרא לפונ' הזו בתוכו $event כאן אנו יוצרים פונ אשר מקבלת כפרמטר
  onFileSelected(event: Event): void {
    // כך אנו מחלצים את הערך של התגית שזימנה את האיבנט המבוקש
    const inputElement = event.target as HTMLInputElement;
    // כאן ה"??" אומר שבמידה והתוצאה של משתנה מסויים יהיה שווה לנל או אנדיפיין אז תשווה אותו לערך מסויים
    //שווה לנל או אנדיפיין אז תשווה אותו לנל inputElement.files[0] אז במקרה הזה במידה ו
    console.log('inputElement.files[0]: ', inputElement.files[0]);

    this.selectedFile = inputElement.files[0] ?? null;
  }

  async ngOnInit() {
    try {
      //איזה תג שיהיה מקושר למשתנה מסויים מפה יקבל את הולידציות שלו גם  html כאן אנו מוסיפים ולידציות לפורם קונטרולס שזה אומר שבקובץ ה
      //[formControl]="priceInput" אנו נקשר תג מסויים למשתנה מהסוג הזה עם ולידציות כך:  html בקובץ ה
      this.productnameInput = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        this.isUnique(),
      ]);
      this.priceInput = new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
      ]);
      this.categoryIdInput = new FormControl('', [Validators.required]);
      this.imageInput = new FormControl('', [Validators.required]); //image is required!!
      this.amountInput = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]);
      this.noteInput = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
      ]);
      //   this.productIdInput = new FormControl('', [
      //     Validators.required,
      //     Validators.minLength(1),
      //     Validators.maxLength(100),
      //     this.isUnique(),
      //   ]);

      //productForm אחד אשר יהיה בתוך המשתנה  FormGroup כך אנו נאחד קבוצה של פורם קונטרולרים ונכניז אותם ל
      this.productForm = new FormGroup({
        nameBox: this.productnameInput,
        priceBox: this.priceInput,
        categoryIdBox: this.categoryIdInput,
        imageBox: this.imageInput,
        amountBox: this.amountInput,
        noteBox: this.noteInput,
        // productIdBox: this.productIdInput,
      });

      console.log('categoryIdInput: ', this.categoryIdInput.value);

      //Must be after above because await doesnt let formControl get initialized
      this.categories = await this.productsService.getAllCategories();
      this.products = await this.productsService.getAllProducts();
    } catch (err: any) {
    //   this.notify.error(err);
    }
  }

  async add() {
    const errorMsg = 'Please fill out all fields properly';
    //These 4 if's is for second time you try to add a product - it won't let you without filling out all fields:
    if (this.productnameInput.value === null) {
    //   this.notify.error(errorMsg);
      return;
    }
    if (this.priceInput.value === null) {
    //   this.notify.error(errorMsg);
      return;
    }
    if (this.categoryIdInput.value === null) {
    //   this.notify.error(errorMsg);
      return;
    }

    //   כאן אנו מסדרים את הערכים שקיבלנו במשתנה שהוא במודל שלנו
    this.product.productname = this.productnameInput.value;
    this.product.amount = this.amountInput.value;
    this.product.note = this.noteInput.value;
    // this.product.productId = this.productIdInput.value;
    this.product.price = this.priceInput.value;
    this.product.categoryId = this.categoryIdInput.value;
    //   וכך אנו שולחים כפרמטר את האובייקט המודל שלנו עם הערכים לפונ שלנו


    console.log("this.product: " , this.product);
    
    await this.productsService.addProduct(this.product);
    // this.notify.success('Product has been added');

    //reset selected file message
    this.selectedFile = null;

    //   בעזרת הפקודה הבילד אין של האלמנט פורם אנו מאפשים את המשתנה שלנו
    this.productForm.reset();

    //  Reset validation error
    Object.keys(this.productForm.controls).forEach((key) => {
      this.productForm.get(key).setErrors(null);
    });

    this.router.navigateByUrl('/admin-home');
  }

  // ValidatorFn  כאן אנו יוצרים פונ אשר מחזירה אובייקט מסוג
  isUnique(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.products || this.products.length === 0) {
        return null;
      }
      const nameTaken = this.products.filter(
        (p) =>
          p.productname?.toLowerCase() ===
            this.productnameInput.value?.toLowerCase() &&
          p.productId != this.product.productId
      );
      if (nameTaken.length > 0) {
        return { uniqueName: false };
      } else {
        return null;
      }
    };
  }
}
