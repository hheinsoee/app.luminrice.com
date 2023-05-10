import React from 'react';
import logo from './logo.svg';
import './assets/App.css';
import SignInSide from './pages/signin';
import { APP_ROUTES } from './utils/constants';
import Office from './pages/office';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/*" element={<Office />} />
        <Route path={APP_ROUTES.SIGN_IN} element={<SignInSide/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
