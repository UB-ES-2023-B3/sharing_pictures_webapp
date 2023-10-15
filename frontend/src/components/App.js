import PinterestLayout_NoAuth from './PinterestLayout_NoAuth.js';
import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import React, { Component } from 'react';

import { createRoot } from 'react-dom/client';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuthenticated: false, // Cambia esto según tu lógica de autenticación
		  };
	  
		
	}
	render() {
		if (this.state.isAuthenticated) {
			return (
				<div>
					<PinterestLayout />
				</div>
			);
		}else {
			
			return (
				<div>
					<PinterestLayout_NoAuth />
				</div>
			);
			
		}
		
	}
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
