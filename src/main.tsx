
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { InstanceProvider } from './contexts/InstanceContext';
import { CredentialsProvider } from './contexts/CredentialsContext';
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <CredentialsProvider>
            <InstanceProvider>
              <AdminProvider>
                <App />
                <Toaster />
              </AdminProvider>
            </InstanceProvider>
          </CredentialsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
