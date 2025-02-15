import axios from "axios";

const baseURL = import.meta.env.VITE_PANCAKE_API_BASE_URL as string;

export const pancakeApiAxios = axios.create({
  baseURL: baseURL,
  withCredentials: false,
});
