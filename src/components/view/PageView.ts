import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IPage {
  gallery: HTMLElement[];
  counter: number;
  locked: boolean;
}

export class PageView extends Component<IPage> {

  protected productContainer: HTMLElement;
  protected basketIcon: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.productContainer = ensureElement('.gallery');
    this.basketIcon = ensureElement(".header__basket") as HTMLButtonElement;
    this.basketCounter = ensureElement('.header__basket-counter');

    this.basketIcon.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set gallery(items: HTMLElement[]) {
    this.productContainer.replaceChildren(...items)
  }

  set counter(value: number) {
    this.setText(this.basketCounter, value.toString())
  }
}