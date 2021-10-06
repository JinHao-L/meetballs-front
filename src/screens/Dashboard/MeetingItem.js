import { Card } from "react-bootstrap";
import { getFormattedDuration } from "../../common/CommonFunctions";

export default function MeetingItem({ meeting }) {
    const topic = meeting.name;
    const desc = meeting.description;

    const dateInfo = getDateInfo(meeting.start_time, meeting.duration);
    const date = dateInfo.date;
    const startTime = dateInfo.startTime;
    const endTime = dateInfo.endTime;
    const duration = dateInfo.duration;
    
    return (
        <Card bg={"light"}>
            <Card.Body>
                <Card.Title>{topic}</Card.Title>
                <Card.Text>Description: {desc}</Card.Text>
                <Card.Text>Date: {date}</Card.Text>
                <Card.Text>Duration: {startTime} - {endTime} ({duration})</Card.Text>
            </Card.Body>
        </Card>
    );
}

function getDateInfo(isoDate, durationInMilli) {
    const date = new Date(isoDate);
    let options = {
        day: "numeric",
		month: "long",
		year: "numeric",
    }
    const dateStr = date.toLocaleString('en-US', options);

    options = {
		hour: "numeric",
		minute: "numeric",
    };
    const startTime = date.toLocaleString('en-US', options);
    date.setMilliseconds(date.getMilliseconds() + durationInMilli);
    const endTime = date.toLocaleString('en-US', options);

    const durationStr = getFormattedDuration(durationInMilli);

    return Object.freeze({
        date: dateStr,
        startTime: startTime,
        endTime: endTime,
        duration: durationStr
    });
}