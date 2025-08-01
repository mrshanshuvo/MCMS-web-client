import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mcms-server-red.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
