import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IPage {
  gallery: HTMLElement[];
  counter: number;
  locked: boolean;
}

export class PageView extends Component<IPage> {

  protected wrapper: HTMLElement;
  protected productContainer: HTMLElement;
  protected basketIcon: HTMLButtonElement;
  protected basketCounter: HTMLElement;
 
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.wrapper = ensureElement('.page__wrapper');
    this.productContainer = ensureElement('.gallery');
    this.basketIcon = ensureElement(".header__basket") as HTMLButtonElement;
    this.basketCounter = ensureElement('.header__basket-counter');

    this.basketIcon.addEventListener('click', () => {
      this.events.emit('bids:open');
    });
  }

  // св-ство gallery = this.productContainer с замененным на items контентом
  set gallery(items: HTMLElement[]) {
    this.productContainer.replaceChildren(...items)
  }

  set counter(value: number) {
    this.setText(this.basketCounter, value.toString())
  }

  set locked(value: boolean) {
    if (value) {
      this.wrapper.classList.add('page__wrapper_locked');
    } else {
      this.wrapper.classList.remove('page__wrapper_locked');
    }
  }
}