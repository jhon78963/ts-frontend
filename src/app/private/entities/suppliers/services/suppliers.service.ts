import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Supplier, SupplierListResponse } from '../models/suppliers.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  suppliers: Supplier[] = [];
  suppliers$: BehaviorSubject<Supplier[]> = new BehaviorSubject<Supplier[]>(
    this.suppliers,
  );

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `suppliers?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<SupplierListResponse>(url).pipe(
      debounceTime(600),
      map((response: SupplierListResponse) => {
        this.updateSuppliers(response.data);
        this.updateTotalSuppliers(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Supplier[]> {
    return this.suppliers$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Supplier): Observable<void> {
    return this.apiService.post('suppliers', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`suppliers/${id}`);
  }

  edit(id: number, data: Supplier): Observable<void> {
    return this.apiService.patch(`suppliers/${id}`, data);
  }

  getOne(id: number): Observable<Supplier> {
    return this.apiService.get(`suppliers/${id}`);
  }

  private updateSuppliers(value: Supplier[]): void {
    this.suppliers = value;
    this.suppliers$.next(this.suppliers);
  }

  private updateTotalSuppliers(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
