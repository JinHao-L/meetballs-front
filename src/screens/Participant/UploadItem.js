import { Card, Col } from 'react-bootstrap';

export default function UploadItem({ agendaItem }) {
  return (
    <Col
      lg={6}
      md={12}
      sm={12}
      style={{ paddingLeft: 10, paddingRight: 10 }}
      className="Container__padding--vertical-small"
    >
      <Card>
        <Card.Body>
          <Card.Title>{agendaItem?.name}</Card.Title>
          <Card.Text>{agendaItem?.description}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
