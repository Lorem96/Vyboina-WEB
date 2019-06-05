import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import * as reducers from '../src/reducers';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootSaga from './sagas';
const reducer = combineReducers(reducers);
const sagaMiddleware = createSagaMiddleware();
const rootElement = document.getElementById('root');
const middleware = [reduxThunk, sagaMiddleware];
const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
