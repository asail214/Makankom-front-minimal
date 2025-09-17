import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Router from 'src/routes/router';

import App from 'src/app';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Router />
      </App>
    </BrowserRouter>
  </React.StrictMode>
);
