import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'; // Import the App component
import App_NoAuth from './components/App_NoAuth'; // Import the App_NoAuth component
import { createRoot } from 'react-dom/client';

/*
const rootElement = document.getElementById('root');

console.log('isAuthenticated: ', isAuthenticated);
const RootComponent = isAuthenticated ? <App /> : <App_NoAuth />;

ReactDOM.render(RootComponent, rootElement);*/
//const isAuthenticated = false;

const rootElement = document.getElementById('root');
console.log('rootElement: ', rootElement);
const isAuthenticated = rootElement.getAttribute('auth') === 'true';
console.log('isAuthenticated: ', isAuthenticated);
const root = createRoot(rootElement);
const RootComponent = isAuthenticated ? <App /> : <App_NoAuth />;
root.render(RootComponent);
//root.render( <App />);