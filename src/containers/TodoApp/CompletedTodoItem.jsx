import React from 'react';
import { Checkbox, Container, makeStyles, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateTodos } from '../../store/slices/todos';
import { DIRTY_ACTION_UPDATE } from '../../contants/common';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: '100%'
    },
    subtitle1: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        padding: '10px 0px 7px'
    }
});
const CompletedTodoItem = (props) => {
    const { todos, index } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    return <Container className={classes.root}>
        <Checkbox checked onChange={() => {
            const newTodos = [...todos];
            newTodos[index] = { ...newTodos[index], isComplete: false, isDirty: true, dirtyAction: DIRTY_ACTION_UPDATE };
            dispatch(updateTodos(newTodos));
        }} />
        <Typography variant="subtitle1" className={classes.subtitle1}>
            {todos[index].title}
        </Typography>
    </Container>
}

export default CompletedTodoItem;