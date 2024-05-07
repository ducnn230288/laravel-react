export class Responses<T> {
  constructor(
    public statusCode?: 200 | 201 | 500 | 404,
    public message?: string,
    public data?: T,
    public meta?: {
      current_page: number,
      from: number,
      last_page: number,
      per_page: number,
      to: number,
      total: number,
    },
  ) {}
}

export class CommonEntity {
  constructor(
    public id?: string,
    public created_at?: string,
    public updated_at?: string,
    public isDeleted?: string,
    public isDisabled?: string,
  ) {}
}

export class PaginationQuery<T = object> {
  constructor(
    public perPage?: number,
    public page?: number,
    public like?: string | T,
    public sort?: string | T,
    public extend?: string | T,
    public skip?: string | T,
    public fullTextSearch?: string,
    public include?: string,
  ) {}
}
