import React, {useState, useEffect} from 'react'
import TodoDataService from '../services/todos'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import dayjs from 'dayjs'

const TodosList = props => {
    const [todos, setTodos] = useState([])

    useEffect(() => {
        retrieveTodos()
    }, [props.token])

    const retrieveTodos = () => {        
        if (props.token != null && props.token != "")
        {
            TodoDataService.getAll(props.token)
            .then(response => {
                setTodos(response.data)
            })
            .catch(e => {
                console.log(e);
            })
        }
    }

    const deleteTodo = (todoId) => {
        TodoDataService.deleteTodo(todoId, props.token)
            .then(response => {
                retrieveTodos();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const completeTodo = (todoId) => {
        TodoDataService.completeTodo(todoId, props.token)
            .then(response => {
                retrieveTodos();
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <Container>
            {props.token == null || props.token == "" ? (
                <Alert variant="warning">
                    You are not logged in. Please <Link to={"/login"}>login</Link> to see your todos.
                </Alert>
            ) : (
                <div>
                    <Link to={"/todos/create"}>
                        <Button variant="outline-info" className="mb-3">
                            Add Todo
                        </Button>
                    </Link>
            <div className="row">
                {todos.map((todo) => {
                    return (
                    <Card key={todo.id} className="mb-3">
                        <Card.Body>
                            <div className={`${todo.completed ? "text-decoration-line-through" : ""}`}>
                                <Card.Title>{todo.title}</Card.Title>
                                <Card.Text><b>Memo:</b> {todo.memo}</Card.Text>
                                <Card.Text>Date created: {dayjs(todo.created).format("MMMM DD, YYYY")}</Card.Text>
                                <span className="form-check">
                                    <input type="checkbox" onClick={() => completeTodo(todo.id)} className="form-check-input" defaultChecked={todo.completed} />
                                    <label className="form-check-label">Completed</label>
                                </span>
                            </div>
                            {!todo.completed &&
                            <Link to={'/todos/' + todo.id}
                                state={{
                                    currentTodo: todo                            
                            }}>
                                <Button variant="outline-info" className="me-2">
                                    Edit
                                </Button>
                            </Link>
                            }
                            <Button variant="outline-danger" onClick={() => deleteTodo(todo.id)} className="me-2">
                                Delete
                            </Button>                        
                        </Card.Body>
                    </Card>
                    )
                })}
                </div>
            </div>
        )}
        </Container>
    )
}
export default TodosList