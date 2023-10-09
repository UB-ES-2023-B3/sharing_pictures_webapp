
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";

import { ChakraProvider } from '@chakra-ui/react'
export default class Login extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<h1>Hola</h1>
			</div>
		);
	}
}
const appDiv = document.getElementById("login");

render(<Login />, appDiv);