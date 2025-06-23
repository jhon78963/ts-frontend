import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';
import { Product, ProductListResponse } from '../models/products.mode';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products: Product[] = [];
  products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    this.products,
  );

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `products?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<ProductListResponse>(url).pipe(
      debounceTime(600),
      map((response: ProductListResponse) => {
        this.updateProducts(response.data);
        this.updateTotalProducts(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Product): Observable<void> {
    return this.apiService.post('products', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`products/${id}`);
  }

  edit(id: number, data: Product): Observable<void> {
    return this.apiService.patch(`products/${id}`, data);
  }

  getOne(id: number): Observable<Product> {
    return this.apiService.get(`products/${id}`);
  }

  private updateProducts(value: Product[]): void {
    this.products = value;
    this.products$.next(this.products);
  }

  private updateTotalProducts(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
