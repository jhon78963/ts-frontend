import { Injectable } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import {
  Measurement,
  MeasurementListResponse,
} from '../models/measurements.model';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeasurementsService {
  measurements: Measurement[] = [];
  measurements$: BehaviorSubject<Measurement[]> = new BehaviorSubject<
    Measurement[]
  >(this.measurements);

  total: number = 0;
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);

  constructor(private apiService: ApiService) {}

  callGetList(
    limit: number = 10,
    page: number = 1,
    search: string = '',
  ): Observable<void> {
    let url = `measurements?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.apiService.get<MeasurementListResponse>(url).pipe(
      debounceTime(600),
      map((response: MeasurementListResponse) => {
        this.updateMeasurements(response.data);
        this.updateTotalMeasurements(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Measurement[]> {
    return this.measurements$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  create(data: Measurement): Observable<void> {
    return this.apiService.post('measurements', data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`measurements/${id}`);
  }

  edit(id: number, data: Measurement): Observable<void> {
    return this.apiService.patch(`measurements/${id}`, data);
  }

  getOne(id: number): Observable<Measurement> {
    return this.apiService.get(`measurements/${id}`);
  }

  private updateMeasurements(value: Measurement[]): void {
    this.measurements = value;
    this.measurements$.next(this.measurements);
  }

  private updateTotalMeasurements(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
