import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Tasks } from "./pages/Tasks";
import { Groups } from "./pages/Groups";
import { Layout } from "./components/Layout";
import { PrivateRoute } from "./components/PrivateRoute";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/tasks" replace />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="groups" element={<Groups />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 