
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set default burgundy theme
document.documentElement.style.setProperty('--primary', '91 25% 31%'); // #5b3746 em hsl
document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%'); // branco

// Aplicar tema bordô também para sidebar
document.documentElement.style.setProperty('--sidebar-primary', '91 25% 31%'); // #5b3746 em hsl
document.documentElement.style.setProperty('--sidebar-primary-foreground', '0 0% 100%'); // branco

createRoot(document.getElementById("root")!).render(<App />);
