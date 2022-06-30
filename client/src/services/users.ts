import { RepeatOneSharp } from '@material-ui/icons';
import axios from 'axios';
import backendUrl from '../backendUrl';
import { EmailPayload } from '../redux/types';
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

const changeSettings = async (data: EmailPayload) => {
  const response = await axios.post(
    `${baseUrl}/email`, data, setConfig()
  );
  return response.data;
}

const sendNotification = async (adminsIds: string[]) => {
  const response = await axios.post(
    `${baseUrl}/sendNotification`, adminsIds, setConfig()
  );
  return response.data;
}


const userService = { getUsers, addAdmins, removeAdmin, changeSettings, sendNotification };

export default userService;
