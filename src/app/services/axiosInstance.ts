import axios from 'axios';
export const baseURL= 'http://localhost:3001';
const axiosInstance = axios.create({
  baseURL: baseURL, // Cambia por la URL de tu backend
  timeout: 10000, // Tiempo de espera para las solicitudes
});

export default axiosInstance;