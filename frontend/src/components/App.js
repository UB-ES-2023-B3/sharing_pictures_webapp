import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import React, {Component} from 'react';
import {render} from "react-dom";

export default class App extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div>
				<PinterestLayout />
			</div>
		);

	}	
}
const appDiv = document.getElementById("app");
render(<App/>, appDiv);
