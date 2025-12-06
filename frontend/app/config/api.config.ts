import axios from "axios";


export interface IAPIError {
  msg: string;
  ok: boolean;
  status: number;
  rawError?: any;
}



const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorObj:{
      code: string,
      error: any,
      msg: string,
      status: number,
      ok: boolean,
    } = {
      msg: "Something went wrong. Try again later.",
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
      error: {},
      ok: false,
    };

    if(error instanceof axios.AxiosError) {
      if (error.response) {
        errorObj.msg = error.response.data?.error?.msg || errorObj.msg;
        errorObj.ok = false;
        errorObj.code = error.response.data?.code || errorObj.code,
        errorObj.error = error.response.data?.error || errorObj.error,
        errorObj.status = error.response?.status
      }
    }

    if(process.env.NEXT_PUBLIC_NODE_ENV == 'development'){
      console.log({
        ...errorObj,
        rawError: error,
      })
    }


    return Promise.reject({
      ...errorObj,
      rawError: error,
    });
  }
);

export default apiClient;