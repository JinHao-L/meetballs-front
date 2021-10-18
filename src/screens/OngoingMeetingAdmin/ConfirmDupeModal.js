import { Modal, Button } from 'react-bootstrap';

export default function ConfirmDupeModal({
  showModal,
  setShowModal,
  participant,
  onMarkDuplicate,
}) {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header>
        <Modal.Title>Confirm Delete?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="Text__paragraph">
          <b>{participant.userName}</b> ({participant.userEmail}) will be marked
          as a duplicate and cannot be recovered.
          Are you sure you want to continue?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            setShowModal(false);
            onMarkDuplicate();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
