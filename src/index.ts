import { EventEmitter } from './components/base/events';
import { ProductsModel } from './components/data/ProductsModel';
import { ProductView } from './components/view/ProductView';
import { PageView } from './components/view/PageView';
import './scss/styles.scss';
import { IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/data/LarekApi';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const products = new ProductsModel(events);

const page = new PageView(ensureElement('.gallery'), events)

const catalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog')
const previewTemplate: HTMLTemplateElement = document.querySelector('card-preview')


api.getProducts()
.then(data => {
  products.items = data   
})
.catch(err => console.log(err))

events.on("items:changed", () => {
 const productsHTMLArray = products.items.map(item => new ProductView(cloneTemplate(catalogTemplate), events).render(item));    
 page.render({gallery: productsHTMLArray}) 
})






