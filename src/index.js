import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { UserProvider } from './contexts/UserContext';

ReactDOM.render(
    <BrowserRouter>
        <RecoilRoot>
            <UserProvider>
                <App />
            </UserProvider>
        </RecoilRoot>
    </BrowserRouter>,
    document.getElementById('root')
);
