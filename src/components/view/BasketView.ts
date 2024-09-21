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
  protected _basketOrderButton: HTMLButtonElement;
  protected basketTotalPrice: HTMLSpanElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.basketList = ensureElement('.basket__list', this.container);
    this._basketOrderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
    this.basketTotalPrice = ensureElement('.basket__price', this.container);

    this._basketOrderButton.addEventListener('click', () => {
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
    }
  }

  setBasketOrderButton(length: number){
    length > 0
      ? this.setDisabled(this._basketOrderButton, false)
      : this.setDisabled(this._basketOrderButton, true);
  }
}
