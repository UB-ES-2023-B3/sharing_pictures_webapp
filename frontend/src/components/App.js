import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import Home from './Home.js';
import { createRoot } from 'react-dom/client';
import Login from './Login.js';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Redirect,
} from "react-router-dom";


export default class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router>
				<Routes>
					<Route exact path="" element={<Home />}>
					</Route>
					<Route exact path="login/" element={<Login />}>
					</Route>    
				</Routes> 
			</Router>
		);
	}
}

const root = createRoot(document.getElementById('app1'));
root.render(<App />);

