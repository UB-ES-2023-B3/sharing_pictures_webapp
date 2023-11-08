import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';

import Home_NoAuth from './Home_NoAuth.js';
import { createRoot } from 'react-dom/client';
import Login from './Login.js';
import Register from './Register.js';
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";



export default class App_NoAuth extends Component {

	constructor(props) {
		super(props);
		
	}

	render() {
		
			return (
			<Router>
				<Routes>
					<Route exact path="" element={<Home_NoAuth />}>
					</Route>
					<Route exact path="login/" element={<Login />}>
					</Route>    
					<Route exact path = "register/" element={<Register />}>
					</Route>   
				</Routes> 
			</Router>
		);
		
	}
}
/*
const root = createRoot(document.getElementById('app-no-auth'));
root.render(<App_NoAuth />);
*/
