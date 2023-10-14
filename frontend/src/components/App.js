import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import React, {Component} from 'react';

import { createRoot } from 'react-dom/client';

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

const root = createRoot(document.getElementById('app'));
root.render(<App />);
