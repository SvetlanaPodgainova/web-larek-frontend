import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class ProductsModel {

  protected _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItem(id: string): IProduct {
    return this.items.find((item) => item.id === id);
  }; // возвращает один товар для использования

  set items(products: IProduct[]) {
    this._items = products;
    this.events.emit("items:changed")}

  get items() {
    return this._items
  }
   
  }




