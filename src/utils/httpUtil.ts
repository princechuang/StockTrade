import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { apiHost } from "@/utils/configs";
import { showToast } from "vant";

// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
  code: number;
  message: string;
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
  result?: T;
}

enum RequestEnums {
  TIMEOUT = 20000,
  OVERDUE = 401, // 登录失效
  FAIL = 1, // 请求失败
  SUCCESS = 0, // 请求成功
}
const config = {
  // 默认地址
  baseURL: apiHost,
  // 设置超时时间
  timeout: RequestEnums.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = sessionStorage.getItem("token") || "";
        const userId = sessionStorage.getItem("userId") || "";
        return {
          ...config,
          headers: {
            Authorization: `Bearer ${token}`, // 请求头中携带token信息
            userId: userId,
          },
        };
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error);
      }
    );
    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data as ResultData;
        if (data.code === RequestEnums.OVERDUE) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userId");
          showToast(data.message);
          return Promise.reject(data);
        }
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          showToast(data.message);
          return Promise.reject(data);
        }
        return data.result;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          this.handleCode(response.status);
        }
        if (!window.navigator.onLine) {
          showToast("网络连接失败");
        }
      }
    );
  }
  handleCode(code: number): void {
    switch (code) {
      case 401:
        showToast("登录失败，请重新登录");
        break;
      default:
        showToast("请求失败");
        break;
    }
  }

  get<T>(url: string, params?: object): Promise<T> {
    return this.service.get(url, { params });
  }
  post<T>(url: string, params?: object): Promise<T> {
    return this.service.post(url, params);
  }
  put<T>(url: string, params?: object): Promise<T> {
    return this.service.put(url, params);
  }
  delete<T>(url: string, params?: object): Promise<T> {
    return this.service.delete(url, { params });
  }
}

export default new RequestHttp(config);
