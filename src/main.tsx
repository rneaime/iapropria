
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set default burgundy theme
document.documentElement.style.setProperty('--primary', '91 25% 31%'); // #5b3746 in hsl
document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');

createRoot(document.getElementById("root")!).render(<App />);
