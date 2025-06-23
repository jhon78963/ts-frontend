import { Product } from '../../../inventories/products/models/products.mode';

export interface IOrder {
  id: number;
  date: string | Date;
  status: number;
  supplierId: number;
  products: Product[];
}

export class Order {
  id: number;
  date: string | Date;
  status: number;
  supplierId: number;
  products: Product[];
  constructor(order: IOrder) {
    this.id = order.id;
    this.date = order.date;
    this.status = order.status;
    this.supplierId = order.supplierId;
    this.products = order.products;
  }
}

export interface OrderResponse {
  message: string;
  orderId: number;
}
