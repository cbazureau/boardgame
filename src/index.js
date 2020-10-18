import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import Home from './components/Home'
import Room from './components/Room'
import NotFound from './components/NotFound'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/r/:room" component={Room} />
				<Route path="*" component={NotFound} />
			</Switch>
		</BrowserRouter>
	</Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
