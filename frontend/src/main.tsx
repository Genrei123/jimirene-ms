import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './App'; // Import your main App component
import './App.css'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);
