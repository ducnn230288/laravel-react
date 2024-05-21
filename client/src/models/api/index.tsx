export class Responses<T> {
  constructor(
    public statusCode?: 200 | 201 | 500 | 404,
    public message?: string,
    public data?: T,
    public meta?: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    },
  ) {}
}

export class CommonEntity {
  constructor(
    public id?: string,
    public createdAt?: string,
    public isDisable?: boolean,
  ) {}
}

export interface PaginationQuery<T = object> {
  perPage?: number;
  page?: number;
  like?: string | T;
  sort?: string | T;
  extend?: string | T;
  skip?: string | T;
  fullTextSearch?: string;
  include?: string;
}
