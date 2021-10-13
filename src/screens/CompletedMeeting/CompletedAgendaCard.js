import PropTypes from 'prop-types';
import { Col, Card } from 'react-bootstrap';
import {
  getDateInfo,
  getFormattedDuration,
  getFormattedTime,
} from '../../common/CommonFunctions';

export default function CompletedAgendaCard({ agendaItem }) {
  const duration = agendaItem.actualDuration;
  const expectedDuration = agendaItem.expectedDuration;

  const exceededDuration = duration > expectedDuration;
  const { startTime, endTime } = getDateInfo(agendaItem.startTime, duration);
  const durationStr = getFormattedDuration(duration);
  const expectedDurationStr = getFormattedDuration(expectedDuration);

  return (
    <Col className="Container__padding--vertical-small">
      <Card bg={exceededDuration ? 'danger' :'primary'} text="light">
        <Card.Body>
          <Card.Title>{agendaItem.name}</Card.Title>
          <Card.Text>{agendaItem.description}</Card.Text>
          <Card.Text>{expectedDurationStr}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Card.Text>
            {startTime} - {endTime} ({durationStr})
          </Card.Text>
        </Card.Footer>
      </Card>
    </Col>
  );
}

CompletedAgendaCard.propTypes = {
  agendaItem: PropTypes.shape({
    meeting: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    actualDuration: PropTypes.number.isRequired,
    expectedDuration: PropTypes.number.isRequired,
  }).isRequired,
};
