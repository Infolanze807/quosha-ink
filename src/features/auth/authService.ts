import axiosConfig from "../../app/axiosConfig";
import { Forgot, Login, ResetPassword } from "../../types/auth";
import { Register } from "../../types/register";
// import { useParams } from "react-router";

const login = async (userData: Login) => {
  const response = await axiosConfig.post("auth/login", userData);
  return response.data;
};

const register = async (userData: Register) => {
  const response = await axiosConfig.post("auth/register", userData);
  return response.data;
};

const getUser = async (userId: string) => {
  const response = await axiosConfig.get(`auth/user/${userId}`);
  return response.data;
};

const updateUser = async (userId: string, userDetails: Register) => {
  const response = await axiosConfig.put(`auth/updateAddress/${userId}`, userDetails);
  return response.data;
};

const forgot = async (userData: Forgot) => {
  const response = await axiosConfig.post("auth/passwordReset", userData);
  return response.data;
};

const resetpassword = async (userId: string, token: string, userData: ResetPassword) => {
  const response = await axiosConfig.post(`auth/${userId}/${token}`, userData);
  return response.data;
};

const verifyemail = async (userId: string, token: string) => {
  const response = await axiosConfig.get(`auth/verify/${userId}/${token}`);
  return response.data;
};


const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userDetails");
  localStorage.removeItem("token");
};

const authService = {
  logout,
  login,
  register,
  forgot,
  resetpassword,
  verifyemail,
  getUser,
  updateUser,
};

export default authService;
