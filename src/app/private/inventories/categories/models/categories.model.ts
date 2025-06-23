export interface ICategory {
  id: number;
  description: string;
}

export class Category {
  id: number;
  description: string;
  constructor(category: ICategory) {
    this.id = category.id;
    this.description = category.description;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface CategoryListResponse {
  data: Category[];
  paginate: Paginate;
}
