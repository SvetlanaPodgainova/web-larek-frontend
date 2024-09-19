import { IProduct, TProductCategory } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

class CardView extends Component<IProduct> {

  protected productTitle: HTMLElement;
  protected productPrice: HTMLSpanElement;
  protected productId: string;
  protected productCategory?: HTMLSpanElement;
  protected productImage?: HTMLImageElement;
  protected productDescription?: HTMLElement;
  protected cardButton?: HTMLButtonElement;
  protected productIndex?: HTMLSpanElement;
  protected basketDeleteButton?: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.events = events;

    this.productTitle = ensureElement('.card__title', this.container);
    this.productPrice = ensureElement('.card__price', this.container);
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
 
  set title(value: string) {
    this.setText(this.productTitle, value)
  }

  set image(image: string) {
    this.setImage(this.productImage, image, this.title)
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this.productPrice, `Бесценно`);
      this.setText(this.cardButton, 'Товар бесценен')
      this.setDisabled(this.cardButton, true)

    } else {
      this.setText(this.productPrice, `${value} синапсов`);
      this.setDisabled(this.cardButton, false)
    }
  }

  set id(value: string) {
    this.productId = value
  }

  get id() {
    return this.productId
  }

  set index(index: number) {
    this.setText(this.productIndex, `${index + 1}`);
  }

  protected deleteProduct () {
    this.container.remove();   
}
}

export class CardGallery extends CardView {

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
}

export class cardPreview extends CardView {

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.productCategory = ensureElement('.card__category', this.container);
    this.productImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.productDescription = ensureElement('.card__text') as HTMLParagraphElement;
    this.cardButton = ensureElement('.card__button', this.container) as HTMLButtonElement;

    this.cardButton.addEventListener('click', () => {
      this.events.emit('basket:change', { id: this.productId })
    })
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

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.productIndex = ensureElement('.basket__item-index', this.container);
    this.cardButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
   
    this.cardButton.addEventListener('click', () => {
      this.deleteProduct()
      this.container = null;
      events.emit('basket:remove', {id: this.productId})      
    })

  }
}

