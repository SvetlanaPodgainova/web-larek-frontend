import { Api } from "../base/api";
export class LarekApi extends Api {
    constructor(cdn, baseUrl, options) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getProducts() {
        return this.get('/product/')
            .then((data) => data.items.map((item) => (Object.assign(Object.assign({}, item), { image: this.cdn + item.image }))));
    }
    addOrder(data) {
        return this.post('/order', data)
            .then((data) => data);
    }
}
