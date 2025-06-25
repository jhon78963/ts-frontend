import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { Observable } from 'rxjs';
import { Pivot } from '../../../../shared/models/pivote.interface';

@Injectable({
  providedIn: 'root',
})
export class SaleProductService {
  constructor(private apiService: ApiService) {}

  add(saleId: number, productId: number, data: Pivot): Observable<void> {
    return this.apiService.post(`sales/${saleId}/product/${productId}`, data);
  }

  get(saleId: number, productId: number): Observable<void> {
    return this.apiService.get(`sales/${saleId}/product/${productId}`);
  }

  remove(saleId: number, productId: number): Observable<void> {
    return this.apiService.delete(`sales/${saleId}/product/${productId}`);
  }

  update(saleId: number, productId: number, data: Pivot): Observable<void> {
    return this.apiService.patch(`sales/${saleId}/product/${productId}`, data);
  }
}
