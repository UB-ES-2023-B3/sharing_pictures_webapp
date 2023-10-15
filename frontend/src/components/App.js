import UploadFloating from './UploadFloating.js';
import '../../static/css/styles.css';
import React, {Component} from 'react';
import PinterestLayout from './PinterestLayout.js';

export default class App extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div>
				<PinterestLayout />
				<UploadFloating />

			</div>
		);

	}	
}



