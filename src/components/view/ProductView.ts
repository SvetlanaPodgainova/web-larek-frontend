import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class ProductView extends Component<IProduct> {

  protected productCategory: HTMLSpanElement;
  protected productTitle: HTMLElement;
  protected productImage: HTMLImageElement
  protected productPrice: HTMLSpanElement;
  protected productId: string


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.productCategory = ensureElement('.card__category', this.container);
    this.productTitle = ensureElement('.card__title', this.container);
    this.productImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.productPrice = ensureElement('.card__price', this.container);
    this.container.addEventListener('click', () => this.events.emit('card:open', { id: this.productId }))

  }

  set category(value: string) {
    this.setText(this.productCategory, value)
  }

  set title(value: string) {
    this.setText(this.productTitle, value)
  }

  set image(image: string) {
    this.setImage(this.productImage, image, this.title)
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this.productPrice, `Бесценно`)
    } else {
      this.setText(this.productPrice, `${value} синапсов`)
    }
  }

  set id(value: string) {
    this.productId = value
  }

  render(data: Partial<IProduct>): HTMLElement {
    Object.assign(this as object, data) // добавляет св-сва из data в наш объект this
    return this.container
  }

}

class ProductPreview extends ProductView {
  protected productDescription: HTMLElement
  protected cardButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events)

    this.productDescription = ensureElement(".card__text", this.container);
    this.cardButton = ensureElement('.card__button', this.container) as HTMLButtonElement;

    this.cardButton.addEventListener('click', () => console.log(this.productId));    
    this.cardButton.addEventListener('click', () => this.events.emit('basket:changed', { id: this.productId }))
  }

  set description(value: string) {
    this.setText(this.productDescription, value)
   
  }


}

