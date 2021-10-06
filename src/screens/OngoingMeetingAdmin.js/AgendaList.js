import { Col, Card } from "react-bootstrap";
import { getFormattedDuration } from "../../common/CommonFunctions";

export default function AgendaList({ time, agenda, position }) {
	const items = [];
	if (position >= agenda.length) {
		for (let i = 0; i < agenda.length; i++) {
			items.push(<ActiveItem item={agenda[i]} key={"Item " + i} />);
		}
	} else {
		for (let i = Math.max(0, position); i < agenda.length; i++) {
			if (agenda[i].start_time === null) {
				items.push(
					<NotStartedItem item={agenda[i]} key={"Item " + i} />
				);
			} else if (i === position) {
				items.push(
					<CurrentItem
						item={agenda[i]}
						time={time}
						key="Item Current"
					/>
				);
			} else {
				items.push(<ActiveItem item={agenda[i]} key={"Item " + i} />);
			}
		}
	}
	return items;
}

function NotStartedItem({ item }) {
	return (
		<Col
			className="Container__padding--vertical-small"
			lg={8}
			md={12}
			sm={12}
		>
			<Card bg="light">
				<Card.Body>
					<Card.Title>{item.item_name}</Card.Title>
					<Card.Text>
						Estimated Duration:{" "}
						{getFormattedDuration(item.expected_duration)}
					</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	);
}

function CurrentItem({ item, time }) {
	const currentDuration = time - item.start_time;
	const timeRemaining = item.actual_duration - currentDuration;
	return (
		<Col
			className="Container__padding--vertical-small"
			lg={8}
			md={12}
			sm={12}
		>
			<Card bg={timeRemaining > 0 ? "success" : "danger"} text="light">
				<Card.Body>
					<Card.Title>{item.item_name}</Card.Title>
					<Card.Text>
						Time Remaining:{" "}
						{getFormattedDuration(
							timeRemaining - (timeRemaining % 1000)
						)}
					</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	);
}

function ActiveItem({ item }) {
	return (
		<Col
			className="Container__padding--vertical-small"
			lg={8}
			md={12}
			sm={12}
		>
			<Card bg="light">
				<Card.Body>
					<Card.Title>{item.item_name}</Card.Title>
					<Card.Text>
						Duration: {getFormattedDuration(item.actual_duration)}
					</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	);
}
