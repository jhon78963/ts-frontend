import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { Pivot } from '../../../../shared/models/pivote.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderProductService {
  constructor(private apiService: ApiService) {}

  add(orderId: number, productId: number, data: Pivot): Observable<void> {
    return this.apiService.post(`orders/${orderId}/product/${productId}`, data);
  }

  get(orderId: number, productId: number): Observable<void> {
    return this.apiService.get(`orders/${orderId}/product/${productId}`);
  }

  remove(orderId: number, productId: number): Observable<void> {
    return this.apiService.delete(`orders/${orderId}/product/${productId}`);
  }

  update(orderId: number, productId: number, data: Pivot): Observable<void> {
    return this.apiService.patch(
      `orders/${orderId}/product/${productId}`,
      data,
    );
  }
}
