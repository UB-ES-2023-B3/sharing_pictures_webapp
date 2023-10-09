import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import * as React from 'react'
import {Component} from 'react';
import {render} from "react-dom";
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from './NavBar.js';
import Login from './Login.js';

export default class App extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<ChakraProvider>
			<div>
				<NavBar />
			</div>
			<div>
				<PinterestLayout />
			</div>
			
			</ChakraProvider>
		);

	}	
}
const appDiv = document.getElementById("app");

render(<App/>, appDiv);

