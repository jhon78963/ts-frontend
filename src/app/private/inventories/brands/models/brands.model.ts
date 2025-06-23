export interface IBrand {
  id: number;
  description: string;
}

export class Brand {
  id: number;
  description: string;
  constructor(brand: IBrand) {
    this.id = brand.id;
    this.description = brand.description;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface BrandListResponse {
  data: Brand[];
  paginate: Paginate;
}
