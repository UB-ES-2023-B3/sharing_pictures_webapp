import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from "react-dom/client"
import App from './components/App';
import App_NoAuth from './components/App_NoAuth';



document.addEventListener('DOMContentLoaded', function () {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
  });


document.addEventListener('DOMContentLoaded', function () {
    const root = createRoot(document.getElementById('app-no-auth'));
    root.render(<App_NoAuth />);
  });