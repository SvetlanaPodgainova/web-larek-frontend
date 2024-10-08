# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Основные типы данных, используемые в приложении

#### Интерфейс IProduct

Пердназначен для объекта продукта.

- category: string - категория товара;
- id: string - Id товара;
- description: string - описание товара;
- image: string - изображение товара;
- title: string - название товара;
- price: number | null - цена товара (может быть числом либо null для бесценного товара);
- inBasket?: boolean - булевое значение, свойство показывает наличие/отсутствие товара в корзине;

#### Интерфейс IOrderData

Предназначен для объекта с заказом, который отправляем на сервер.

Свойства:
- payment: string - метод оплаты заказа.
- email: string - электронная почта пользователя.
- phone: string - номер телефона пользователя.
- address: string - адрес пользователя.
- total: number - общая стоимость заказа.
- items: string[] - массив товаров в заказе.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой данных, отвечает за хранение и изменение данных
- слой представления, отвечает за отображение данных на странице,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов.\

В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.\

Методы:

- get - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- post - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- handleResponse - принимает ответ от сервера и в зависимости от успешности выполнения запроса возвращает ответ с промисом либо ошибку.

#### Класс EventEmitter

Представляет собой брокер событий.\
Уведомляет о создании событий и подписывается на них.

Методы:

- on — устанавливает обработчки для события.
- off - снимает обработчки с события.
- emit - инициирует событие с данными.
- onAll - включает подписки на все события.
- offAll — выключает подписки на все события.
- trigger - возвращает функцию, генерирующую событие при вызове.

#### Класс Component

Осуществляет управление DOM-элементами.

Конструктор принимает контейнер (HTMLElement), куда будет встраиваться компонент.

Методы:

- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает CSS класс для элемента.
- setText(element: HTMLElement, value: unknown) - устанавливает текстовое содержимое.
- setDisabled(element: HTMLElement, state: boolean) - делает элемент не активным.
- setHidden(element: HTMLElement) - скрывает элемент.
- setVisible(element: HTMLElement) - показывает элемент.
- setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает алтернативное описание для изображения.
- render(data?: Partial): HTMLElement - возвращает корневой DOM-элемент.


### Слой коммуникации

#### Класс LarekApi

Наследуется от базового класс Api.\
Предоставляет методы для взаимодействия с бэкендом для получения данных товаров, а так же отправки заказа пользователя.

Конструктор принимает:

- baseUrl - базовый URL-адрес приложения.
- cdn - URL CDN, используемый для загрузки изображений товаров.
- options - объект, содержащий дополнительные параметры конфигурации.

Методы:

- getProducts() - отправляет GET запрос для получения данных о товаре.
- addOrder(data) - в качестве параметра принимает объект данных о заказе пользователя и отправляет POST запрос на сервер.

### Слой работы с данными

#### Класс PageData

Класс предназначен для работы с данными всего приложения.\
Обеспечивает функционал для каталога товаров, корзины и заказа пользователя.

Поля класса:

- \_items - массив для хранения товаров.
- _basket - массив для хранения товаров, добавленных в корзину.
- _order - объект, где будут храниться данные для оформления заказа.
- formErrors - массив для хранения ошибок валидации.

Конструктор принимает объект events.

Методы:

- set items - сеттер принимает в качестве параметр массив типа IProduct и сохраняет его в поле \_items.
- get items - геттер возвращает сохраненный массив товаров из поля \_items.
- getItem(id: string) - принимает параметр Id товара и возвращает данные об еденице товара.
- get basket() - возвращает содержимое корзины.
- addToBasket(item: IProduct) - в качестве параметра принимает параметр типа IProduct и добавляет его в массив корзины.
-  removeFromBasket(item: IProduct) -  в качестве параметра принимает ппараметр типа IProduct и удаляет его из корзины.
- getTotalBasketPrice() - возвращает общую стоимость товаров из корзины.
- clearBasket() - очищает содержимое корзины.
- get order() - возвращает объект _order.
- setPaymentFormField(field: keyof IPaymentForm, value: string) - сохраняет данные, введенные в поле формы оплаты.
- setContactsFormField(field: keyof IContactsForm, value: string) - сохраняет данные, введенные в поле формы контактных данных.
- validatePaymentForm() - валидирует данные, введенные в поля формы оплаты.
- validateUserContacts() - валидирует данные, введенные в поля формы контактных данных.
- clearOrder() - очищает все значения объекта _order.

### Слой отображения

#### Класс PageView

Предназначен для отображения элементов на главной странице.

