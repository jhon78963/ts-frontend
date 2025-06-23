export interface ICustomer {
  id: number;
  dni: string;
  name: string;
  surname: string;
  phone: string;
}

export class Customer {
  id: number;
  dni: string;
  name: string;
  surname: string;
  phone: string;
  constructor(customer: ICustomer) {
    this.id = customer.id;
    this.dni = customer.dni;
    this.name = customer.name;
    this.surname = customer.surname;
    this.phone = customer.phone;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface CustomerListResponse {
  data: Customer[];
  paginate: Paginate;
}
