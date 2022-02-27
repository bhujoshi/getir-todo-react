import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Container, makeStyles, Accordion, AccordionDetails, AccordionSummary, Typography, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { DIRTY_ACTION_UPDATE, DIRTY_ACTION_DELETE } from '../../contants/common';
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import CompletedTodoItem from './CompletedTodoItem';
import { updateTodos } from '../../store/slices/todos';
import saveTodoData from '../../apis/TodoApi';


const useStyles = makeStyles({
    accordion: {
        boxShadow: 'none',
        borderTop: '1px solid black',
        marginTop: '20px'
    },
    accordionDetails: {
        display: 'block',
        paddingLeft: '0px'
    },
    accordionSummary: {
        paddingLeft: '4.2%'
    }
});

export const TodoApp = () => {
    const classes = useStyles();
    const todos = useSelector((state) => state.todos);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();
    console.log({ todos })
    useEffect(() => {
        (async () => {
            try {
                const data = await fetch('http://localhost:5000/todos')
                    .then(response => response.json());
                dispatch(updateTodos(data));
            } catch (error) {
                setError("Failed to load todo list. Please reload...")
            }
            setIsLoading(false);
        })();
    }, [])


    const todosItems = [];
    const completedTodosItems = [];
    let isSaveNeeded = false;
    for (let i = 0; i < todos.length; i++) {
        const { _id, uuid, title, isComplete, isDirty, dirtyAction } = todos[i];
        if (isDirty) {
            isSaveNeeded = true;
            if (dirtyAction === DIRTY_ACTION_DELETE) {
                continue;
            }
        }
        if (isComplete) {
            completedTodosItems.push(<CompletedTodoItem todos={todos} key={_id || uuid} index={i} />)
        } else {
            todosItems.push(<TodoItem todos={todos} key={_id || uuid} index={i} />)
        }
    }

    return (
        <Container >
            {isLoading ? 'Loading.....' :
                <>
                    {error && <p style={{color: 'red'}}> {error}</p>}
                    <Button
                        variant="contained"
                        onClick={() => {
                            (async () => {
                                setIsSaving(true);
                                const updatedTodos = await saveTodoData(todos);
                                dispatch(updateTodos(updatedTodos));
                                setIsSaving(false);
                            })()
                        }}
                        color="primary"
                        disabled={!isSaveNeeded || isSaving}
                    >
                        {isSaving ? 'Saving ...' : 'Save'}
                    </Button>
                    <AddTodo />
                    {todosItems}
                    <Accordion className={classes.accordion} defaultExpanded={true}>
                        <AccordionSummary
                            className={classes.accordionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography > {completedTodosItems.length} Completed items </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionDetails}>
                            {completedTodosItems}
                        </AccordionDetails>
                    </Accordion >
                </>
            }
        </Container >
    );
};

