import axios from "axios";
import { useState } from "react";
import { Form, Button, Toast } from "react-bootstrap";

export default function RegistrationScreen() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmationPassword, setConfirmationPassword ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");

    const [ sending, setSending ] = useState(false);

    const [ response, setResponse ] = useState("");
    const [ error, setError ] = useState(false);

    function readyToSubmit() {
        return email.trim().length > 0
            && password.trim().length > 0
            && firstName.trim().length > 0
            && lastName.trim().length > 0
            && password === confirmationPassword;
    }

    async function onSubmit(event) {
        event.preventDefault();
        setSending(true);
        return axios.post('/auth/signup', {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password
        }).then((res) => {
            console.log("Registered user with " + email);
            setResponse(res.data.message);
        }).catch((e) => {
            console.log(e)
            if (e.response) {
                setError(true);
                setResponse(e.response.data.message);
            }
        }).finally(() => setSending(false));
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Please enter your email"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="input"
                        autoFocus
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="Please enter your first name"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="input"
                        autoFocus
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Please enter your last name"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmation">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        value={confirmationPassword}
                        type="password"
                        onChange={e => setConfirmationPassword(e.target.value)}
                    />
                </Form.Group>
                <Button
                    block="true"
                    size="lg"
                    disabled={!readyToSubmit() || sending}
                    type="submit"
                >
                    {sending ? "Please wait a moment" : "Login"}
                </Button>
            </Form>
            <Toast show={!sending && response !== ""}>
                    <Toast.Header>
                        <strong className="me-auto">Registration complete!</strong>
                    </Toast.Header>
                    <Toast.Body>{ response }</Toast.Body>
            </Toast>
            <Toast show={error && !sending}>
                    <Toast.Header>
                        <strong className="me-auto">Something went wrong!</strong>
                    </Toast.Header>
                    <Toast.Body>{ response }</Toast.Body>
            </Toast>
        </div>
    );
}
