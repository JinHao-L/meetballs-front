import { Card, Button } from 'react-bootstrap';
import { openLinkInNewTab } from '../common/CommonFunctions';

export function SpeakerSection({ item }) {
  const speaker = item?.speaker?.userName;
  if (!speaker) return null;
  return <Card.Subtitle>Presented by {speaker}</Card.Subtitle>;
}

export function MaterialsSection({ item }) {
  const materials = item.speakerMaterials;
  if (!materials) return null;
  return (
    <div className="d-grid gap-2">
      <Button onClick={() => openLinkInNewTab(materials)}>
        View Materials
      </Button>
    </div>
  );
}
