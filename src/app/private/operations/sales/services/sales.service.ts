import { Injectable } from '@angular/core';
import { Sale, SaleResponse } from '../models/sales.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { ListResponse } from '../../../../shared/models/list.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  sales: Sale[] = [];
  sales$: BehaviorSubject<Sale[]> = new BehaviorSubject<Sale[]>(this.sales);

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `sales?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<ListResponse<Sale>>(url).pipe(
      debounceTime(600),
      map((response: ListResponse<Sale>) => {
        this.updateSales(response.data);
        this.updateTotalSales(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Sale[]> {
    return this.sales$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Sale): Observable<SaleResponse> {
    return this.apiService.post('sales', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`sales/${id}`);
  }

  edit(id: number, data: Sale): Observable<SaleResponse> {
    return this.apiService.patch(`sales/${id}`, data);
  }

  getOne(id: number): Observable<Sale> {
    return this.apiService.get(`sales/${id}`);
  }

  private updateSales(value: Sale[]): void {
    this.sales = value;
    this.sales$.next(this.sales);
  }

  private updateTotalSales(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
