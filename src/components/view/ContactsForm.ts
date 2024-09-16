import { IContactsForm } from "../../types";
import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export class ContactsForm extends FormView<IContactsForm> {
  
  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}