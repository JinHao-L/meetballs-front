import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import UpcomingMeetingItem from "./UpcomingMeetingItem";

export default function DashboardScreen() {
    const [ upcoming, setUpcoming ] = useState([]);
    const [ history, setHistory ] = useState([]);

    useEffect(() => {
        setUpcoming([]);
        setHistory([]);
    }, []);

    const upcomingList = upcoming.map((meeting, idx) => {
        return <UpcomingMeetingItem
            key={idx}
            meeting={meeting}
            editMeeting={() => {}}
        />;
    });

    const historyList = history.map((meeting, idx) => {
        return <UpcomingMeetingItem
            key={idx}
            meeting={meeting}
            editMeeting={() => {}}
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
