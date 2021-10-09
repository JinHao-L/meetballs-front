import server from './server';

// id of meeting
export const pullMeeting = async (meetingId) => {
  return server.get(`meeting/${meetingId}`);
};

export const updateMeeting = (newMeeting) => {
  const { name, description, duration, enableTranscription } = newMeeting;
  const body = {
    ...(name && { name }),
    ...(description && { description }),
    ...(duration && { duration }),
    ...(enableTranscription && { enableTranscription }),
  };
  await server.put(`meeting/${newMeeting.id}`, body);
};
