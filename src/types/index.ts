// Интерфейс товара

export interface IProduct {
  category: string;
  id: string;
  description: string;
  image: string;
  title: string;
  price: number | null;
}

// Тип категории товаров

export type TProductCategory = "софт-скил" | "кнопка" | "другое" | "хард-скил" | "дополнительное";

// Тип оплаты

export type TPaymentMethod = "online" | "offline"

// Интерфейс для объекта пользователя, который отправляем на сервер

export interface IOrderData {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Интерфейс для умпешного заказа

export interface IOrderResult {
  id: string;
  total: number;
}





