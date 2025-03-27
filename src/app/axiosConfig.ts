import axios from "axios";
const axiosConfig = axios.create({
  // baseURL: "https://e-commerce-backend-flowy-cart.vercel.app/",
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosConfig;
