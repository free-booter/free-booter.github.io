
export class  Apis{

  public common: RequestOptions;
  // 默认的server配置
  public base!: string;
  // server服务的集合
  public serverMap: ServerMap;
  // 对象形式的请求方法集合
  public apiMap: ApisMap;
  // 挂载所有请求方法的集合对象
  public apis: ApisInstance;
  // axios实例化对象
  public instance: AxiosInstance;

  constructor(common?: RequestOptions, serverMap?: ServerMap, apiMap?: ApisMap) {
  
  }

  public get<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<RestyResponse<T>> {
    request = { ...request, method: 'GET' };
    return this.request(url, request);
  }

  public delete<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<RestyResponse<T>> {
    request = { ...request, method: 'DELETE' };
    return this.request(url, request);
  }

  public post<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<RestyResponse<T>> {
    request = { ...request, method: 'POST' };
    return this.request(url, request);
  }

  public put<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<RestyResponse<T>> {
    request = { ...request, method: 'PUT' };
    return this.request(url, request);
  }

  public patch<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<RestyResponse<T>> {
    request = { ...request, method: 'PATCH' };
    return this.request(url, request);
  }

  public request<T extends Record<string, any> = any>(url: string, request: RequestOptions): Promise<RestyResponse<T>> {
    const rest = request.rest || {};
    let path = url;
    if (Object.keys(rest).length) {
      path = this.restful(url, rest);
    }
    // 合并公共配置
    const options = { ...this.common, ...request };
    return this.instance.request({
      ...options,
      url: path,
    });
  }
}

