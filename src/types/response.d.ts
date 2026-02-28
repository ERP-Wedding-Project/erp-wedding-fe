export interface ResponseData<T = any> {
    code: string,
    message: string,
    timestamp: string,
}

export interface ResponseError {
    code: string,
    message: string,
    errors?: Record<string, string[]>,
}

export interface PayloadDataCollectionPaginated<T> {
    data: T[],
    meta: PaginationMeta
}

export interface ResponseDataCollectionWithPagination<T> extends ResponseData{
    payload: PayloadDataCollectionPaginated<T>
}

export interface ResponseDataCollectionWithoutPagination<T> extends ResponseData{
    payload: {
        data: T[]
    }
}

export interface ResponseSingleData<T> extends ResponseData{
    payload: {
        data: T
    }
}

export interface RequestParam<T = object> {
    perpage?: number;
    page?: number;
    search?: string|null|LocationQueryValue;
    order?: object;
    filter?: T;
}

export interface PaginationMeta {
    current_page: number,
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: {
        url: string | null,
        label: string,
        active: boolean,
    }[],
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: null,
    total: number
}