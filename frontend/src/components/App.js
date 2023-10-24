import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import Home from './Home.js';
import Home_NoAuth from './Home_NoAuth.js';
import { createRoot } from 'react-dom/client';
import Login from './Login.js';
import Register from './Register.js';
import ImageCard from './ImageCard.js';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Redirect,
} from "react-router-dom";

import { ChakraProvider } from '@chakra-ui/react'


export default class App extends Component {

	constructor(props) {
		super(props);

	}

	render() {
		
		return (
			<ChakraProvider>
			<Router>
				<Routes>
					<Route exact path="" element={<Home />}>
					</Route>
					<Route exact path="viewImage/" element={<ImageCard />}>
					</Route> 
				</Routes> 
			</Router>
			</ChakraProvider>

		);
		

	}
}
/*
const root = createRoot(document.getElementById('app'));
root.render(<App />);
*/
