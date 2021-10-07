import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import CompletedMeetingItem from "./CompletedMeetingItem";
import UpcomingMeetingItem from "./UpcomingMeetingItem";

export default function DashboardScreen() {
    const [ upcoming, setUpcoming ] = useState([]);
    const [ history, setHistory ] = useState([]);

    useEffect(() => {
        setUpcoming([testMeeting]);
        setHistory([testMeeting]);
    }, []);

    const upcomingList = upcoming.map((meeting, idx) => {
        return <UpcomingMeetingItem
            key={idx}
            meeting={meeting}
            editMeeting={() => { console.log("Edit meeting clicked"); }}
        />;
    });

    const historyList = history.map((meeting, idx) => {
        return <CompletedMeetingItem
            key={idx}
            meeting={meeting}
            viewMeeting={() => { console.log("View meeting report clicked"); }}
        />;
    });

    return (
        <div>
            <Tabs
                defaultActiveKey="upcoming"
                transition={false}
                id="meetings-tabs"
                className="justify-content-center"
            >
                <Tab eventKey="upcoming" title="Upcoming Meetings">{upcomingList}</Tab>
                <Tab eventKey="past" title="Past Meetings">{historyList}</Tab>
            </Tabs>
        </div>
    );
}

const testMeeting = {
	name: "Meetballs Annual Eating Contest",
	description:
		"Pellentesque vestibulum dolor in tortor scelerisque, eu laoreet felis mattis. Duis ac mauris a ligula scelerisque commodo in sit amet est. Proin ac semper neque. Integer a sagittis velit, ac finibus risus. Curabitur blandit, nulla ut scelerisque interdum, tortor elit tristique quam, eu tempus ipsum tortor eu neque. Cras molestie eget enim vitae fringilla. In eget nibh tristique nunc porttitor eleifend ut in felis. Nam egestas mauris in augue suscipit cursus. Vivamus eget ornare ante, finibus pulvinar justo. Fusce sit amet dapibus neque, non euismod massa. Nunc elementum purus pretium elit luctus finibus. Nunc eu augue quis purus posuere sollicitudin quis non eros. Curabitur rutrum faucibus ipsum non tristique. Maecenas mattis eget diam at gravida.",
	created_at: "//Zoom date",
	duration: 3900000,
	host_id: "//Zoom host id",
	uuid: "//Meeting id",
	start_url: "https://zoom.us/",
	join_url: "https://zoom.us/",
	status: "waiting",
	start_time: "2021-11-01T22:00:00Z",
	enable_transcription: true,
	transcription: "",
	video_url: "",
	agenda_items: [
		{
			meeting_uuid: "//Meeting id",
			position: 1,
			item_name: "Commencement of category 1 eating contest.",
			item_description:
				"Integer egestas gravida gravida. Suspendisse potenti. Curabitur id accumsan velit. Nulla volutpat tellus et erat scelerisque tincidunt. Proin ac semper nunc. Quisque tempus elit ut sem laoreet, sed semper mauris imperdiet. Sed consequat bibendum elementum. Nullam scelerisque, mi vel malesuada blandit, mauris odio pulvinar leo, eu finibus nisl ligula ut massa.",
			start_time: null,
			actual_duration: null,
			expected_duration: 3600000,
			isCurrent: false,
		},
		{
			meeting_uuid: "//Meeting id",
			position: 0,
			item_name: "Opening address by CEO of Meetballs Inc.",
			item_description:
				"Vestibulum vitae convallis diam. Sed molestie odio vitae urna sodales pellentesque. Suspendisse ipsum urna, accumsan in tincidunt vitae, sodales eleifend lacus. Nunc rutrum ultrices velit, at mollis lorem vestibulum et. Etiam venenatis sapien nisl, eget condimentum velit accumsan sed. Integer maximus molestie ante, in fringilla turpis vestibulum et.",
			start_time: null,
			actual_duration: null,
			expected_duration: 300000,
			isCurrent: false,
		},
	],
	participant_lists: [
		{
			meeting_uuid: "//Meeting id",
			user_name: "Meetball 2",
			user_email: "meetball2@meetmail.com",
			time_joined: null,
		},
		{
			meeting_uuid: "//Meeting id",
			user_name: "Meetball 1",
			user_email: "meetball1@meetmail.com",
			time_joined: null,
		},
	],
	password_hash: "b263c97345237b1da24cddfedace92d239d2697a",
};
