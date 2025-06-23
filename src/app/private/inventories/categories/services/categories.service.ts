import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Category, CategoryListResponse } from '../models/categories.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categories: Category[] = [];
  categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(
    this.categories,
  );

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `categories?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<CategoryListResponse>(url).pipe(
      debounceTime(600),
      map((response: CategoryListResponse) => {
        this.updateCategories(response.data);
        this.updateTotalCategories(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Category): Observable<void> {
    return this.apiService.post('categories', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`categories/${id}`);
  }

  edit(id: number, data: Category): Observable<void> {
    return this.apiService.patch(`categories/${id}`, data);
  }

  getOne(id: number): Observable<Category> {
    return this.apiService.get(`categories/${id}`);
  }

  private updateCategories(value: Category[]): void {
    this.categories = value;
    this.categories$.next(this.categories);
  }

  private updateTotalCategories(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
