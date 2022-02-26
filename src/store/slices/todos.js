import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => [action.payload, ...state],
    updateTodos: (state, action) => {
      return [...action.payload];
    }
  }
})

export const { addTodo, updateTodos } = todoSlice.actions

export default todoSlice.reducer;
