import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FILE_URL } from '../utils/constants';

@Injectable({ providedIn: 'root' })
export class FileApiService {
  FILE_URL = FILE_URL;
  constructor(private readonly http: HttpClient) {}
  post<T>(path: string, body: any, headers?: any) {
    return this.http.post<T>(`${this.FILE_URL}/${path}`, body, { headers });
  }

  delete<T>(path: string, headers?: any) {
    return this.http.delete<T>(`${this.FILE_URL}/${path}`, { headers });
  }
}
