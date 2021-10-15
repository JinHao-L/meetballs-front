import { Card } from 'react-bootstrap';

export function SpeakerSection({ item }) {
  const speaker = item.speakerName;
  if (!speaker) return null;
  return <Card.Text>Presented by {speaker}</Card.Text>;
}

export function MaterialsSection({ item }) {
  const materials = item.speakerMaterials;
  if (!materials) return null;

  const link = <a href={materials}>Link</a>;
  return <Card.Text>Materials: {link}</Card.Text>;
}
