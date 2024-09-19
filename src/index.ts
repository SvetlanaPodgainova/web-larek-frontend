import { EventEmitter } from './components/base/events';
import { PageData } from './components/data/PageData';
import { CardGallery, cardPreview, CardInBasket } from './components/view/CardView';
import { PageView } from './components/view/PageView';
import './scss/styles.scss';
import { IContactsForm, IPaymentForm, IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/base/LarekApi';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';
import { PaymentForm } from './components/view/PaymentForm';
import { ContactsForm } from './components/view/ContactsForm';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// темплейты
const catalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog') // карточка в галерее
const previewTemplate: HTMLTemplateElement = document.querySelector('#card-preview') // превью товара
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket') // корзина товаров
const basketContentTemplate: HTMLTemplateElement = document.querySelector('#card-basket') // контент для корзины
const paymentTemplate: HTMLTemplateElement = document.querySelector('#order') // для модалки со способами оплаты
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts') // для модалки с контактами пользователя
const succesTemplate: HTMLTemplateElement = document.querySelector('#contacts') // для модалки успешного заказа


// экземпляры классов
const pageData = new PageData(events);
const pageView = new PageView(ensureElement('.gallery'), events)
const modal = new ModalView(ensureElement('#modal-container'), events); // рамка для модалок
const basketView = new BasketView(cloneTemplate(basketTemplate), events); // оболочка корзины

const cardInPreview = new cardPreview(cloneTemplate(previewTemplate), events);
// const basketView = new BasketView(cloneTemplate(basketTemplate), events) // рамка корзины
const paymentForm = new PaymentForm(cloneTemplate(paymentTemplate), events)
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events)

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
// проверяем наличие товара в корзине
  productItem.inBasket
    ? pageData.removeFromBasket(productItem)
    : pageData.addToBasket(productItem);
 
  modal.close()
  pageView.counter = pageData.basket.length 
})


// // Изменение наполнения корзины
// events.on('shoppingCart:change', () => {

// 	shoppingCart.items = appData.shoppingCart.map((item, cartItemIndex) => {
// 		const card = new ProductCard(cloneTemplate(cardInShoppingCartTemplate), {
// 			onClick: () => {
// 				events.emit('cardInShoppingCart:remove', item);
// 				// Проверяем, не пора ли блокировать кнопку, если в корзине не осталось товаров
// 				shoppingCart.buttonToggler = appData.shoppingCart.map((item) => item.id)
// 			},
// 		});
// 		return card.render({
// 			cartItemIndex: cartItemIndex + 1,
// 			title: item.title,
// 			price: item.price,
// 		});
// 	});
// });


// Заполняем и отрисовываем модалку корзины

events.on('basket:open', () => {
    // для каждого продукта в корзине отрисовываем его темплейт
    const basketItem = pageData.basket.map((product, index) => {
    const cardInBasket = new CardInBasket(cloneTemplate(basketContentTemplate), events);
    cardInBasket.index = index
    basketView.buttonToggler = pageData.basket.map((item) => item.id)
    return cardInBasket.render(product)
  })
  // контент модалки - отрисованная оболочка корзины, где список товаров - отрисованный темплейт
  modal.render({content: basketView.render({items: basketItem, totalPrice: pageData.getTotalBasketPrice()}) })
})


const cardInBasket = new CardInBasket(cloneTemplate(basketContentTemplate), events);

// Если продукт удалили из корзины в модальном окне, удаляем его из массива,перерисовываем корзину и счетчик
events.on('basket:remove', (data: {id: string}) => {
  pageData.removeFromBasket(pageData.getItem(data.id));
  basketView.buttonToggler = pageData.basket.map((item) => item.id)

  modal.render({content: basketView.render({totalPrice: pageData.getTotalBasketPrice()}) })
  pageView.counter = pageData.basket.length;
  
})

// Оформление заказа 
// способ оплаты

events.on('order:open', () => {
  modal.render({content: paymentForm.render({
    valid: false,
    errors: [],
    payment: '',
    address: '',
  })})
})

// Изменения в полях формы оплаты

events.on(
	/^order\..*:change/,
	(data: { field: keyof IPaymentForm; value: string }) => {
    pageData.setPaymentFormField(data.field, data.value)		
	}
);

// Проверка валидации формы оплаты

events.on('form.payment:change', (errors: Partial<IPaymentForm>) => {
  const { address, payment } = errors;
  paymentForm.valid = !payment && !address;
  paymentForm.errors = Object.values({ payment, address })
  	.filter((i) => !!i)
		.join('; ');
})

// контактные данные

events.on('order:submit', () => {
    modal.render({content: contactsForm.render({
    valid: false,
    errors: [],
    phone: '',
    email: '',})})
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





// const ggg : IProduct = {
//   category: 'string',
//   id: 'string',
//   description: 'string',
//   image: 'string',
//   title: 'string',
//   price:  null
  
// }

