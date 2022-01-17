import { combineReducers } from 'redux';
import messageReducer from './message.reducer';

const rootReducer = combineReducers({
  counter: messageReducer,
});

export default rootReducer;
