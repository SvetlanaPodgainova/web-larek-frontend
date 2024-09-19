import { IProduct } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IBasketView {
  items: HTMLElement[];
  totalPrice: number;
}

export class BasketView extends Component<IBasketView> {

  protected basketList: HTMLElement;
  protected basketOrderButton: HTMLButtonElement;
  protected basketTotalPrice: HTMLSpanElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.basketList = ensureElement('.basket__list', this.container);
    this.basketOrderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
    this.basketTotalPrice = ensureElement('.basket__price', this.container);

    this.basketOrderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set totalPrice(value: number) {
    this.setText(this.basketTotalPrice, `${value} синапсов`);
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);

    } else {
      this.basketList.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'В корзине пусто, корзине грустно :(',
        }))
      this.basketOrderButton.disabled = true;
      
    }
  }

  set buttonToggler(items: string[]) {
    if (!items.length) {
        this.setDisabled(this.basketOrderButton, true);
    } else {
        this.setDisabled(this.basketOrderButton, false);
    }
}

}
