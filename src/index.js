import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './Styles/App.css';
import './i18n/i18n';
import './Styles/components.css';

createRoot(document.getElementById('root')).render(<App />);
