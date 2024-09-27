import { IProduct, TProductCategory } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

class CardView extends Component<IProduct> {

  protected productTitle: HTMLElement;
  protected productPrice: HTMLSpanElement;
  protected productId: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.events = events;

    this.productTitle = ensureElement('.card__title', this.container);
    this.productPrice = ensureElement('.card__price', this.container);
  }

  set title(value: string) {
    this.setText(this.productTitle, value)
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this.productPrice, `Бесценно`);
    } else {
      this.setText(this.productPrice, `${value} синапсов`);
    }
  }

  set id(value: string) {
    this.productId = value
  }

  get id() {
    return this.productId
  }
}

export class CardGallery extends CardView {

  protected productCategory: HTMLSpanElement;
  protected productImage: HTMLImageElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.productCategory = ensureElement('.card__category', this.container);
    this.productImage = ensureElement('.card__image', this.container) as HTMLImageElement;

    if (this.container.classList.contains('gallery__item')) {
      this.container.addEventListener('click', () => {
        this.events.emit('card:open', { cardId: this.productId });
      })
    }
  }

  set image(image: string) {
    this.setImage(this.productImage, image, this.title)
  }

  CategoryСolor: { [key: string]: string } = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
    'кнопка': 'card__category_button',
  };

  set category(value: string) {
    this.setText(this.productCategory, value);
    if (this.productCategory) {
      this.toggleClass(this.productCategory, this.CategoryСolor[value], true);
    }
  }
}

export class CardPreview extends CardGallery {

  protected productDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.productDescription = ensureElement('.card__text') as HTMLParagraphElement;
    this.cardButton = ensureElement('.card__button', this.container) as HTMLButtonElement;

    this.cardButton.addEventListener('click', () => {
      this.events.emit('basket:change', { id: this.productId })
    })
  }

  set description(value: string) {
		this.setText(this.productDescription, value);
	};

  set price(value: number | null) {
    if (value === null) {
      this.setDisabled(this.cardButton, true)
      this.setText(this.cardButton, "Товар бесценен")

    } else {
      this.setDisabled(this.cardButton, false)
    }
  }

  toggleButtonText(item: IProduct) {
    if (item.inBasket) {
      this.setText(this.cardButton, 'Удалить из корзины');
    } else {
      this.setText(this.cardButton, 'В корзину');
    }
  }
}

export class CardInBasket extends CardView {

  protected productIndex: HTMLSpanElement;
  protected basketDeleteButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.productIndex = ensureElement('.basket__item-index', this.container);
    this.basketDeleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;

    this.basketDeleteButton.addEventListener('click', () => {
      this.container = null;
      events.emit('basket:remove', { id: this.productId })
    })
  }

  set index(index: number) {
    this.setText(this.productIndex, `${index + 1}`)    
  }
}
