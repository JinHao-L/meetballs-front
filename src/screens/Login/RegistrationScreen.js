import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function RegistrationScreen() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmationPassword, setConfirmationPassword ] = useState("");

    function readyToSubmit() {
        return email.length > 0 && password.length > 0
            && password === confirmationPassword;
    }

    function onSubmit() {
        console.log("pressed register");
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        autoFocus
                        value={email}
                        onChange={setEmail}
                        placeholder="Please enter your email"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password}
                        type="password"
                        onChange={setPassword}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmation">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        value={confirmationPassword}
                        type="password"
                        onChange={setConfirmationPassword}
                    />
                </Form.Group>
                <Button
                    block="true"
                    size="lg"
                    disabled={!readyToSubmit()}
                    type="submit"
                >
                    Login
                </Button>
            </Form>
        </div>
    );
}
