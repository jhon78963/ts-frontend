export interface IMeasurement {
  id: number;
  description: string;
}

export class Measurement {
  id: number;
  description: string;
  constructor(measurement: IMeasurement) {
    this.id = measurement.id;
    this.description = measurement.description;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface MeasurementListResponse {
  data: Measurement[];
  paginate: Paginate;
}
