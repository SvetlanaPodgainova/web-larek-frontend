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
const basketView = new BasketView(cloneTemplate(basketTemplate), events) // рамка корзины



//-------------------------------------------------------------------------------------------------------->

// Получаем картоки с сервера и отрисовываем

api.getProducts()
  .then(data => {
    pageData.items = data
  })
  .catch(err => console.log(err))

events.on("items:changed", () => {
  const productsHTMLArray = pageData.items.map(item => new CardGallery(cloneTemplate(catalogTemplate), events).render(item));
  pageView.render({ gallery: productsHTMLArray })
})

// Открытие превью карточки 

events.on("card:open", (data: { cardId: string }) => {
  const productItem = pageData.getItem(data.cardId);
  
  cardInPreview.toggleButtonText(productItem); // переключаем текст кнопки
  modal.render({ content: cardInPreview.render(productItem) });     
}
)

// Добавляем/удаляем товар в корзине

events.on('basket:change', (data: { id: string }) => {
  const productItem = pageData.getItem(data.id);

  productItem.inBasket
    ? pageData.removeFromBasket(productItem)
    : pageData.addToBasket(productItem);
 
  modal.close()
  pageView.counter = pageData.getTotalBasketCount()  
})

events.on('basket:open', () => {
basketView.list =  pageData.basket.map(product => {
  const basketItem = new CardInBasket(cloneTemplate(basketContentTemplate), events);
  return basketItem.render(product)})
  modal.open()

//   pageData.basket.map(product => {
//     const basketItem = new CardInBasket(cloneTemplate(basketContentTemplate), events);
//     return basketItem.render(product)
  
//  })


 	// берем товары из модели корзины, инстанцируем для них карточки, рендерим и сохраняем в товары вьюшки корзины
  //  basket.items = basketModel.products.map((item, index) => {
	// 	const basketItem = new Card('card', cloneTemplate(basketItemTemplate);
	// 	basketItem.basketIndex = index + 1; //записываем индекс товара чтобы отображать нумерованный список
	// 	return basketItem.render(item);
	// });


	// Обновляет состояние корзины и уведомляет об изменениях
	// updateBasket() {
	// 	this.emitChanges('counter:changed', this.basket);  // Обновление счетчика товаров
	// 	this.emitChanges('basket:changed', this.basket);  // Обновление корзины
	// }
 
    
  // })


  // const cards = pageData.basket.map((products) => {
  //   const cardInBasket = new CardInBasket(cloneTemplate(besketContentTemplate), events);
  //  cardInBasket.render(products)
  //  console.log(cardInBasket.render(products));
   
    
  // })
  // // basketView.list
  // // modal.render({content: basketView.render({basketList: cards, totalPrice: pageData.getTotalBasketPrice()})})
  // modal.open()
})




// const ggg : IProduct = {
//   category: "string",
//   id: "string",
//   description: "string",
//   image: "string",
//   title: "string",
//   price:  null
  
// }

