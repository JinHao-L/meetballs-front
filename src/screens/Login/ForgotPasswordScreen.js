import { useState } from "react";
import { Form, Button, Toast } from "react-bootstrap";

export default function ForgotPasswordScreen() {

    const [ email, setEmail ] = useState("");
    function readyToSubmit() {
        return email.trim().length > 0;
    }

    const [ sent, setSent ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    async function submit() {
        return axios.post('/auth/forget-password', {
            email: email
        }).then((response) => {
            if (response.data.success) setSuccess(true);
        }).catch((error) => {
            console.error(error);
            setSuccess(false);
        }).finally(() => setSent(true));
    }

    return (
        <div>
            <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formReset">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        autoFocus
                        value={email}
                        onChange={setEmail}
                        placeholder="Enter email here"
                    />
                    <Button
                        block
                        size="me"
                        disabled={!readyToSubmit()}
                        type="submit"
                    >
                        Reset password
                    </Button>
                </Form.Group>
            </Form>
            <Toast show={sent && success}>
                <Toast.Header>
                    <strong className="me-auto">Success!</strong>
                </Toast.Header>
                <Toast.Body>Password reset instructions has been sent to your inbox</Toast.Body>
            </Toast>
            <Toast show={sent && !success}>
                <Toast.Header>
                    <strong className="me-auto">Error!</strong>
                </Toast.Header>
                <Toast.Body>Email not found, are you sure you have registered?</Toast.Body>
            </Toast>
        </div>
    );
}