Поля класса:
- productContainer - контейнер для вывода карточки.
- basketIcon - иконка корзины на главной странице.
- basketCounter - элемент для вывода кол-ва товаров, добавленных в корзину.

Конструктор инициализирует поля класса.\
На иконку корзины вешается слушатель для генерации по клику события 'basket:open'.

Методы:
- set gallery(items: HTMLElement[]) - устанавливает содержимое контейнера.
- set counter(value: number) - устанавливает содержимое счетчика для корзины.

#### Класс CardView

Родительский класс для вывода данных о товаре в разных формах.\
Наследуется от базового класса Component.

Поля класса:

- productTitle - элемент разметки для отображения навзания продукта;
- productPrice - элемент разметки для отображения цены продукта;
- productId - Id товара;
- productCategory - элемент разметки для отображения категории продукта;
- productImage - элемент разметки для отображения фото продукта;
- productDescription - элемент разметки для отображения описания продукта;
- cardButton - элемент разметки кнопки в карточке товара;
- productIndex - элемент разметки для отображения нумерации продукта;

Конструктор в качестве параметров принимает элемент разметки будущего контейнера для вывода данных и объект для событий.\
Инициализирует поля класса productTitle и productPrice, которые являются общими для всех форм отображения данных о товаре, а так же объект events.\

В классе создан объект CategoryСolor для отображения категории товара, где ключ это название категории, а значение - CSS класс, который соответствует этому названию.

Методы класса:

- set category(value: string) - сеттер для определения CSS класса для категории, которая выступает параметром сеттера.
- set title(value: string) - сеттер принимает параметр типа string и устанавливает название товара.
- set image(image: string) - сеттер принимает параметр типа string и устанавливает изображение товара.
- set price(value: number | null) - сеттер принимает параметр типа number или null и устанавливает цену товара. В зависимости от параметра (number или null) устанавливает текст для отображения ("кол-во синапсов" или "Бесценно"), а так же переключает состояние кнопки "Оформить" на активно/неактивно.
- set id/get id - сеттер/геттер для сохранения/работы с Id товара, сеттер принимает параметр типа string, геттер возвращает Id товара.
- set index(index: number) - сеттер принимает параметр типа number и устанавливает порядковый номер товара текстом.

#### Класс CardGallery

Предназначен для отоброжения данных о продукте в галлерее товаров на главной странице.\
Наследуется от класса CardView.

Конструктор в качестве параметров принимает элемент разметки будущего контейнера для вывода данных и объект для событий.\

Инициализирует поля productCategory, productImage.\
На контейнер(карточку) устаниваливает слушатель для клика по карточке, который генерирует событие 'card:open'и передаёт объект со свойством Id продукта.

#### Класс CardPreview

Предназначен для отоброжения данных о продукте в модальном окне информации о товаре.\
Наследуется от класса CardView.

Конструктор в качестве параметров принимает элемент разметки будущего контейнера для вывода данных и объект для событий.\

Инициализирует поля productCategory, productImage, productDescription, cardButton.\
На кнопку карточки вешает слушатель для генерации события 'basket:change'.

#### Класс СardInBasket

Предназначен для отоброжения данных о продукте в модальном окне корзины с товарами.\
Наследуется от класса CardView.

Конструктор в качестве параметров принимает элемент разметки будущего контейнера для вывода данных и объект для событий.\
Инициализирует поля productIndex, cardButton.
На кнопку карточки вешает слушатель для генерации события 'basket:remove'.

#### Класс BasketView

Класс предназначен для отображения корзины товаров.\
Наследуется от базового класса Component.

Поля класса:

- basketList - элемент разметки для отображения списка товаров в корзине.
- basketOrderButton - элемент разметки для отображения кнопки оформления заказа в корзине.
- basketTotalPrice - элемент разметки для отображения итоговой стоимости товаров в корзине.

Конструктор:

Инициализирует поля класса.\
На конопку карточки устанавливает слушатель для генерации события 'order:open'.

Методы:

- set totalPrice(value: number) - устанавливает цену товара.
- set items(items: HTMLElement[]) - в завимиости от наличия товаров в корзине выводит их данные в список либо, при их отсутствии, создаёт элемент с уведомлением о том, что корзина пуста.
-  setBasketOrderButton(length: number) - переключает состояние кнопки в зависимости наличия товаров в корзине.

#### Класс ModalView

Класс предназанчен для работы с модальными окнами.\
Наследуется от базового класса Component.\

Поля класса:

