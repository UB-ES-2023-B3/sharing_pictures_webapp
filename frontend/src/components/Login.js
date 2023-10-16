
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import App from './App.js';
import { ChakraProvider } from '@chakra-ui/react'
import { useState, useMemo, useEffect, useCallback } from "react";

import { Text, Input, Button, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

import {
	Flex,
	Box,
	Heading,
	IconButton
} from '@chakra-ui/react';

import ErrorMessage from './ErrorMessage.js';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			email: '',
			emailError: false,
			password: '',
			passwordError: false,
			errorMessages: '',
			isSubmitting: false,
			isLoggedIn: false,
			emailErrorMessage: '',
			passwordErrorMessage: '',
		};
	}
	handleClick = () => {
		this.setState((prevState) => ({
			show: !prevState.show,
		}));
	};

	setEmail = (value) => {
		this.setState({
			email: value,
		});
	};

	setShow = () => {
		this.setState({
			show: !this.state.show,
		});
	};

	setEmailErrorMessage = (value) => {
		this.setState({
			emailErrorMessage: value,
		});
	};
	setEmailError = (value) => {
		this.setState({
			emailError: value,
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
		this.setState({
			password: value,
		});
	};

	handleSubmit = async (event) => {
		// Tu lógica de envío del formulario aquí
	};

	navigateToRegister = () => {
		// Tu lógica para ir a la página de registro aquí
	};

	// Validaciones
	validateEmail = () => {
		const { email } = this.state; // Accede al email desde el estado
		const mailformat = /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/gi;
		if (email === '') {
			this.setEmailErrorMessage('Email is required'); // Accede a setEmailErrorMessage a través de this
			this.setEmailError(true); // Accede a setEmailError a través de this
		} else if (email.match(mailformat) === null) { // Cambia el operador de igualdad aquí
			this.setEmailErrorMessage('Invalid email format'); // Accede a setEmailErrorMessage a través de this
			this.setEmailError(true); // Accede a setEmailError a través de this
		} else {
			this.setEmailErrorMessage(''); // Accede a setEmailErrorMessage a través de this
			this.setEmailError(false); // Accede a setEmailError a través de this
		}
	};

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
		if(!this.state.emailError && !this.state.passwordError){
			window.location.href=""
		}
		
	  };
	validateParameters = () => {
		this.validateEmail();
		this.validatePassword();
	};

	logOut = async () => {
		// Tu lógica para cerrar sesión aquí
	};
	render() {
		const { show, email, emailError, password, passwordError, errorMessages, isSubmitting, isLoggedIn } = this.state;
		return (
			<ChakraProvider>
				<div className="login-form">
					<Flex width="full" align="center" justifyContent="center" padding={"20px"}>
						<Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
							<Box textAlign="center">
								<Heading>Login</Heading>
							</Box>
							<Box my={4} textAlign="left">
								<FormControl isInvalid={this.state.emailError}>
									<FormLabel>Email</FormLabel>
									<Input type='email' value={email} onChange={(e) => this.setEmail(e.target.value)} />
									{!this.state.emailError ? null : (
										<FormErrorMessage>{this.state.emailErrorMessage}</FormErrorMessage>
									)}
								</FormControl>
								<FormControl isInvalid={this.state.passwordError}>
									<FormLabel>Password</FormLabel>
									<InputGroup>
										<Input
											type={this.state.show ? 'text' : 'password'}
											value={password}
											placeholder="*************"
											size="lg"
											onChange={(e) => this.setPassword(e.target.value)}
										/>
										<InputRightElement>
											<IconButton h='2rem' size='sm' variant='ghost' onClick={this.setShow} icon={<ViewIcon />}>
												{show ? 'Hide' : 'Show'}
											</IconButton>
										</InputRightElement>
									</InputGroup>
									{!this.state.passwordError ? null : (
										<FormErrorMessage>{this.state.passwordErrorMessage}</FormErrorMessage>
									)}
								</FormControl>
								<Box textAlign="center">
									<Button mt={4} backgroundColor="#98A8F8" type='submit' onClick={this.validateParameters} isDisabled={this.state.emailError || this.state.passwordError}>
										Submit
									</Button>
								</Box>
								<Box marginTop="10px">
									<Text>
										Are you registered?
										<Button marginLeft="5px" colorScheme='#98A8F8' variant='link' >
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
