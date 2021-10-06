import ParticipantItem from "./ParticipantItem";

export default function ParticipantItemList({ meeting, setMeeting }) {
	const items = [];
	for (let i = 0; i < meeting.participant_lists.length; i++) {
		items.push(
			<ParticipantItem
				key={"participant" + i}
				meeting={meeting}
				setMeeting={setMeeting}
				position={i}
			/>
		);
	}
	return items;
}
