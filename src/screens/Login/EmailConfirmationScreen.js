import { useEffect, useState } from "react";
import { Spinner, Container, Col, Form, Toast, Button } from "react-bootstrap";
import { useLocation } from "react-router";
import server from "../../services/server";

function ResendConfirmationForm() {

    const [ email, setEmail ] = useState("");
    function readyToSubmit() {
        return email.trim().length > 0;
    }

    const [ resent, setResent ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    function submit() {
        return server.post('/auth/resend-confirm', {
            email: email
        }).then((response) => {
            if (response.data.success) setSuccess(true);
        }).catch((error) => {
            console.error(error);
            setSuccess(false);
        }).finally(() => setResent(true));
    }

    return (
        <div>
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formResend">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        autoFocus
                        value={email}
                        onChange={setEmail}
                        placeholder="Enter email here"
                    />
                </Form.Group>
                <Button
                    block
                    size="me"
                    disabled={!readyToSubmit()}
                    type="submit"
                >
                    Resend confirmation email
                </Button>
            </Form>
            <Toast show={resent && success}>
                <Toast.Header>
                    <strong className="me-auto">Success!</strong>
                </Toast.Header>
                <Toast.Body>Confirmation email has been resent to your inbox</Toast.Body>
            </Toast>
            <Toast show={resent && !success}>
                <Toast.Header>
                    <strong className="me-auto">Error!</strong>
                </Toast.Header>
                <Toast.Body>Email not found, are you sure you have registered?</Toast.Body>
            </Toast>
        </div>
    );
}

export default function EmailConfirmationScreen() {

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token = query.get('token');

    const [ responseMsg, setResponseMsg ] = useState('');
    const [ isLoading, setLoading ] = useState(true);
    const [ failed, setFailed ] = useState(false);

    useEffect(() => {
        console.log(`Begin email confirmation! Token is ${token}`);
        return server.post('/auth/confirm', {
            token: token
        })
        .then(res => {
            console.log('Email confirmation');
            setResponseMsg(res.data.message);
        })
        .catch(e => {
            console.error(e);
            setFailed(true);
        })
        .finally(() => setLoading(false));
    }, []);

    if (isLoading) {
        return (
            <>
                <Container className="Container__padding--vertical">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="Container__padding--vertical">
                <Col className="Container__padding--horizontal" >
                    <p>
                        { failed ? "Email confirmation failed" : responseMsg }
                    </p>
                    { failed ? <ResendConfirmationForm /> : null }
                </Col>
            </Container>
        </>
    );
}
