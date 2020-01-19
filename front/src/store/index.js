import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createRootReducer from '../reducers';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const store = createStore(
    createRootReducer(history),
    applyMiddleware(
        logger,
        thunk,
        routerMiddleware(history),
    ),
);

export default store;
