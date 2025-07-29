import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('App is starting...');
console.log('Rendering App');
createRoot(document.getElementById('root')!).render(<App />);
