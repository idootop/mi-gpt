import axios, { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { isNotEmpty } from "../utils/is";

const _baseConfig: CreateAxiosDefaults = {
  timeout: 10 * 1000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0",
  },
};

const _http = axios.create(_baseConfig);

interface HttpError {
  isError: true;
  error: any;
  code: string;
  message: string;
}

type RequestConfig = AxiosRequestConfig<any> & {
  rawResponse?: boolean;
  cookies?: Record<string, string | number | boolean | undefined>;
};

_http.interceptors.response.use(
  (res) => {
    const config: any = res.config;
    if (config.rawResponse) {
      return res;
    }
    return res.data;
  },
  (err) => {
    const error = err.response?.data?.error ?? err.response?.data ?? err;
    const apiError: HttpError = {
      error: err,
      isError: true,
      code: error.code ?? "UNKNOWN CODE",
      message: error.message ?? "UNKNOWN ERROR",
    };
    console.error(
      "❌ Network request failed:",
      apiError.code,
      apiError.message,
      error
    );
    return apiError;
  }
);

class HTTPClient {
  async get<T = any>(
    url: string,
    query?:
      | Record<string, string | number | boolean | undefined>
      | RequestConfig,
    config?: RequestConfig
  ): Promise<T | HttpError> {
    if (config === undefined) {
      config = query;
      query = undefined;
    }
    return _http.get<T>(
      HTTPClient._buildURL(url, query),
      HTTPClient._buildConfig(config)
    ) as any;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T | HttpError> {
    return _http.post<T>(url, data, HTTPClient._buildConfig(config)) as any;
  }

  private static _buildURL = (url: string, query?: Record<string, any>) => {
    const _url = new URL(url);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (isNotEmpty(value)) {
        _url.searchParams.append(key, value.toString());
      }
    }
    return _url.href;
  };

  private static _buildConfig = (config?: RequestConfig) => {
    if (config?.cookies) {
      config.headers = {
        ...config.headers,
        Cookie: Object.entries(config.cookies)
          .map(
            ([key, value]) => `${key}=${value == null ? "" : value.toString()};`
          )
          .join(" "),
      };
    }
    return config;
  };
}

export const Http = new HTTPClient();
