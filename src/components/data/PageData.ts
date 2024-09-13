import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class PageData {

  protected _items: IProduct[] = [];
  protected _basket: IProduct[] = []

  constructor(protected events: IEvents) { }

  set items(products: IProduct[]) {
    this._items = products;
    this.events.emit('items:changed')
  }

  get items() {
    return this._items
  }

  getItem(id: string): IProduct {
    return this.items.find((item) => item.id === id);
  }

  addToBasket(item: IProduct): void {
    item.inBasket = true;
    this._basket.push(item);
  }

  removeFromBasket(item: IProduct): void {
    item.inBasket = false;
    this._basket = this._basket.filter((basketItem) => basketItem.id !== item.id);
  }

  getTotalBasketPrice(): number {
    return this._basket.reduce((acc, item) => acc + item.price, 0);
  }

  get basket() {
    return this._basket
  }
}
