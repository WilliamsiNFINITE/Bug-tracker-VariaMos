import axios from 'axios';
import backendUrl from '../backendUrl';

interface Credentials {
  username: string;
  password: string;
  email?: string;
}

type Token = string | null;

let token: Token = null;
const setToken = (newToken: string) => {
  token = newToken;
};

let isAdmin: boolean = false;
const setisAdmin = (admin: boolean) => {
  isAdmin = admin;
}

let notificationsOn: boolean = true;
const setNotifications = (notification: boolean) => {
  notificationsOn = notification;
}

let email: string = '';
const setEmail = (mail: string) => {
  email = mail;
}

export const setConfig = () => {
  return {
    headers: { 'x-auth-token': token , 'admin': isAdmin, 'email': email, 'notifications': notificationsOn },
  };
};

const login = async (credentials: Credentials) => {
  const response = await axios.post(`${backendUrl}/login`, credentials);
  return response.data;
};

const signup = async (credentials: Credentials) => {
  const response = await axios.post(`${backendUrl}/signup`, credentials);
  return response.data;
};

const authService = { login, signup, setToken, setisAdmin, setEmail, setNotifications };

export default authService;
