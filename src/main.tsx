import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('App is starting...');
console.log('Rendering App');
console.log("Iniciando aplicación...");
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log("Aplicación montada");
