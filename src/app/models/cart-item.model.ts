import { CartModel } from "./cart.model"
import { ProductModel } from "./product.model"

export class CartItemModel {
    price: number
    _id: string
    quantity: number
    total: number
    productId: string
    product: ProductModel
    cartId: string
    cart: CartModel
imageName: any
productname: any

    constructor(quantity: number, productId: string, cartId: string, total: number) {
        this.quantity = quantity
        this.productId = productId
        this.cartId = cartId
        this.total = total
    }
}
