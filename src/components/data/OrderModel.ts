import { IOrderData, TPaymentMethod } from "../../types";

export class OrderModel {
	protected items: string[] = [];
	protected total: number | null = null;
	protected payment: TPaymentMethod = undefined;
	protected address: string = '';
	protected email: string = '';
	protected phone: string = '';


	setOrderInfo(order: IOrderData) {
		this.payment = order.payment;
		this.address = order.address;
		this.phone = order.phone;
		this.email = order.email;
		this.total = order.total;
		this.items = order.items
	} // сохраняем данные для заказа

	getUserData() { } // получаем данные пользователя
	checkValidation() { } // проверяем валидацию
	clearOrder() { } // очищает форму заказа
}


