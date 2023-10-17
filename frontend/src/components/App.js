<<<<<<< HEAD

import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import Home from './Home.js';
import { createRoot } from 'react-dom/client';
import Login from './Login.js';
=======
import UploadFloating from './UploadFloating.js';
import '../../static/css/styles.css';
import React, {Component} from 'react';
import PinterestLayout from './PinterestLayout.js';
>>>>>>> origin/test

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
<<<<<<< HEAD
=======
	render(){
		return (
			<div>
				<PinterestLayout />
				<UploadFloating />
			</div>
		);
>>>>>>> origin/test

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

<<<<<<< HEAD
const root = createRoot(document.getElementById('app'));
root.render(<App />);
=======

>>>>>>> origin/test

