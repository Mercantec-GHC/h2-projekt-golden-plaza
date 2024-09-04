import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import MailForm from "./pages/Mail/MailForm.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <App />
          <MailForm />
      </BrowserRouter>
  </StrictMode>,
)
