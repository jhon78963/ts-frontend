import { Product } from '../../../inventories/products/models/products.model';

export interface ISale {
  id: number;
  date: string | Date;
  status: number;
  customerId: number;
  products: Product[];
}

export class Sale {
  id: number;
  date: string | Date;
  status: number;
  customerId: number;
  products: Product[];
  constructor(sale: ISale) {
    this.id = sale.id;
    this.date = sale.date;
    this.status = sale.status;
    this.customerId = sale.customerId;
    this.products = sale.products;
  }
}

export interface SaleResponse {
  message: string;
  saleId: number;
}
