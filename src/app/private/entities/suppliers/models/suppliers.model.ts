export interface ISupplier {
  id: number;
  ruc: string;
  businessName: string;
  manager: string;
  address: string;
}

export class Supplier {
  id: number;
  ruc: string;
  businessName: string;
  manager: string;
  address: string;
  constructor(supplier: ISupplier) {
    this.id = supplier.id;
    this.ruc = supplier.ruc;
    this.businessName = supplier.businessName;
    this.manager = supplier.manager;
    this.address = supplier.address;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface SupplierListResponse {
  data: Supplier[];
  paginate: Paginate;
}
