export class OrderModel {
    constructor() {
        this.items = [];
        this.total = null;
        this.payment = undefined;
        this.address = '';
        this.email = '';
        this.phone = '';
    }
    setOrderInfo(order) {
        this.payment = order.payment;
        this.address = order.address;
        this.phone = order.phone;
        this.email = order.email;
        this.total = order.total;
        this.items = order.items;
    } // сохраняем данные для заказа
    getUserData() { } // получаем данные пользователя
    checkValidation() { } // проверяем валидацию
    clearOrder() { } // очищает форму заказа
}
