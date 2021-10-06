export const blankMeeting = {
	name: "",
	description: "",
	created_at: "",
	duration: "",
	host_id: "",
	uuid: "",
	start_url: "",
	join_url: "",
	status: "",
	start_time: "1999-24-06T22:00:00Z",
	enable_transcription: false,
	transcription: "",
	video_url: "",
	agenda_items: [],
	participant_lists: [],
	password_hash: "",
};

export const blankParticipant = {
	meeting_uuid: "",
	user_name: "",
	user_email: "",
	time_joined: null,
};

export const blankAgenda = {
	meeting_uuid: "",
	position: -1,
	item_name: "",
	item_description: "",
	start_time: null,
	actual_duration: null,
	expected_duration: 300000,
	isCurrent: false,
};
