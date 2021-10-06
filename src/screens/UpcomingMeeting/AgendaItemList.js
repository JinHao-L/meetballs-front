import { DragDropContext, Droppable } from "react-beautiful-dnd";
import AgendaItem from "./AgendaItem";

export default function AgendaItemList({ meeting, setMeeting }) {
	const items = [];
	for (let i = 0; i < meeting.agenda_items.length; i++) {
		items.push(
			<AgendaItem
				key={"Item" + i}
				meeting={meeting}
				setMeeting={setMeeting}
				position={i}
			/>
		);
	}
	return (
		<DragDropContext
			onDragEnd={(result) => onDragEnd(result, meeting, setMeeting)}
		>
			<Droppable droppableId="Agenda">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{items}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

function onDragEnd(result, meeting, setMeeting) {
	const { destination, source } = result;
	if (destination === null) return;
	if (
		destination.droppableId === source.droppableId &&
		destination.index === source.index
	)
		return;
	const newMeeting = Object.assign({}, meeting);
	const newAgenda = newMeeting.agenda_items;
	const item = newAgenda.splice(source.index, 1);
	newAgenda.splice(destination.index, 0, item[0]);
	for (let i = 0; i < newAgenda.length; i++) {
		newAgenda[i].position = i;
	}
	newMeeting.agenda_items = newAgenda;
	setMeeting(newMeeting);
}
