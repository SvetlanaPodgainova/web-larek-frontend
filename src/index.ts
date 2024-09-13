import { EventEmitter } from './components/base/events';
import { PageData } from './components/data/PageData';
import { CardGallery, cardPreview, CardInBasket } from './components/view/CardView';
import { PageView } from './components/view/PageView';
import './scss/styles.scss';
import { IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/base/LarekApi';
import { ModalView } from './components/view/ModalView';
import { BasketView } from './components/view/BasketView';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// темплейты
const catalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog') // карточка в галерее
const previewTemplate: HTMLTemplateElement = document.querySelector('#card-preview') // превью товара
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket') // корзина товаров
const basketContentTemplate: HTMLTemplateElement = document.querySelector('#card-basket') // контент для корзины
const orderTemplate: HTMLTemplateElement = document.querySelector('#order') // модалка оформления заказа
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts') // модалка с контактами пользователя
const succesTemplate: HTMLTemplateElement = document.querySelector('#contacts') // модалка успешного заказа


// экземпляры классов
const pageData = new PageData(events);
const pageView = new PageView(ensureElement('.gallery'), events)
const modal = new ModalView(ensureElement('#modal-container'), events); // рамка для модалок

const cardInPreview = new cardPreview(cloneTemplate(previewTemplate), events);
// const basketView = new BasketView(cloneTemplate(basketTemplate), events) // рамка корзины



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

// Заполняем и отрисовываем модалку корзины

events.on('basket:open', () => {
  const basketView = new BasketView(cloneTemplate(basketTemplate), events) // оболочка корзины
  // для каждого продукта в корзине отрисовываем его темплейт
  const basketItem = pageData.basket.map((product, index) => {
    const cardInBasket = new CardInBasket(cloneTemplate(basketContentTemplate), events);
    cardInBasket.index = index
    return cardInBasket.render(product)
  })
  // контент модалки - отрисованная оболочка корзины, где список товаров - отрисованный темплейт
  modal.render({content: basketView.render({items: basketItem, totalPrice: pageData.getTotalBasketPrice()}) })
})

// Если продукт удалили из корзины, удаляем его из массива и перерисовываем счетчик
events.on('basket:remove', (data: {id: string}) => {
  pageData.removeFromBasket(pageData.getItem(data.id));
  pageView.counter = pageData.basket.length 
})

// Оформление заказа
events.on('order:open', () => {
  const 
  modal.render({content: })
})




// const ggg : IProduct = {
//   category: 'string',
//   id: 'string',
//   description: 'string',
//   image: 'string',
//   title: 'string',
//   price:  null
  
// }

