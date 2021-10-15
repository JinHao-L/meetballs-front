import { useState } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
import server from '../services/server';

// NOT TESTED YET
export default function UploadModal({ meetingId }) {
  const [file, setFile] = useState('');
  const [sending, setSending] = useState('');
  const [error, setError] = useState('');

  const uploadFile = async (event) => {
    event.preventDefault();
    try {
      setSending(true);
      const file = event.target.files[0];
      const fileLink = URL.createObjectURL(file);
      console.log(file, fileLink);
      const res = await server.get(`/uploads/write/${meetingId}`, {
        fileName: file.name,
        mimeType: file.type,
      });
      const signedUrl = res.data;
      uploadToS3(signedUrl);
    } catch (err) {
      setSending(false);
      setError(err);
    } finally {
      setSending(false);
    }
  };

  const uploadToS3 = async (signedUrl) => {
    if (signedUrl) {
      return fetch(signedUrl, {
        headers: {
          'Content-Type': 'image/png',
        },
        method: 'PUT',
        body: file,
      }).catch((err) => {
        console.error('Image upload failed');
        throw err;
      });
    }
  };

  return (
    <>
      <Form className="Container__padding--vertical" onSubmit={uploadFile}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select local file</Form.Label>
          <Form.Control
            type="file"
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
        </Form.Group>
        <div className="d-grid gap-2">
          <Button block="true" size="lg" disabled={sending} type="submit">
            {sending ? 'Please wait' : 'Login'}
          </Button>
        </div>
      </Form>
      <Toast show={error && !sending} position={'top-end'}>
        <Toast.Header>
          <strong className="me-auto">Something went wrong!</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast>
    </>
  );
}
