import { defaultHeaders } from '../utils/axiosConfig';
import server from './server';

export const deleteParticipants = async (meetingId, userEmail) => {
  const body = {
    participants: [
      {
        userEmail,
      },
    ],
  };
  await server.delete(`participant`, body);
};

export const createParticipant = async (userEmail) => {
  const body = {
    userEmail,
    timeJoined: null,
  };
  await server.post(`participant`, body, defaultHeaders);
};
