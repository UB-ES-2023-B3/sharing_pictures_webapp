import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import Home from './Home.js';
import Home_NoAuth from './Home_NoAuth.js';
import { createRoot } from 'react-dom/client';
import Login from './Login.js';
import SearchResults from './SearchResults';
import Register from './Register.js';
import Profile from './Profile.js';
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
					<Route exact path="" element={<Home />}/>
					<Route path="/search_results" element={<SearchResults />} />
					<Route exact path="" element={<Home />}>
					</Route>
					<Route exact path="/profile/:username" element={<Profile />}>
					</Route>
				</Routes> 
			</Router>
		);
		

	}
}
/*
const root = createRoot(document.getElementById('app'));
root.render(<App />);
*/
