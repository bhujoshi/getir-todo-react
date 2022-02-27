import React, { useRef, useState, useEffect } from 'react';
import { Checkbox, Container, makeStyles, TextField, FormControl } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { DIRTY_ACTION_UPDATE, DIRTY_ACTION_DELETE } from '../../contants/common';
import { updateTodos } from '../../store/slices/todos';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: '100%'
    },
    underline: {
        "&&&:before": {
            borderBottom: "none"
        }
    },
    textFeild: {
        padding: '10px 0px 7px'
    },
    closeIcon: {
        margin: '10px 0px 7px',
        cursor: 'pointer'
    }
});

let timer = null;
const TodoItem = (props) => {
    const { todos, index } = props;
    const classes = useStyles();
    const inputRef = useRef(null);
    // const classes = useStyles();
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const { title } = todos[index];
        todos[index].title.length < 2 && inputRef.current && inputRef.current.focus();
        setTitle(title);
    }, []);

    const updateTodo = (title, isComplete) => {
        const newTodos = [...todos];
        console.log(title, isComplete)
        newTodos[index] = { ...newTodos[index], title, isComplete, isDirty: true, dirtyAction: DIRTY_ACTION_UPDATE }
        dispatch(updateTodos(newTodos));
    };

    const deleteTodo = () => {
        const newTodos = [...todos];
        newTodos[index] = { ...newTodos[index], isDirty: true, dirtyAction: DIRTY_ACTION_DELETE };
        console.log(newTodos[index]);
        dispatch(updateTodos(newTodos));
    }

    return (
        <Container className={classes.root} >
            <Checkbox
                onChange={() => {
                    updateTodo(title, true);
                }}
            />
            <FormControl fullWidth >
                <TextField
                    className={classes.textFeild}
                    InputProps={{ classes: { underline: classes.underline } }}
                    inputRef={inputRef}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        clearTimeout(timer);
                        timer = setTimeout(() => { updateTodo(e.target.value, false) }, 2000);
                    }}
                />
            </FormControl>
            <CloseIcon
                className={classes.closeIcon}
                onClick={deleteTodo}
            />
        </Container>
    );
};


export default TodoItem;