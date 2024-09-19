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

// Интерфейс для объекта пользователя, который отправляем на сервер

export interface IOrderData {
  payment: string;
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

// Интерфейс для ошибок

export type FormErrors = Partial<Record<keyof IOrderData, string>>;





