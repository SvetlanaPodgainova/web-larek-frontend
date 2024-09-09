import { IProduct } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class BasketView extends Component<IProduct> {

  protected basketList: HTMLUListElement;
  protected basketOrderButton: HTMLButtonElement;
  protected basketPrice: HTMLSpanElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.basketList = ensureElement('.basket__list', this.container) as HTMLUListElement;
    this.basketOrderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
    this.basketPrice = ensureElement('.basket__price', this.container);

    this.basketOrderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set price(value: number) {
    this.setText(this.basketPrice, `${value} синапсов`);
  }

  set list(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
    } else {
      this.basketList.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        }))
      this.basketOrderButton.disabled = true
    }

  }
}
