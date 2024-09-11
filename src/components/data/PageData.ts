import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class PageData {

  protected _items: IProduct[] = [];
  protected _basket: IProduct[] = []

  constructor(protected events: IEvents) {}

  getItem(id: string): IProduct {
    return this.items.find((item) => item.id === id);
  }; // возвращает один товар для использования

  // addToBasket(item: IProduct): void {
  //   this.basket.push(item);
  //   // item.inBasket = true;
  //   this.events.emit("basket:changed")
  // } // добавляет товар по айди в корзину

  addToBasket(id: string): void {
    const item = this.getItem(id);
    if (item) {
      this.basket.push(item);
      item.inBasket = true;
      
      
    } console.log("add");
  }

  removeFromBasket(id: string): void {
    this._basket = this._basket.filter(basketItem => basketItem.id === id);
    item.inBasket = false;
    // this.events.emit("basket:changed")
  } // удаляет товар из корзины

  // removeFromBasket(id: string): void {
  //   this._basket = this._basket.filter((basketItem) => basketItem.id === item.id);
  //   // item.inBasket = false;
  //   this.events.emit("basket:changed")
  // } // удаляет товар из корзины

//   set basket(products: IProduct) {
// this._basket = products
//   }
set basket(products: IProduct[]) {
  this._basket = products;
  }

  get basket() {
    return this._basket
  }

  set items(products: IProduct[]) {
    this._items = products;
    this.events.emit("items:changed")}

  get items() {
    return this._items
  }
   
  }




