import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todos';

const store = configureStore({
    reducer: {todos: todoReducer}
});

export default store;