import { getQueryParams } from '@/utils/getQueryParams';
import { HttpRequest } from './HttpService';

class CrudService {
  protected httpRequest: HttpRequest;

  constructor(path: string) {
    this.httpRequest = new HttpRequest(path);
  }

  protected async getAll<ReturnV>(params: any, route?: string) {
    const routeParams = getQueryParams({
      ...params,
    });
    return await this.httpRequest.get<ReturnV>(routeParams, route);
  }

  protected async getById<TData extends string, ReturnV>(
    id: TData,
    params?: { [key: string]: string },
    route?: string
  ) {
    const routeParams = getQueryParams({
      ...params,
    });
    return await this.httpRequest.get<ReturnV>(
      routeParams,
      `${route ?? ''}/${id}`
    );
  }

  protected async create<TData, VoidR>(
    data: TData,
    params?: { [key: string]: string },
    route?: string
  ) {
    const routeParams = getQueryParams(params ?? {});
    return await this.httpRequest.post<TData, VoidR>(data, routeParams, route);
  }

  protected async update<TData, ReturnV>(
    data: TData,
    params?: { [key: string]: string },
    route?: string
  ) {
    const routeParams = getQueryParams(params ?? {});
    return await this.httpRequest.put<TData, ReturnV>(data, routeParams, route);
  }

  protected async delete<VoidR>(
    params?: { [key: string]: string },
    route?: string
  ) {
    const routeParams = getQueryParams(params ?? {});
    return await this.httpRequest.delete<VoidR>(routeParams, route);
  }

  protected abortRequest() {
    this.httpRequest.abortRequest();
  }
}

export default CrudService;
