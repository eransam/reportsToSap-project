import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { CategoryModel } from 'src/app/models/category.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  productToEdit: any;
  categories: CategoryModel[];
  selectedFile: any = null;
  selectedImageName: string;
  dynamicClass: string = '';
  products: ProductModel[];
  displayError = false;
  // FormGroup  משתנה מסוג
  productForm: FormGroup;
  //  FormControl משתנים מסוג
  productnameInput: FormControl;
  priceInput: FormControl;
  amountInput: FormControl;
  noteInput: FormControl;
  productIdInput: FormControl;
  categoryIdInput: FormControl;
  imageInput: FormControl;
  @ViewChild('imageBox')
  imageBoxRef: ElementRef<HTMLInputElement>;

  @Input('editProduct') set editProduct(product: ProductModel) {
    console.log('product3453535345: ', product);

    if (product) {
      this.productToEdit = product;
      console.log('this.productToEdit: ', this.productToEdit);

      this.populateProductDetails();
    }
  }

  constructor(
    private productsService: ProductsService,
    private notify: NotifyService
  ) {}

  async ngOnInit() {
    try {
      console.log('amountInput: ', this.amountInput);

      console.log('imageInput: ', this.imageInput);

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
      this.productIdInput = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        this.isUnique(),
      ]);

      this.productForm = new FormGroup({
        nameBox: this.productnameInput,
        priceBox: this.priceInput,
        categoryIdBox: this.categoryIdInput,
        imageBox: this.imageInput,
        amountBox: this.amountInput,
        noteBox: this.noteInput,
        productIdBox: this.productIdInput,
      });

      this.categories = await this.productsService.getAllCategories();
      this.products = await this.productsService.getAllProducts();
    } catch (err: any) {
    //   this.notify.error(err);
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFile = inputElement.files[0] ?? null;
  }

  async update() {
    try {
      this.productToEdit.productname = this.productnameInput.value;
      this.productToEdit.amount = this.amountInput.value;
      this.productToEdit.price = this.priceInput.value;
      this.productToEdit.categoryId = this.categoryIdInput.value;
      this.productToEdit.note = this.noteInput.value;
      this.productToEdit.productId = this.productIdInput.value;
      await this.productsService.updateProduct(this.productToEdit);
    //   this.notify.success('Product has been updated');
      this.dynamicClass = 'hide-hint';
    } catch (err: any) {
    //   this.notify.error(err);
    }
  }

  productname: string;
  amount: string;
  price: number;
  note: string;
  productId: string;
  image: File;
  categoryId: string;
  category: CategoryModel;

  //   מזין ערכים ראשוניים בשדות של הפורם
  populateProductDetails() {
    console.log("this.productToEdit.categoryId: " , this.productToEdit.categoryId);
    
    this.productForm.patchValue({
      nameBox: this.productToEdit.productname,
      amountBox: this.productToEdit.amount,
      noteBox: this.productToEdit.note,
      productIdBox: this.productToEdit.productId,
      priceBox: this.productToEdit.price,
      categoryIdBox: this.productToEdit.categoryId,
      imageBox: null,
    });
  }

  isUnique(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.products || this.products.length === 0) {
        return null;
      }
      const nameTaken = this.products.filter(
        (p) =>
          p.productname.toLowerCase() ===
            this.productnameInput.value.toLowerCase() &&
          p.productId != this.productToEdit.productId
      );
      if (nameTaken.length > 0) {
        return { uniqueName: false };
      } else {
        return null;
      }
    };
  }
}
