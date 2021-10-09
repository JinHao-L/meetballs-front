import { useEffect, useState } from "react";
import { Tab, Tabs, Spinner, Container } from "react-bootstrap";
import CompletedMeetingItem from "./CompletedMeetingItem";
import UpcomingMeetingItem from "./UpcomingMeetingItem";
import axios from "axios";
import { defaultHeaders } from "../../utils/axiosConfig";

export default function DashboardScreen() {
	const [upcoming, setUpcoming] = useState([]);
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		return axios.get('/user/me', defaultHeaders)
			.then((res) => {
				const meetings = res.data.createdMeetings;
				const upcoming = meetings.filter(meeting => (meeting.endedAt === null))
				const history = meetings.filter(meeting => (meeting.endedAt !== null))
				setUpcoming(upcoming);
				setHistory(history);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
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

	if (loading) {
        return (
            <>
                <Container className="Container__padding--vertical">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </>
        );
    }

	return (
		<>
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
		</>
	);
}
