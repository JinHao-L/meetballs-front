import { useState } from "react";
import { useLocation } from "react-router";
import { Form, Toast, Button } from "react-bootstrap";
import server from "../../services/server";

export default function ResetPasswordScreen() {

    console.log("I am at password reset screen!");

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const token = params.get('token');

    const [ password, setPassword ] = useState("");
    const [ confirmation, setConfirmation ] = useState("");

    function readyToSubmit() {
        return password.trim().length > 0 && password === confirmation;
    }

    const [ loading, setLoading ] = useState(false);
    const [ sent, setSent ] = useState(false);
    const [ success, setSuccess ] = useState(false);
    const [ responseMsg, setResponseMsg ] = useState("");

    function submit(event) {
        event.preventDefault();
        setLoading(true);
        return server.post('/auth/password-reset', {
            token, password
        }).then((response) => {
            const res = response.data;
            if (res.success) setSuccess(true);
            setResponseMsg(res.message);
        }).catch((e) => {
            console.error(e);
            if (e.response) setResponseMsg(e.response.data.message);
            setSuccess(false);
        }).finally(() => {
            setSent(true);
            setLoading(false);
        });
    }

    return (
        <>
            <div>
                <Form onSubmit={submit}>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            autoFocus
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password here"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formConfirm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            autoFocus
                            value={confirmation}
                            onChange={e => setConfirmation(e.target.value)}
                            placeholder="Retype your password here"
                        />
                    </Form.Group>
                    <Button
                        block
                        size="me"
                        disabled={!readyToSubmit() || loading}
                        type="submit"
                    >
                        { loading ? "Please wait a moment" : "Submit"}
                    </Button>
                </Form>
                <Toast show={sent && success}>
                    <Toast.Header>
                        <strong className="me-auto">Success!</strong>
                    </Toast.Header>
                    <Toast.Body>{responseMsg}</Toast.Body>
                </Toast>
                <Toast show={sent && !success}>
                    <Toast.Header>
                        <strong className="me-auto">Error!</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {responseMsg === "" ? "Please try again later" : responseMsg }
                    </Toast.Body>
                </Toast>
            </div>
        </>
    );
}
