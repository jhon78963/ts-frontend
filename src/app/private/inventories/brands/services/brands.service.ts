import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Brand, BrandListResponse } from '../models/brands.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  brands: Brand[] = [];
  brands$: BehaviorSubject<Brand[]> = new BehaviorSubject<Brand[]>(this.brands);

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `brands?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<BrandListResponse>(url).pipe(
      debounceTime(600),
      map((response: BrandListResponse) => {
        this.updateBrands(response.data);
        this.updateTotalBrands(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Brand[]> {
    return this.brands$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Brand): Observable<void> {
    return this.apiService.post('brands', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`brands/${id}`);
  }

  edit(id: number, data: Brand): Observable<void> {
    return this.apiService.patch(`brands/${id}`, data);
  }

  getOne(id: number): Observable<Brand> {
    return this.apiService.get(`brands/${id}`);
  }

  private updateBrands(value: Brand[]): void {
    this.brands = value;
    this.brands$.next(this.brands);
  }

  private updateTotalBrands(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
