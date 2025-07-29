import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('App is starting...');
createRoot(document.getElementById('root')!).render(<App />);
