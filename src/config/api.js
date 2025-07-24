import { API_URL } from "@/constant";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
const api = axios.create({
  baseURL: API_URL + "/resource",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Unauthorized access - redirecting to login. ERROR CODE: ", error?.response?.status);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        Cookies.remove("ACCESS_TOKEN");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Unauthorized access - redirecting to login. ERROR CODE: ", error?.response?.status);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        Cookies.remove("ACCESS_TOKEN");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { api };
