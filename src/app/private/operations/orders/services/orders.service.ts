import { Injectable } from '@angular/core';
import { Order, OrderResponse } from '../models/orders.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { ListResponse } from '../../../../shared/models/list.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  orders: Order[] = [];
  orders$: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(this.orders);

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `orders?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<ListResponse<Order>>(url).pipe(
      debounceTime(600),
      map((response: ListResponse<Order>) => {
        this.updateOrders(response.data);
        this.updateTotalOrders(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Order[]> {
    return this.orders$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Order): Observable<OrderResponse> {
    return this.apiService.post('orders', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`orders/${id}`);
  }

  edit(id: number, data: Order): Observable<OrderResponse> {
    return this.apiService.patch(`orders/${id}`, data);
  }

  getOne(id: number): Observable<Order> {
    return this.apiService.get(`orders/${id}`);
  }

  private updateOrders(value: Order[]): void {
    this.orders = value;
    this.orders$.next(this.orders);
  }

  private updateTotalOrders(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
