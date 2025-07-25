import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

const Login = props => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const onChangeUsername = e => {
        const username = e.target.value
        setUsername(username)
    }

    const onChangePassword = e => {
        const password = e.target.value
        setPassword(password)
    }

    const login = () => {
        props.login({username: username, password: password});
        navigate('/')
    }

    return (
        <Container>
            {errorMessage.length > 0 ? (
            <Alert variant="error">
                {errorMessage}
            </Alert>
            ):(<div/>)}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={onChangeUsername} />                    
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>password</Form.Label>
                    <Form.Control
                        type="password"
                        placehodler="Enter password"
                        value={password}
                        onChange={onChangePassword} />                        
                </Form.Group>
                <Button variant="primary" onClick={login}>Login</Button>
            </Form>
        </Container>
    )
}

export default Login