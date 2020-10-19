import { combineReducers } from 'redux';
// Reducers
import rtcReducer from './rtc-reducer';
// Combine Reducers
const reducers = combineReducers({
  rtc: rtcReducer,
});
export default reducers;
