
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import App from './App.js';
import { ChakraProvider,useDisclosure } from '@chakra-ui/react'
import { useState, useMemo, useEffect, useCallback } from "react";
import { Text, Input, Button, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
} from '@chakra-ui/react'
import { ViewIcon,InfoOutlineIcon } from '@chakra-ui/icons'
import { Tooltip } from '@chakra-ui/react';
import {
	Flex,
	Box,
	Heading,
	IconButton
} from '@chakra-ui/react';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogCloseButton,
  } from '@chakra-ui/react'
import '../../static/css/styles.css';
import ErrorMessage from './ErrorMessage.js';

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			email: '',
			emailError: false,
			password: '',
			password2: '',
			passwordError: false,
			password2Error: false,
			name : '',
			lastName: '',
			nameError: false,
			userName: '',
			userError: false,
			errorMessages: '',
			isSubmitting: false,
			emailErrorMessage: '',
			passwordErrorMessage: '',
			password2ErrorMessage: '',
			nameErrorMessage:'',
			userErrorMessage:'',
			onOpenAlert:false,
			onCloseAlert:false,
			alertText:'',
			successfulSubmit:false
		};
		this.noErrors = true; //Controls errors in params format
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
	setName = (value) =>{
		this.setState({
			name: value,
		});
	}
	setLastName = (value) =>{
		this.setState({
			lastName: value,
		});
	}
	setNameErrorMessage = (value) => {
		this.setState({
			nameErrorMessage: value,
		});
	};
	setNameError = (value) => {
		this.setState({nameError:value})
	};

	setUserName = (value) =>{
		this.setState({
			userName: value,
		});
	}
	setUserNameErrorMessage = (value) => {
		this.setState({
			userErrorMessage: value,
		});
	};
	setUserNameError = (value) => {
		this.setState({userError:value})
	};

	setShow = () => {
		this.setState({
			show: !this.state.show,
		});
	};
	setSuccessfulSubmit = (value)=>{
		this.setState({
			successfulSubmit: value 
		})
	}

	setEmailErrorMessage = (value) => {
		this.setState({
			emailErrorMessage: value,
		});
	};
	setEmailError = (value) => {
		this.setState({emailError:value})
		
	
	};
	setPasswordErrorMessages = (value) => {
		this.setState({
			passwordErrorMessage: value,
		});
	};
	setPassword2ErrorMessages = (value) => {
		this.setState({
			password2ErrorMessage: value,
		});
	}
	setPasswordError = (value) => {

		this.setState({passwordError:value})
	};
	setPassword2Error = (value) => {
		this.setState({password2Error:value})
	};
	setPassword = (value) => {
		this.setState({
			password: value,
		});
	};
	setPassword2 = (value) => {
		this.setState({
			password2: value,
		});}
	performSubmit=()=>{
		
		if(!this.noErrors){
		this.noErrors = true;
		return false;}
	else{ 
		

		//  Backend send
		this.handleSubmit();

		return true; 
	}
		
	}
	handleSubmit =() => {
		// Tu lógica de envío del formulario aquí
		const formData = new FormData();
		formData.append('email', this.state.email);
		formData.append('password', this.state.password);
		formData.append('name', this.state.name);
		axios.post('/api/register', formData) .then((response) => {
			console.log(response);
		  })
		  .catch((error) => {
			if (error.response) {
			  showErrorResponse(error.response);
			}
		  });
		return true;

		
	};

	navigateToLogin = () => {
		// Tu lógica para ir a la página de registro aquí
	};

	// Validaciones
	validateName = () =>{
		const {name} = this.state;
			if(name === ''){
				
				this.setNameErrorMessage('Name is required');
				this.setNameError(true);
				this.noErrors = false;
			}
		else{
			this.setNameErrorMessage('');
			this.setNameError(false);
		}};
		validateUserName = () =>{
			const {userName} = this.state;
				if(userName === ''){
					
					this.setUserNameErrorMessage('User name is required');
					this.setUserNameError(true);
					this.noErrors = false;
				}
			else{
				this.setUserNameErrorMessage('');
				this.setUserNameError(false);
			}};
			validateEmail = () => {
				const { email } = this.state;
				const mailformat = /^(([^<>()\[\]\.,;:\s@"]+(.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

				if (email === '') {
					this.setEmailErrorMessage('Email is required');
					this.setEmailError(true);
					this.noErrors = false;
				} else if (email.match(mailformat) === null) {
					this.setEmailErrorMessage('Invalid email format');
					this.setEmailError(true);
					this.noErrors = false;
				} else {
					this.setEmailErrorMessage('');
					this.setEmailError(false);
				}
			};
			

	validatePassword = () => {
		const { password } = this.state;
		
		if (password.length < 1) {
			this.setPasswordErrorMessages('Password empty');
			this.setPasswordError(true);
			this.noErrors = false;
		}else{ 
			 // Password validation conditions
		 const hasMinimumLength = password.length >= 8;
		 const hasUppercase = /[A-Z]/.test(password);
		 const hasSpecialCharacter =
		   /[!@#$%^&*(),.?":{}|<>]/.test(password);

		 // Update password error state based on validation conditions
		 const hasError =
       !hasMinimumLength || !hasUppercase || !hasSpecialCharacter;
			
			
			if (hasError){
        this.setPasswordErrorMessages("Password doesn't meet requirements");
		this.noErrors = false;
        this.setPasswordError(true);
      }
		else {
			this.setPasswordErrorMessages(''); 
			this.setPasswordError(false);
		}}
	};
	validatePassword2 = () => {
		const { password, password2 } = this.state;
		if (password !== password2) {
			this.setPassword2ErrorMessages('Passwords do not match');
			this.setPassword2Error(true);
			this.noErrors = false;
		} else {
			this.setPassword2ErrorMessages(''); 
			this.setPassword2Error(false);
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
		this.validateName();
		this.validateUserName();
		this.validatePassword2();
		if(this.performSubmit()){
			this.state.alertText='Registration Successful';
			this.setSuccessfulSubmit(true);

		}else{
			this.state.alertText = 'Registration Failed';
			this.setSuccessfulSubmit(false);
		}
		this.state.onOpenAlert = true;
	};


	render() {
		const {
      show,
      email,
      emailError,
      password,
	  password2,
      passwordError,
	  password2Error,
      name,
	  lastName,
      nameError,
      userName,
      userError,
      errorMessages,
      nameErrorMessage,
      userErrorMessage,
      isSubmitting,
      isLoggedIn,
	  onOpenAlert,
	  onCloseAlert,
	  alertText,
	  successfulSubmit,
    } = this.state;
		return (
      <ChakraProvider>
        {/* POST SUBMIT DIALOG */}
        <AlertDialog
          motionPreset="slideInBottom"
          isOpen={this.state.onOpenAlert}
          onClose={() => this.setState({ onOpenAlert: false })} // Use setState to close the dialog
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="50px"
              color={successfulSubmit ? "green" : "red"}
              textAlign="center"
            >
              {this.state.alertText}
            </AlertDialogHeader>
            <Button
              colorScheme="#98A8F8"
              variant="link"
              onClick={() => {
                this.setState({ onOpenAlert: false });
              }}
            >
              Close
            </Button>
            <AlertDialogFooter />
          </AlertDialogContent>
        </AlertDialog>

        {/* MAIN FORM */}
        <div className="register-form">
          <Flex
            width="full"
            align="center"
            justifyContent="center"
            padding={"20px"}
          >
            <Box
				
              p={8}
              maxWidth="500px"
              borderWidth={1}
              borderRadius={8}
              boxShadow="1g"
            >
              <Box textAlign="center">
                <Heading>Register</Heading>
              </Box>
              <Box my={4} textAlign="left">
                <FormControl className="form" isInvalid={this.state.nameError}>
                  <FormLabel>First name</FormLabel>
                  <Input
                    type="name"
                    placeholder="John"
                    value={name}
                    onChange={(e) => this.setName(e.target.value)}
                    onClick={() => this.setNameError(false)}
					onBeforeInput={() => this.setNameError(false)}
                  />
                  <FormErrorMessage>
                    {!this.state.nameError ? " " : this.state.nameErrorMessage}
                  </FormErrorMessage>
                </FormControl>
				<FormControl className="form" >
                  <FormLabel>Last name</FormLabel>
                  <Input
                    type="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => this.setLastName(e.target.value)}

                  />
                  <FormErrorMessage>
                    {!this.state.nameError ? " " : this.state.nameErrorMessage}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={this.state.emailError} className="form">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => this.setEmail(e.target.value)}
                    onClick={() => this.setEmailError(false)}
					
                    placeholder="johndoe@example.com"
                  />

                  <FormErrorMessage>
                    {!this.state.emailError
                      ? " "
                      : this.state.emailErrorMessage}
                  </FormErrorMessage>
                </FormControl>
                <FormControl className="form" isInvalid={this.state.userError}>
                  <FormLabel>User name</FormLabel>
                  <Input
                    type="user_name"
                    placeholder="john_doe"
                    value={userName}
                    onChange={(e) => this.setUserName(e.target.value)}
                    onClick={() => this.setUserNameError(false)}
					onBlur={() => this.setUserNameError(false)}
                  />
                  <FormErrorMessage>
                    {!this.state.userError ? " " : this.state.userErrorMessage}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={this.state.passwordError}
                  className="form"
                >
                  <FormLabel>Password</FormLabel>

                  <Tooltip
                    label="Must have at leat 8 characters, an uppercase and a special character"
                    fontSize="9px"
                  >
                    <InputGroup>
                      <Input
                        type={this.state.show ? "text" : "password"}
                        value={password}
                        placeholder="*************"
                        size="lg"
                        onClick={() => this.setPasswordError(false)}
                        onChange={(e) => {
                          this.setPassword(e.target.value);
                        }}
						onBlur={() => this.setPasswordError(false)}
                      />
                    </InputGroup>
                  </Tooltip>
                  {!this.state.passwordError ? null : (
                    <FormErrorMessage>
                      {this.state.passwordErrorMessage}
                    </FormErrorMessage>
                  )}
                </FormControl>
				<FormControl
                  isInvalid={this.state.passwordError&&this.state.password2Error}
                  className="form"
                >
                  <FormLabel>Repeat password</FormLabel>

                    <InputGroup>
                      <Input
                        type={this.state.show ? "text" : "password"}
                        value={password2}
                        placeholder="*************"
                        size="lg"
                        onClick={() => this.setPassword2Error(false)}
                        onChange={(e) => {
                          this.setPassword2(e.target.value);
                        }}
						onBlur={() => this.setPassword2Error(false)}
                      />
                    </InputGroup>
                  
                  {!this.state.password2Error ? null : (
                    <FormErrorMessage>
                      {this.state.password2ErrorMessage}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Box textAlign="center">
                  <Button
                    mt={4}
                    backgroundColor="#98A8F8"
                    type="submit"
                    onClick={() => {
                      this.validateParameters();
                    }}
                  >
                    Submit
                  </Button>
                </Box>

                <Box marginTop="10px">
                  <Text>
                    You already have an account?
                    <Button
                      marginLeft="5px"
                      colorScheme="#98A8F8"
                      variant="link"
                    >
                      Log in
                    </Button>
                  </Text>
                </Box>
              </Box>
            </Box>
          </Flex>
        </div>
      </ChakraProvider>
    );
	}
}
const appDiv = document.getElementById("register");
render(<Register />, appDiv);