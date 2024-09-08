import { IOrderResult, IProduct, IOrderData } from "../../types";
import { Api, ApiListResponse } from "./api";


export class LarekApi extends Api {

  readonly cdn: string; 

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  getProducts(): Promise<IProduct[]> {
    return this.get('/product/')
    .then((data: ApiListResponse<IProduct>) =>
        data.items.map((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
}

  addOrder(data: IOrderData): Promise<IOrderResult> {
    return this.post('/order', data)
    .then((data: IOrderResult) => data)
  }
}

