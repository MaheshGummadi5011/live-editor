// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as monaco from 'monaco-editor';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // StrictMode has been removed to prevent the double-mount issue in development
    <BrowserRouter>
      <App />
    </BrowserRouter>
);

// Remove custom Monaco worker loader code to fix network errors and use default worker handling