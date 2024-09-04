import { IProduct } from "../../types";
import { IEvents } from "../base/events"

export class BasketModel {

  protected basket: IProduct[] = []

  constructor(protected events: IEvents) { }

  addItem(item: IProduct): void {
    this.basket.push(item);
    this.events.emit("basket:changed")
  } // добавляет товар по айди в корзину

  removeItem(id: string): void {
    this.basket = this.basket.filter(item => item.id !== id);
    this.events.emit("basket:changed")
  } // удаляет товар из корзины

  get total(): number {
    return this.basket.reduce((acc, item) => acc + item.price, 0);
  } // считает итоговую цену всех товаров

  get count(): number {
    return this.basket.length
  }

}