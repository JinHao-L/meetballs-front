import { Card, Button } from 'react-bootstrap';
import { openFile } from '../services/files';
import { toast } from 'react-toastify';
import { isValidUrl } from '../common/CommonFunctions';

export function SpeakerSection({ item }) {
  const speaker = item?.speaker?.userName;
  if (!speaker) return null;
  return (
    <Card.Subtitle style={{ marginBottom: '0.5rem' }}>
      Presented by {speaker}
    </Card.Subtitle>
  );
}

export function MaterialsSection({ item, variant = 'primary' }) {
  const materials = item.speakerMaterials;
  if (!materials || (!isValidUrl(materials) && !item.speaker)) return null;
  return (
    <div className="d-grid gap-2">
      <Button
        variant={variant}
        onClick={() =>
          openFile(
            item.speakerMaterials,
            item.meetingId,
            item.speaker?.id,
          ).catch((_err) => {
            toast.error('File not found');
          })
        }
      >
        View Materials
      </Button>
    </div>
  );
}
