import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import CompletedMeetingItem from "./CompletedMeetingItem";
import UpcomingMeetingItem from "./UpcomingMeetingItem";
import { testMeeting } from "../../common/TestData";

export default function DashboardScreen() {
	const [upcoming, setUpcoming] = useState([]);
	const [history, setHistory] = useState([]);

	useEffect(() => {
		setUpcoming([testMeeting]);
		setHistory([testMeeting]);
	}, []);

	const upcomingList = upcoming.map((meeting, idx) => {
		return (
			<UpcomingMeetingItem
				key={idx}
				meeting={meeting}
				editMeeting={() => {
					console.log("Edit meeting clicked");
				}}
			/>
		);
	});

	const historyList = history.map((meeting, idx) => {
		return (
			<CompletedMeetingItem
				key={idx}
				meeting={meeting}
				viewMeeting={() => {
					console.log("View meeting report clicked");
				}}
			/>
		);
	});

	return (
		<div>
			<Tabs
				defaultActiveKey="upcoming"
				transition={false}
				id="meetings-tabs"
				className="justify-content-center"
			>
				<Tab eventKey="upcoming" title="Upcoming Meetings">
					{upcomingList}
				</Tab>
				<Tab eventKey="past" title="Past Meetings">
					{historyList}
				</Tab>
			</Tabs>
		</div>
	);
}
