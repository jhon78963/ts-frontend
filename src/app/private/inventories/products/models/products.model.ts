export interface IProduct {
  id: number;
  name: string;
  description: string;
  salePrice: number;
  purchasePrice: number;
  image: string;
  stock: number;
  minStock: number;
  expirationDate: string | Date | null;
  status: string;
  categoryId: number;
  brandId: number;
  measurementId: number;
}

export class Product {
  id: number;
  name: string;
  description: string;
  salePrice: number;
  purchasePrice: number;
  image: string;
  stock: number;
  minStock: number;
  expirationDate: string | Date | null;
  status: string;
  categoryId: number;
  brandId: number;
  measurementId: number;
  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.salePrice = product.salePrice;
    this.purchasePrice = product.purchasePrice;
    this.image = product.image;
    this.stock = product.stock;
    this.minStock = product.minStock;
    this.expirationDate = product.expirationDate;
    this.status = product.status;
    this.categoryId = product.categoryId;
    this.brandId = product.brandId;
    this.measurementId = product.measurementId;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface ProductListResponse {
  data: Product[];
  paginate: Paginate;
}

export enum ProductStatus {
  AVAILABLE = 'Disponible',
  LIMITED_STOCK = 'Stock limitado',
  OUT_OF_STOCK = 'Fuera de stock',
  DISCONTINUED = 'Discontinuado',
}
