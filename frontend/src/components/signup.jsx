import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Signup = props => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onChangeUsername = e => {
        const username = e.target.value
        setUsername(username)
    }

    const onChangePassword = e => {
        const password = e.target.value
        setPassword(password)
    }

    const signup = () => {
        props.signup({username: username, password: password})
        navigate('/')
    }

    return (
        <Container>
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
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={onChangePassword} />
                </Form.Group>
                <Button variant="primary" onClick={signup}>Sign Up</Button>
            </Form>
        </Container>
    )
}

export default Signup