import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalData {
  content: HTMLElement;
}

export class ModalView extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected wrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
    this._content = ensureElement('.modal__content', container) as HTMLElement;
    this.wrapper = ensureElement('.page__wrapper');

    this._content.addEventListener('click', evt => evt.stopPropagation())
    this.closeButton.addEventListener('click', this.close.bind(this));

    this.handleEscape = this.handleEscape.bind(this) // по нажатию на esc
    
    this.container.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEscape)
    this.events.emit('modal:open');   
    this.wrapper.classList.add('page__wrapper_locked') 
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    document.removeEventListener('keydown', this.handleEscape);
    this.events.emit('modal:close');
    this.wrapper.classList.remove('page__wrapper_locked') 
  }

  handleEscape(evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      this.close();
    }
  };

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}