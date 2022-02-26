import React, { useRef, useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Checkbox, Container, makeStyles, TextField, Accordion, AccordionDetails, AccordionSummary, Typography, FormControl, Button } from '@material-ui/core';
import uuid from 'react-uuid';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { addTodo, updateTodos } from '../store/slices/todos';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%'
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    // fontWeight: theme.typography.fontWeightRegular,
  },
  underline: {
    "&&&:before": {
      borderBottom: "none"
    }
  },
  textFeild: {
    padding: '10px 0px 7px'
  },
  subtitle1: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    padding: '10px 0px 7px'
  },
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
  },
  closeIcon: {
    margin: '10px 0px 7px',
    cursor: 'pointer'
  },
  plusIcon: {
    margin: '5px 10px 0px 8px'
  }
});
const DIRTY_ACTION_UPDATE = 'UPDATE';
const DIRTY_ACTION_DELETE = 'DELETE';
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

let timer = null;
const TodoItem = (props) => {
  const { todos, index } = props;
  const inputRef = useRef(null);
  const classes = useStyles();
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
            timer = setTimeout(()=>{updateTodo(e.target.value, false)}, 2000);
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


const CompletedTodoItem = (props) => {
  const { todos, index } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  return <Container className={classes.root}>
    <Checkbox checked onChange={() => {
      const newTodos = [...todos];
      newTodos[index] = { ...newTodos[index], isComplete: false };
      dispatch(updateTodos(newTodos));
    }} />
    <Typography variant="subtitle1" className={classes.subtitle1}>
      {todos[index].title}
    </Typography>
  </Container>
}

export const TodoApp = () => {
  const classes = useStyles();
  const todos = useSelector((state) => state.todos);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  console.log({ todos })
  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then(response => response.json())
      .then(data => { setIsLoading(false); dispatch(updateTodos(data)) })
      .catch(() => {
        setIsLoading(false);
      })
  }, [])

  const saveData = (todos) => {
    // setIsSaving(true);
    for (let i = 0; i < todos.length; i++) {
      const { _id, uuid, title, isComplete, isDirty, dirtyAction } = todos[i];

      if (isDirty && dirtyAction === DIRTY_ACTION_UPDATE) {
        if (_id) {
          fetch('http://localhost:5000/todos/item/' + _id, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, isComplete })
          }).then((response) => response.json())
          .then((responseData) => {
            console.log(responseData);
            // return responseData;
          }).catch((err) => {
            console.log(err);
          })
        } else {
          fetch('http://localhost:5000/todos/item', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, isComplete })
          }).then((response) => response.json())
          .then((responseData) => {
            console.log(responseData);
            // return responseData;
          }).catch((err) => {
            console.log(err);
          })
        }

      }
      if (isDirty && dirtyAction === DIRTY_ACTION_DELETE) {
        fetch('http://localhost:5000/todos/item/' + _id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        }).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  }

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
          <Button
            variant="contained"
            onClick={() => { saveData(todos) }}
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

