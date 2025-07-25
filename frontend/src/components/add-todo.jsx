import React, { useEffect, useState} from 'react'
import { Navigate, useLocation} from 'react-router'
import TodoDataService from '../services/todos'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/esm/Container'
import { BoldItalicUnderlineToggles, BlockTypeSelect, listsPlugin, headingsPlugin, ListsToggle, MDXEditor, toolbarPlugin, } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

const AddTodo = props => {

    let editing = false
    let initialTodoTile = ''
    let initialTodoMemo = ''

    const location = useLocation()
    const navigate = useNavigate()
    if (location.state && location.state.currentTodo)
    {
        editing = true
        initialTodoTile = location.state.currentTodo.title
        initialTodoMemo = location.state.currentTodo.memo        
    }

    const [title, setTitle] = useState(initialTodoTile)
    const [memo, setMemo] = useState(initialTodoMemo)
    // Keeps track if todo is submitted
    const [submitted, setSubmitted] = useState(false);

    const onChangeTitle = e =>{        
        const title = e.target.value
        setTitle(title)
    }

    const onChangeMemo = e =>{
        setMemo(e)
    }

    const saveTodo = () => {
        var data = {
            title: title,
            memo: memo,
            completed: false,
        }

        if (editing) {
            TodoDataService.updateTodo(
                location.state.currentTodo.id,
                data, props.token)
            .then(response => {
                setSubmitted(true)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e);
            })
        }
        else
        {
            TodoDataService.createTodo(data, props.token)
                .then(response => {
                    setSubmitted(true)                    
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    useEffect(() => {
        if (submitted)
            navigate('/todos');
    }, [submitted, navigate])

    const ref = React.useRef(null);
    return (
        <Container className="App">
            { submitted ? (
                <div>
                    <h4>Todo submitted successfully</h4>
                    <Link to={'/todos/'}>Back to Todos</Link>
                </div>
            ) : (
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>{editing ? 'Edit' : 'Create' } Todo</Form.Label>
                        <Form.Control
                            type='text'
                            required
                            placeholder='e.g. buy gift tomorrow'
                            value={title}
                            onChange={onChangeTitle} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <MDXEditor className='form-control' rows='10' ref={ref} markdown={memo} onChange={onChangeMemo} plugins={[
          headingsPlugin(),
          listsPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
              </>
            ),
          }),
        ]}  />                        
                    </Form.Group>
                    <Button variant="info" onClick={saveTodo}>{editing ? 'Edit' : 'Add' } Todo</Button>
                </Form>
            )}
        </Container>
    )
}

export default AddTodo