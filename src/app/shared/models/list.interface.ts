export interface Paginate {
  total: number;
  pages: number;
}

export interface ListResponse<T> {
  data: T[];
  paginate: Paginate;
}
