import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from 'store/store-pomodoro';
import App from './App';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';

configureStore();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);