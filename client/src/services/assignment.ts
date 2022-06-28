import axios from 'axios';
import backendUrl from '../backendUrl';
import { setConfig } from './auth';

const baseUrl = `${backendUrl}/bugs`;

const assignBug = async (bugId: string, admins: string[]) => {
    const response = await axios.post(
      `${baseUrl}/${bugId}/assignBug`,
      { admins },
      setConfig()
    );
    return response.data;
  }

  const assignmentService = { assignBug };

  export default assignmentService;