import { IOrderResult } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class SuccessOrder extends Component<IOrderResult> {
  protected _close: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this._total = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );
    this._close = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    )
  }

  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}
