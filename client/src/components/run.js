import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import AppComponent from './Main';
import configureStore from '../stores/configureStore'
import rootReducer from '../reducers/index'
import * as ArticleActions from '../actions/articles'
import * as TermActions from '../actions/terms'


// const store = (applyMiddleware)configureStore()
let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store = createStoreWithMiddleware(rootReducer);

// Render the main component into the dom
ReactDOM.render(
  <Provider store={store}>
    <AppComponent />
  </Provider>,
  document.getElementById('app')
);
