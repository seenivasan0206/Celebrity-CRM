import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './styles/index.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/auth.css';
import './styles/modules.css';
import './styles/modals.css';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
