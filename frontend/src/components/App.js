import UploadFloating from './UploadFloating.js';
import '../../static/css/styles.css';
import React, {Component} from 'react';


export default class App extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div>
				<UploadFloating />
			</div>
		);

	}	
}



