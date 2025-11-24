import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const clientId =
  '1033076679945-rsv1k0qucoosvolkog576purksfr5s03.apps.googleusercontent.com';
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
