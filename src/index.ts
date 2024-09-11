import { EventEmitter } from './components/base/events';
import { PageData } from './components/data/PageData';
import { CardGallery, cardPreview, cardBasket } from './components/view/CardView';
import { PageView } from './components/view/PageView';
import './scss/styles.scss';
import { IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/base/LarekApi';
import { ModalView } from './components/view/ModalView';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// темплейты
const catalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog') // карточка в галерее
const previewTemplate: HTMLTemplateElement = document.querySelector('#card-preview') // превью товара
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket') // корзина товаров
const orderTemplate: HTMLTemplateElement = document.querySelector('#order') // модалка оформления заказа
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts') // модалка с контактами пользователя
const succesTemplate: HTMLTemplateElement = document.querySelector('#contacts') // модалка успешного заказа


// экземпляры класса дан
const pageData = new PageData(events);
const page = new PageView(ensureElement('.gallery'), events)
const modal = new ModalView(ensureElement('#modal-container'), events);


//-------------------------------------------------------------------------->

// Получаем картоки с сервера и отрисовываем

api.getProducts()
  .then(data => {
    pageData.items = data
  })
  .catch(err => console.log(err))

events.on("items:changed", () => {
  const productsHTMLArray = pageData.items.map(item => new CardGallery(cloneTemplate(catalogTemplate), events).render(item));
  page.render({ gallery: productsHTMLArray })
})

// Открытие превью карточки 


events.on("card:open", (data: { cardId: string }) => {
  const productItem = pageData.getItem(data.cardId);
  const cardInPreview = new cardPreview(cloneTemplate(previewTemplate), events);
  cardInPreview.toggleButtonText(productItem);
  modal.render({ content: cardInPreview.render(productItem) });
  // events.emit("basket:changed", productItem)
}
)

// Добавляем/удаляем товар в корзине


  // events.on('basket:changed', (data: {cardId: string }) => {
  //     pageData.basket.some((product) => product.id === data.cardId)
  //     ? pageData.removeFromBasket(data.cardId)
  //     : pageData.addToBasket(data.cardId);

  // });
  

