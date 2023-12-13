import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import App from './App.js';
import { ChakraProvider,View } from '@chakra-ui/react'
import { useState, useMemo, useEffect, useCallback } from "react";
import axios from 'axios';
import { Text, Input, Button, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
} from '@chakra-ui/react'

import {
	Flex,
	Box,
	Heading,
	IconButton
} from '@chakra-ui/react';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			email: '',
			password: '',
			passwordError: false,
			errorMessages: '',
			isSubmitting: true,
			isLoggedIn: false,
			passwordErrorMessage: '',
		};
	}
	handleClick = () => {
		this.setState((prevState) => ({
			show: !prevState.show,
		}));
	};

	setEmail = (value) => {
		this.setState(
		  {
			email: value,
		  },
		  () => {
			this.setSubmitButtonState();
		  }
		);
	  };
	  

	setShow = () => {
		this.setState({
			show: !this.state.show,
		});
	};
	setPasswordErrorMessages = (value) => {
		this.setState({
			passwordErrorMessage: value,
		});
	};
	setPasswordError = (value) => {
		this.setState({
			passwordError: value,
		});
	};
	setPassword = (value) => {
		this.setState(
		  {
			password: value,
		  },
		  () => {
			this.setSubmitButtonState();
		  }
		);
	  };

	handleSubmit = async (event) => {
		// Tu lógica de envío del formulario aquí
	};

	navigateToRegister = () => {
		window.location.href="../register/"
	};

	// Validaciones
	validatePassword = () => {
		const { password } = this.state;
		if (password.length < 1) {
			this.setPasswordErrorMessages('Password empty');
			this.setPasswordError(true);
		} else {
			this.setPasswordErrorMessages(''); // Accede a setEmailErrorMessage a través de this
			this.setPasswordError(false); // Accede a setEmailError a través de this
		}
	};
	navigateToHouse= () => {
		if(!this.state.passwordError){
			window.location.href=""
		}
		
	  };
	validateParameters = () => {
		this.validatePassword();
		this.setState({
			isSubmitting: !this.state.passwordError,
		  });
	};
	setSubmitButtonState = () => {
		const { email, password } = this.state;
		const isSubmitButtonDisabled = !email || !password;
		this.setState({
		  isSubmitting: isSubmitButtonDisabled,
		});
	  };

	logOut = async () => {
		// Tu lógica para cerrar sesión aquí
	};
	handlePostRequest = async() => {
		// Tu lógica de envío del formulario aquí
		const formData = new FormData();
		formData.append('username', this.state.email);
		formData.append('password', this.state.password);

		axios.post('/api/login/', formData)
		.then((response) => { // Registre exitós (status code 201)
		  	console.log(response);
    		window.location.href="/"
		})
		.catch((error) => {

      Swal.fire({
        icon: 'error',
        title: 'Login Failed: Invalid user or password',
      });

		  }
		)
	  };
	
	render() {
		const { show, email, password, passwordError, errorMessages, isSubmitting, isLoggedIn } = this.state;
		return (
			<ChakraProvider>
				<div className="login-form">
					<Flex width="full" align="center" justifyContent="center" padding={"20px"}>
						<Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
							<Box textAlign="center">
								<Heading>Login</Heading>
							</Box>
							<Box my={4} textAlign="left">
								<FormControl>
									<FormLabel>Email</FormLabel>
									<Input type='email' value={email} onChange={(e) => this.setEmail(e.target.value)} />
								</FormControl>
								<FormControl isInvalid={this.state.passwordError}>
									<FormLabel>Password</FormLabel>
									<InputGroup>
										<Input
											type={this.state.show ? 'text' : 'password'}
											value={password}
											placeholder="*****"
											size="lg"
											onChange={(e) => this.setPassword(e.target.value)}
										/>
										
									</InputGroup>
									{!this.state.passwordError ? null : (
										<FormErrorMessage>{this.state.passwordErrorMessage}</FormErrorMessage>
									)}
								</FormControl>
								<Box textAlign="center">
									<Button mt={4} backgroundColor="#d33" color="white" type='submit' onClick={this.validateParameters && this.handlePostRequest} isDisabled={this.state.isSubmitting}>
										Submit
									</Button>
								</Box>
								<Box marginTop="10px">
									<Text>
										Are you registered?
										<Button marginLeft="5px" colorScheme='#98A8F8' variant='link'   onClick={() => {this.navigateToRegister();}}>
											Register
										</Button>
									</Text>
								</Box>
							</Box>
						</Box>
					</Flex>
				</div >
			</ChakraProvider>
		);
	}
}