import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userReducer from './user';
import generalReducer from './general';

export default function rootReducer(history) {
    return combineReducers({
        user: userReducer,
        general: generalReducer,
        router: connectRouter(history),
    });
}
