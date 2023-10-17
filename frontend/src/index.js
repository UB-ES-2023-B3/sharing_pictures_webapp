import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from "react-dom/client"
import App from './components/App';
import App_NoAuth from './components/App_NoAuth';
import Home from "./components/Home";


//ReactDOM.render(<App />, document.getElementById('root'));
document.addEventListener('DOMContentLoaded', function () {
    const root = createRoot(document.getElementById('app'));
    root.render(<Home />);
  });


document.addEventListener('DOMContentLoaded', function () {
    const root = createRoot(document.getElementById('app-no-auth'));
    root.render(<App_NoAuth />);
  });
