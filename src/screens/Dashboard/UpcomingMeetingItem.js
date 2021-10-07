import { Card, Row, Button } from "react-bootstrap";
import { getDateInfo, openLinkInNewTab } from "../../common/CommonFunctions";

export default function UpcomingMeetingItem({ key, meeting, editMeeting }) {
    const topic = meeting.name;
    const desc = meeting.description;
    const startUrl = meeting.start_url;

    const dateInfo = getDateInfo(meeting.start_time, meeting.duration);
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
                <Card.Text>Duration: {startTime} - {endTime} ({duration})</Card.Text>
                <Row className="justify-content-end" xs="auto">
                    <Button
                        variant="primary"
                        onClick={editMeeting}
                    >
                        Edit meeting
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => openLinkInNewTab(startUrl)}
                    >
                        Start meeting
                    </Button>
                </Row>
            </Card.Body>
        </Card>
    );
}
