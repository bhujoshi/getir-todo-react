import React, {  useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Container, makeStyles, TextField, FormControl } from '@material-ui/core';
import uuid from 'react-uuid';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../store/slices/todos';
import { DIRTY_ACTION_UPDATE } from '../../contants/common';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: '100%'
    },
    plusIcon: {
        margin: '5px 10px 0px 8px'
    }
});

// just using tmpuuid as a key for new todos 
const getNewTodo = (title) => ({ uuid: uuid(), title, isComplete: false, isDirty: true, dirtyAction: DIRTY_ACTION_UPDATE });
const AddTodo = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    return (
        <Container className={classes.root}>
            <AddIcon className={classes.plusIcon} />{' '}
            <FormControl fullWidth >
                <TextField
                    onChange={(e) => {
                        dispatch(addTodo(getNewTodo(e.target.value)));
                        setValue('');
                    }}
                    value={value}
                    placeholder="Add item."
                    className="w-10/12"
                    autoFocus
                />
            </FormControl>
        </Container>
    );
};


export default AddTodo;