- closeButton - кнопка для закрытия модального окна;
- \_content - область содержимого модального окна;
- wrapper - элемент разметки контейнера для контента всей страницы;

Конструктор в качестве параметров принимает элемент разметки будущего контейнера для вывода данных и объект для событий.\
Инициализирует поля класса.\
На контейнер добавляет обработчик события - при нажатии на оверлей модальное окно закрывается.\
На кнопку для закрытя добавляет обработчик закрытие модального окна по клику.\
На контент добавляет обработчик отмены всплытия.

Методы:

- set content(value: HTMLElement) - принимает в качестве параметра HTMLElement(темплейт) и устанавливает его как содержимое модального окна.
- open() - открывает модальное окно, генерирует событие "modal:open".\
  Вешает класс '.page\_\_wrapper_locked' на враппер страницы для фиксированного положения.
- close() - открывает модальное окно, генерирует событие "modal:closed".\
  Снимает класс '.page\_\_wrapper_locked' с враппера страницы.
- handleEscUp (evt: KeyboardEvent) - закрытие модального окна кливашей Escape.
- render(data: IModalData) - рендерит модальное окно с установленным контентом и открывает его методом open().

#### Класс FormView

Класс предназначен для отображения форм.\ 
Наследует базовый класс Componetnt.

Поля класса:
- _submit: HTMLButtonElement - элемент разметки кнопки для сабмита.
- _errors: HTMLElement - элемент разметки для вывода текста ошибки.

Конструктор принимает в качестве параметров контейнер для отрисовки данных и объект для работы с событиями.\
Инициализиурет поля класса.\
Добавляет слушателей на форму для сабмита и на инпуты для отслеживания изменений в полях ввода.

Методы:

- onInputChange(field: keyof T, value: string) - метод генерирует событие изменения для разных форм. Название события будет составляться из имени формы, имени инпута и "суфикса" ^change/ Событие передаёт объяк с данными имени поля и введённого в это поле значения.
- set valid - переключает состояние кнопки на активно/не активно в зависимости валидна форма или нет.
- set errors - устанавливает текстовое значения для ошибок при валидации.

В классе используется интерфейс IFormState для описания состояния формы.\

#### Класс PaymentForm

Предназначен для работы с отображением формы оплаты для пользователя.\
Наследуется от класса FormView.

В конструктор принимает HTML-элемент формы и экземпляр EventEmitter для инициализации событий.

Поля:

email: string - электронная почта пользователя.
phone: string - номер телефона пользователя.

Методы:

- set payment - сеттер для кнопки выбора способа оплаты.
- set address - сеттер для сохранения адреса.
- set valid - сеттер для состояния формы.

#### Класс ContactsForm

Предназначен для работы с отображением формы контактных данных пользователя.\
Наследуется от класса FormView.

Методы:

- set email(value: string)  - сеттер для установки электронной почты пользователя.
- set phone(value: string) - сеттер для установки номера телефона пользователя.

#### Класс ContactsForm

Предназначен для отображения сообщения об успешно оформленном заказе.

В конструктор принимает HTML-элемент формы и экземпляр EventEmitter для инициализации событий.
На кнопку для закрытия заказа вешает обработчик для генерации события 'order:close'.

Поля:

- close: HTMLButtonElement - кнопка для завершения заказа.
- total: HTMLElement - элемент для отображения общей суммы заказа.

Методы:

- set total(value: number) - сеттер для установки и отображения общей суммы заказа.

## Взаимодействие между компонентами

Презентор не будет выделен в отдельный класс, а будет реализовываться в основном скрипте index.ts

События приложения:

- items:changed - изменения массива товаров.
- card:open - открытие карточки товара из галереи.
- modal:open - открытие модального окна.
- modal:closed - закрытие модального окна.
- basket:open - открытие окна корзины с актуальным наполнением.
- basket:change - изменение корзины товаров.
- basket:remove - удаление товара из корзины в модальном окне.
- order:open - начало оформеления заказа, переход на форму оплаты.
- order:submit - переход от формы оплаты к контактным данным.
- form.address:change - изменение поля ввода ввода адреса для заказа.
- form.payment:change - изменение валидации формы оплаты.
- contacts.email:change - изменение поля ввода электронной почты в форме для контактов.
- contacts.phone:change - изменение поля ввода номера телефона в форме для контактов.
- form.contacts:change - изменение валидации формы контактных данных.
- contacts:submit - сохранение данных в форме для контактов переход к форме успещного заказа.
- 'order:close' - закрытие последнего окна после оформления заказа.
