import { getQueryParams } from '@/utils/getQueryParams';
import { HttpRequest } from './HttpService';

class CrudService {
  httpRequest: HttpRequest;

  constructor(path: string) {
    this.httpRequest = new HttpRequest(path);
  }

  protected async getAll<T>(params: any, route?: string): Promise<any> {
    const routeParams = getQueryParams({
      ...params,
      client_id: this.httpRequest.$apiKey,
    });

    return await this.httpRequest.get<T>(routeParams, route);
  }

  protected async getById(id?: string) {
    return await this.httpRequest.get('', `/${id}`);
  }

  protected async create<T>(data: T) {
    return await this.httpRequest.post(data);
  }

  protected async update<T>(data: T, params?: any, route?: string) {
    const routeParams = getQueryParams(params ?? {});
    return await this.httpRequest.put(data, routeParams, route);
  }

  protected async delete(params?: any, route?: string) {
    const routeParams = getQueryParams(params ?? {});
    return await this.httpRequest.delete(routeParams, route);
  }

  protected abortRequest() {
    this.httpRequest.abortRequest();
  }
}

export default CrudService;
