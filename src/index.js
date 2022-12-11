import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Container style={{marginTop:"5rem",backgroundImage:`url("bg.jpg")`}}>
            <App />
        </Container>
    </React.StrictMode>
);