import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalData {
  content: HTMLElement;
}

export class ModalView extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
      this._content = ensureElement('.modal__content', container) as HTMLElement;

      this.closeButton.addEventListener('click', this.close.bind(this));
      this.container.addEventListener('click', this.close.bind(this));
      this.content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
      this._content.replaceChildren(value);
  }

  open() {
      this.container.classList.add('modal_active');
      this.events.emit('modal:open');
  }

  close() {
      this.container.classList.remove('modal_active');
      this._content = null;
      this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
      super.render(data);
      this.open();
      return this.container;
  }
}