import { useState } from "react";
import { Form, Button, Col, Toast } from "react-bootstrap";
import { useHistory } from "react-router";
import { login } from "../../services/auth";

export default function LoginScreen() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    function readyToSubmit() {
        return email.length > 0 && password.length > 0;
    }

    const [ sending, setSending ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ errMsg, setErrMsg ] = useState("");

    const history = useHistory();

    function onSubmit(event) {
        event.preventDefault();
        setSending(true);
        return login(email, password)
            .then(() => history.push('/home'))
            .catch((e) => {
                setError(true);
                console.error(e);
                if (e.response) setErrMsg(e.response.message);
                else setErrMsg("Could not connect to server, please try again later");
            })
            .finally(() => setSending(false));
    }

    function toPasswordReset() {
        history.push('/forgot-password');
    }
    
    function toSignUp() {
        history.push('/signup');
    }

    return (
        <>
            <div className="Container__padding--horizontal">
                <Form className="Container__padding--vertical" onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={password}
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Col>
                        <Button
                            block="true"
                            size="lg"
                            disabled={!readyToSubmit() || sending}
                            type="submit"
                        >
                            { sending ? "Please wait" : "Login" }
                        </Button>
                        <Button variant="link" onClick={toSignUp}>New user? Sign up here!</Button>
                        <Button variant="link" onClick={toPasswordReset}>Forgot password?</Button>
                    </Col>
                </Form>
                <Toast show={error && !sending}>
                    <Toast.Header>
                        <strong className="me-auto">Something went wrong!</strong>
                    </Toast.Header>
                    <Toast.Body>{ errMsg }</Toast.Body>
                </Toast>
            </div>
        </>
    );
}