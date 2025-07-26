import React, {useState, useEffect} from 'react'
import TodoDataService from '../services/todos'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import dayjs from 'dayjs'
import ReactPaginate from 'react-paginate';

const TodosList = props => {
    const [todos, setTodos] = useState([])
    const [offset, setOffset] = useState(0)
    const [batch, setBatch] = useState(20)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        retrieveTodos()
    }, [props.token, offset])

    const retrieveTodos = () => {        
        if (props.token != null && props.token != "")
        {
            TodoDataService.getAll(props.token, offset, batch)
            .then(response => {
                setOffset(response.data['pagination']['offset'])
                setBatch(response.data['pagination']['limit'])
                setTotal(response.data['pagination']['total'])
                setTodos(response.data['todos'])
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

    const handlePageClick = (event) => {
        const newOffset = Math.min(total, (event.selected * batch));
        setOffset(newOffset);
    };

    const pageCount = Math.ceil(total / batch)
    
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
                    <div className="container">
                        {todos.map((todo) => {
                            return (
                            <div key={todo.id} className="row todo-row">
                                <div className={`${todo.completed ? "text-decoration-line-through" : ""}`}>
                                    <span className="todo-title">{todo.title}</span>
                                    <div><b>Memo:</b> {todo.memo}</div>
                                    <div>Date created: {dayjs(todo.created).format("MMMM DD, YYYY")}</div>
                                    
                                </div>
                                <div>
                                    <span className="form-check" style={{display: 'inline-block'}}>
                                        <input type="checkbox" onClick={() => completeTodo(todo.id)} className="form-check-input" defaultChecked={todo.completed} />
                                        <label className="form-check-label">Completed</label>
                                    </span>
                                    <span style={{float: 'right'}}>
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
                                    </span>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {props.token != null && props.token != "" ? (
            <ReactPaginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                breakLabel="..."
                previousLabel="< previous"
                nextLabel="next >"
                renderOnZeroPageCount={null}
                activeClassName='active'
                containerClassName='pagination'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
            />
            ) : <div/>}
        </Container>
    )
}
export default TodosList