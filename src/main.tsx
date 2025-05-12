
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set default burgundy theme
document.documentElement.style.setProperty('--primary', '91 25% 31%'); // #5b3746 em hsl
document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%'); // branco
document.documentElement.style.setProperty('--secondary', '91 15% 40%');
document.documentElement.style.setProperty('--secondary-foreground', '0 0% 100%');
document.documentElement.style.setProperty('--muted', '91 10% 95%');
document.documentElement.style.setProperty('--muted-foreground', '91 25% 30%');
document.documentElement.style.setProperty('--accent', '91 15% 90%');
document.documentElement.style.setProperty('--accent-foreground', '91 25% 31%');
document.documentElement.style.setProperty('--border', '91 15% 85%');
document.documentElement.style.setProperty('--input', '91 15% 85%');

// Aplicar tema bordô também para sidebar
document.documentElement.style.setProperty('--sidebar-primary', '91 25% 31%'); // #5b3746 em hsl
document.documentElement.style.setProperty('--sidebar-primary-foreground', '0 0% 100%'); // branco
document.documentElement.style.setProperty('--sidebar-accent', '91 15% 90%');
document.documentElement.style.setProperty('--sidebar-accent-foreground', '91 25% 31%');
document.documentElement.style.setProperty('--sidebar-border', '91 15% 80%');

createRoot(document.getElementById("root")!).render(<App />);
