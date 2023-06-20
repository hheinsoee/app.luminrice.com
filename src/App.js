import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './assets/index.css';
import SignInSide from './pages/signin';
import { APP_ROUTES } from './utils/constants';
import Office from './pages/office';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

function App() {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode'))
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode])
  var palette = useMemo(() => {
    if (themeMode == 'dark') {
      return {
        mode: "dark",
        primary: {
          main: "#00cfd5",
          alpha: "#254a4c77"
        },
        secondary: {
          main: "#1e3536"
        },
        background: {
          default: "#143637",
          paper: "#143637"
        },
        text: {
          primary: "#ffffff"
        }
      }
    } else {
      return {}
    }
  }, [themeMode]);

  const theme = createTheme({
    palette: palette,
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route exact path="/*" element={<Office themeMode={themeMode} setThemeMode={setThemeMode} />} />
          <Route path={APP_ROUTES.SIGN_IN} element={<SignInSide />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
