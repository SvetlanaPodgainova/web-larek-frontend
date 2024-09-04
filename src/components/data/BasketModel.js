export class BasketModel {
    constructor() {
        this.basket = [];
        this.total = 0;
    }
    addItem(id) { } // добавляет товар по айди в корзину
    removeItem(id) { } // удаляет товар из корзины
    getTtotal(price) {
        return;
    } // считает итоговую цену всех товаров
    getCount(basket) {
        return;
    } // возвращает кол-во товаров в корзине
}
