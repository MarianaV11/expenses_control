import Axios from "axios";
import { getToken } from "./local_storage";

export const axios = Axios.create({
  baseURL: "http://127.0.0.1:9000/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

export const axiosLogin = Axios.create({
  baseURL: "http://127.0.0.1:9000/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
