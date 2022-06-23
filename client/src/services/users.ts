import axios from 'axios';
import backendUrl from '../backendUrl';
import { setConfig } from './auth';

const baseUrl = `${backendUrl}/users`;

const getUsers = async () => {
  const response = await axios.get(baseUrl, setConfig());
  return response.data;
};

const addAdmins = async (admins: string[]) => {
  const response = await axios.post(`${baseUrl}/admins`, { admins }, setConfig()
  );
  return response.data;
}

const removeAdmin = async (adminId: string) => {
  const response = await axios.delete(
    `${baseUrl}/admin/${adminId}`, setConfig()
  );
  return response.data;
};

const userService = { getUsers, addAdmins, removeAdmin };

export default userService;
