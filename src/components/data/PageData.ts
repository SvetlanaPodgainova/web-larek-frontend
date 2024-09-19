import { FormErrors, IContactsForm, IPaymentForm, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class PageData {

  protected _items: IProduct[] = [];
  protected _basket: IProduct[] = [];
  protected formErrors: FormErrors = {};
  protected _order: IPaymentForm & IContactsForm = {
    payment: '',
    address: '',
    email: '',
    phone: ''
  };

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

  // Корзина

  get basket() {
    return this._basket
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

  clearBasket() {
    this._basket = [];
    this._items.forEach((product) => {
      product.inBasket = false
    })
  }

  // Заказ

  get order() {
    return this._order

  }

  setPaymentFormField(field: keyof IPaymentForm, value: string) {
    this._order[field] = value;
    if (this.validatePaymentForm()) {
      return;
    }
  }

  validatePaymentForm(): boolean {
    const errors: typeof this.formErrors = {};
    if (!this._order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this._order.address) {
      errors.address = 'Необходимо указать адрес доставки';
    }
    this.formErrors = errors;
    this.events.emit('form.payment:change', this.formErrors);
    return Object.keys(errors).length === 0; // ошибок нет - вернётся true
  }

  setContactsFormField(field: keyof IContactsForm, value: string) {
    this._order[field] = value;
    if (this.validateContactsForm()) {
      return;
    }
  }

  validateContactsForm(): boolean {
    const errors: typeof this.formErrors = {};
    if (!this._order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this._order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('form.contacts:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearOrder() {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}
}
