// Интерфейс товара

export interface IProduct {
  category: TProductCategory;
  id: string;
  description: string;
  image: string;
  title: string;
  price: number | null;
  inBasket?: boolean;
}

// Тип категории товаров

export type TProductCategory = "софт-скил" | "кнопка" | "другое" | "хард-скил" | "дополнительное";

// Тип оплаты

export type TPaymentMethod = "online" | "offline"

// Интерфейс для объекта пользователя, который отправляем на сервер

export interface IOrder {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Интерфейс для формы олпаты

export interface IPaymentForm {
	payment: string;
	address: string;
}

// Интерфейс для формы контактов

export interface IContactsForm {
  email: string;
  phone: string;
}

// Интерфейс для уcпешного заказа

export interface IOrderResult {
  id: string;
  total: number;
}





