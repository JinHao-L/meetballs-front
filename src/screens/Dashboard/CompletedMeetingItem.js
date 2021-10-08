import { Card, Row, Button } from "react-bootstrap";
import { getDateInfo } from "../../common/CommonFunctions";

export default function CompletedMeetingItem({ key, meeting, viewMeeting }) {
	const topic = meeting.name;
	const desc = meeting.description;

	const dateInfo = getDateInfo(meeting.startedAt, meeting.duration);
	const date = dateInfo.date;
	const startTime = dateInfo.startTime;
	const endTime = dateInfo.endTime;
	const duration = dateInfo.duration;

	return (
		<Card bg={"light"} key={key}>
			<Card.Body>
				<Card.Title>{topic}</Card.Title>
				<Card.Text>Description: {desc}</Card.Text>
				<Card.Text>Date: {date}</Card.Text>
				<Card.Text>
					Duration: {startTime} - {endTime} ({duration})
				</Card.Text>
				<Row className="justify-content-end" xs="auto">
					<Button variant="primary" onClick={viewMeeting}>
						View meeting report
					</Button>
				</Row>
			</Card.Body>
		</Card>
	);
}
