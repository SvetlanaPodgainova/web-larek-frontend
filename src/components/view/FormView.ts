import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class FormView<T> extends Component<IFormState> {

  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement('button[type=submit]', this.container) as HTMLButtonElement;
    this._errors = ensureElement('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement; // инпут
      const field = target.name as keyof T; // имя инпута - ключ
      const value = target.value; // введённые данные в инпут
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
      console.log(`Emitting event: ${this.container.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }


  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    this._submit.disabled = !valid;
    return this.container;
  }
}
