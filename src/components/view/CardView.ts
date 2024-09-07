import { IProduct, TProductCategory } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class CardView extends Component<IProduct> {

  protected productCategory: HTMLSpanElement;
  protected productDescription: HTMLElement;
  protected productImage: HTMLImageElement;
  protected productTitle: HTMLElement;
  protected productPrice: HTMLSpanElement;
  protected basketButton: HTMLButtonElement;
  protected productId: string;


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.events = events;
    this.productCategory = ensureElement('.card__category', this.container);
    this.productDescription = ensureElement('.card__text') as HTMLParagraphElement;
    this.productImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.productTitle = ensureElement('.card__title', this.container);
    this.productPrice = ensureElement('.card__price', this.container);
    this.basketButton = this.container.querySelector('.card__button');

    this.container.addEventListener('click', () => this.events.emit('card:open', { cardId: this.productId }));

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

  get id() {
    return  this.productId
  }

  render(data: Partial<IProduct>): HTMLElement {
    Object.assign(this as object, data) // добавляет св-сва из data в наш объект this
    return this.container
  }

}

class ProductPreview extends CardView {
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

