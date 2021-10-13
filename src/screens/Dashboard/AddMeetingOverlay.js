import DatePicker from 'react-datepicker';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { defaultHeaders } from '../../utils/axiosConfig';
import * as yup from 'yup';
import { Formik } from 'formik';

import 'react-datepicker/dist/react-datepicker.css';
import server from '../../services/server';

export default function AddMeetingOverlay({ show, setShow, onUpdate }) {
  const schema = yup.object().shape({
    name: yup.string().required(),
    desc: yup.string().required(),
    meetingId: yup.string().required(),
    link: yup.string().url('Must be a valid URL!').required(),
    date: yup.date().required(),
  });

  const initialValue = {
    name: '',
    desc: '',
    meetingId: '',
    link: '',
    date: new Date(),
  };

  const history = useHistory();

  function submit({ name, desc, date, meetingId, link }) {
    console.log(server.defaults.headers.common['Authorization']);
    const newMeeting = {
      name: name,
      description: desc,
      startedAt: date.toISOString(),
      duration: 1800000,
      meetingId: meetingId,
      startUrl: link,
      joinUrl: link,
      enableTranscription: true,
    };
    setShow(false);
    return server
      .post('/meeting', newMeeting, defaultHeaders)
      .then((res) => {
        onUpdate();
        const id = res.data.id;
        console.log('New meeting created with ID = ' + id);
        history.push('/meeting/' + id);
      })
      .catch(console.error);
  }

  return (
    <Formik
      validationSchema={schema}
      initialValues={initialValue}
      onSubmit={submit}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Offcanvas show={show} onHide={() => setShow(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add New Meeting</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form.Group>
              <Form.Label column>Meeting Name</Form.Label>
              <Form.Control
                required
                placeholder="Please enter meeting name"
                name="name"
                onChange={handleChange}
                value={values.name}
                isValid={touched.name && !errors.name}
              />
              <Form.Label column>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="desc"
                style={{ height: 200 }}
                placeholder="What is the meeting for?"
                onChange={handleChange}
                value={values.desc}
                isValid={touched.desc && !errors.desc}
              />
              <Form.Label column>Meeting ID</Form.Label>
              <Form.Control
                required
                name="meetingId"
                placeholder="Please enter meeting ID"
                onChange={handleChange}
                value={values.meetingId}
                isValid={touched.meetingId && !errors.meetingId}
              />
              <Form.Label column>Meeting link</Form.Label>
              <Form.Control
                required
                name="link"
                placeholder="Please enter meeting link"
                onChange={handleChange}
                value={values.link}
                isValid={touched.link && !errors.link}
              />
              <Form.Label column>Start Date</Form.Label>
              <DatePicker
                name="date"
                selected={values.date}
                showTimeSelect
                onChange={(date) => setFieldValue('date', date)}
                dateFormat="Pp"
                customInput={<Form.Control />}
              />
            </Form.Group>
            <div className="Buffer--20px" />
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Add new Meeting
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Formik>
  );
}
