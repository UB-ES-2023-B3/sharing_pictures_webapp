import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import Home from './Home.js';
import Home_NoAuth from './Home_NoAuth.js';
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
	this.state = {
		userAuthenticated: false,
	};
		
	}

	render() {
		if(this.state.userAuthenticated ==true){
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
		else {
			return (
			<Router>
				<Routes>
					<Route exact path="" element={<Home_NoAuth />}>
					</Route>
					<Route exact path="login/" element={<Login />}>
					</Route>    
				</Routes> 
			</Router>
		);
		}
	}
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);

