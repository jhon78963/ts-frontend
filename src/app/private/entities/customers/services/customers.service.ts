import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Customer, CustomerListResponse } from '../models/customers.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  customers: Customer[] = [];
  customers$: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>(
    this.customers,
  );

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `customers?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<CustomerListResponse>(url).pipe(
      debounceTime(600),
      map((response: CustomerListResponse) => {
        this.updateCustomers(response.data);
        this.updateTotalCustomers(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Customer[]> {
    return this.customers$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Customer): Observable<void> {
    return this.apiService.post('customers', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`customers/${id}`);
  }

  edit(id: number, data: Customer): Observable<void> {
    return this.apiService.patch(`customers/${id}`, data);
  }

  getOne(id: number): Observable<Customer> {
    return this.apiService.get(`customers/${id}`);
  }

  private updateCustomers(value: Customer[]): void {
    this.customers = value;
    this.customers$.next(this.customers);
  }

  private updateTotalCustomers(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
