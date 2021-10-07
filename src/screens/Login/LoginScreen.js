import { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function LoginScreen() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    function readyToSubmit() {
        return email.length > 0 && password.length > 0;
    }

    return (
        <div>
            <Form onSubmit={() => {console.log("pressed login")}}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        autoFocus
                        value={email}
                        onChange={setEmail}
                    />
                </Form.Group>
                <Form.Group>
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