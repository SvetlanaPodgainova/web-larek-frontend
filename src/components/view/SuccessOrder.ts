import { IOrderResult } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class SuccessOrder extends Component<IOrderResult> {
  protected _close: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this._total = ensureElement('.order-success__description', this.container);
    this._close = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

    this._close.addEventListener("click", () =>{
      this.events.emit('order:close')})
  }

  set total(value: number) { 
    this.setText(this._total, `Списано ${value} синапсов`)
  }
}
