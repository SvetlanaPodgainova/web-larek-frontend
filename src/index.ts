import { EventEmitter } from './components/base/events';
import { PageData } from './components/data/PageData';
import { CardGallery, CardPreview, CardInBasket } from './components/view/CardView';
import { PageView } from './components/view/PageView';
import '/src/scss/styles.scss';
import { IContactsForm, IPaymentForm} from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/base/LarekApi';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { PaymentForm } from './components/view/PaymentForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessOrder } from './components/view/SuccessOrder';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// темплейты
const catalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog') // карточка в галерее
const previewTemplate: HTMLTemplateElement = document.querySelector('#card-preview') // превью товара
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket') // корзина товаров(рамка)
const basketContentTemplate: HTMLTemplateElement = document.querySelector('#card-basket') // контент для корзины
const paymentTemplate: HTMLTemplateElement = document.querySelector('#order') // для модалки со способами оплаты
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts') // для модалки с контактами пользователя
const succesTemplate: HTMLTemplateElement = document.querySelector('#success') // для модалки успешного заказа

// экземпляры классов
const pageData = new PageData(events);
const pageView = new PageView(ensureElement('.gallery'), events)
const modal = new ModalView(ensureElement('#modal-container'), events); // рамка для модалок
const cardInPreview = new CardPreview(cloneTemplate(previewTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const paymentForm = new PaymentForm(cloneTemplate(paymentTemplate), events)
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events)
const succesOrder = new SuccessOrder(cloneTemplate(succesTemplate), events);

//-------------------------------------------------------------------------------------------------------->

// Получаем картоки с сервера и отрисовываем

api.getProducts()
  .then(data => {
    pageData.items = data
  })
  .catch(err => console.log(err))

events.on('items:changed', () => {
  const productsHTMLArray = pageData.items.map(item => new CardGallery(cloneTemplate(catalogTemplate), events).render(item));
  pageView.render({ gallery: productsHTMLArray })
})


// Открытие превью карточки 

events.on('card:open', (data: { cardId: string }) => {
  const productItem = pageData.getItem(data.cardId);
  cardInPreview.toggleButtonText(productItem); // переключаем текст кнопки
  modal.render({ content: cardInPreview.render(productItem) });
}
)

// Добавляем/удаляем товар в корзине

events.on('basket:change', (data: { id: string }) => {
  const productItem = pageData.getItem(data.id);
  // в зависимости есть товар в корзине или нет меняется функционал кнопки
  productItem.inBasket
  ? (pageData.removeFromBasket(productItem), productItem.inBasket = false)
  : (pageData.addToBasket(productItem), productItem.inBasket = false)
  modal.close()
  pageView.counter = pageData.basket.length
})

// Заполняем и отрисовываем модалку корзины

events.on('basket:open', () => {
  // проверяем есть ли товар в корзине для кнопки
  basketView.setBasketOrderButton(pageData.basket.length)
  // для каждого продукта в корзине отрисовываем его темплейт
  const basketItem = pageData.basket.map((product, index) => {
    const cardInBasket = new CardInBasket(cloneTemplate(basketContentTemplate), events);
    cardInBasket.index = index
    return cardInBasket.render(product)
  })
  // контент модалки - отрисованная оболочка корзины, где список товаров - отрисованный темплейт
  modal.render({ content: basketView.render({ items: basketItem, totalPrice: pageData.getTotalBasketPrice() }) })
})

// Если продукт удалили из корзины в модальном окне, удаляем его из массива, перерисовываем корзину и счетчик
events.on('basket:remove', (data: { id: string }) => {
  pageData.removeFromBasket(pageData.getItem(data.id));
  basketView.setBasketOrderButton(pageData.basket.length)
  modal.render({ content: basketView.render({ totalPrice: pageData.getTotalBasketPrice() }) })
  pageView.counter = pageData.basket.length;
})

// Оформление заказа 
// Способ оплаты

events.on('order:open', () => {
  modal.render({
    content: paymentForm.render({
      valid: false,
      errors: [],
      payment: '',
      address: '',
    })
  })
})

// изменения в полях формы оплаты

events.on(
  /^order\..*:change/,
  (data: { field: keyof IPaymentForm; value: string }) => {
    pageData.setPaymentFormField(data.field, data.value)
  }
);

// проверка валидации формы оплаты

events.on('form.payment:change', (errors: Partial<IPaymentForm>) => {
  const { address, payment } = errors;
  paymentForm.valid = !payment && !address;
  paymentForm.errors = Object.values({ payment, address })
    .filter((i) => !!i)
    .join('; ');
})

// Контактные данные

events.on('order:submit', () => {
  modal.render({
    content: contactsForm.render({
      valid: false,
      errors: [],
      phone: '',
      email: '',
    })
  })
})

// Изменения в полях формы 

events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IContactsForm; value: string }) => {
    pageData.setContactsFormField(data.field, data.value);
  }
);

// Проверка валидации формы 

events.on('form.contacts:change', (errors: Partial<IContactsForm>) => {
  const { email, phone } = errors;
  contactsForm.valid = !email && !phone;
  contactsForm.errors = Object.values({ email, phone })
    .filter((i) => !!i)
    .join('; ');
})

// Завершение оформления заказа

events.on('contacts:submit', () => {
  api.addOrder({ ...pageData.order, items: pageData.basket.map((products) => products.id), total: pageData.getTotalBasketPrice() })
    .then((res) => {
      pageData.clearBasket();
      pageData.clearOrder();
      pageView.counter = 0;
      modal.render({ content: succesOrder.render({ total: res.total }) })
    })
    .catch((error) => {
      console.log(error);
    });
})

events.on('order:close', () => {
  modal.close()
})
