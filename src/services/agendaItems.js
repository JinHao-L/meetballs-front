import server from './server';

export const deleteAgendaItem = async (meetingId, position) => {
  await server.delete(`agenda-item/${meetingId}/${position}`);
};

export const reorderPositions = async (meetingId, agendaItems) => {
  const changes = [];
  agendaItems.forEach((item) => {
    changes.push({
      oldPosition: item.prevPosition,
      newPosition: item.position,
    });
    item.prevPosition = item.position;
  });
  const body = {
    positions: changes,
    meetingId,
  };
  await server.put(`agenda-item/positions`, body);
};

export const deleteAgendaItem = async (meetingId, position) => {
  await server.delete(`agenda-item/${meetingId}/${position}`);
};

export const updateAgendaItem = (
  meetingId,
  position,
  name,
  description,
  expectedDuration,
  isCurrent,
  actualDuration,
) => {
  const body = {
    ...(name && { name }),
    ...(description && { description }),
    ...(startTime && { startTime }),
    ...(expectedDuration && { expectedDuration }),
    ...(actualDuration && { actualDuration }),
    ...(isCurrent && { isCurrent }),
  };
  await server.put(`agenda-item/${meetingId}/${position}`, body);
};
