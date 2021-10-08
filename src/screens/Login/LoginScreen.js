import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function LoginScreen() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    function readyToSubmit() {
        return email.length > 0 && password.length > 0;
    }

    function onSubmit() {
        axios.post('/auth/login', {
            email: email,
            password: password
        }).then((response) => {
            
        });
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
                <Button
                    block size="lg"
                    disabled={!readyToSubmit()}
                    type="submit"
                >
                    Login
                </Button>
            </Form>
        </div>
    );
}