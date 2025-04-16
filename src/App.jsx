import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Daftar from "./pages/Daftar";
import Detail from "./pages/Detail";
import Rill from "./pages/Rill";
import Login from "./pages/login";
import Register from "./pages/Register.jsx";
import Rampung from "./pages/Rampung";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess, logout } from "./Redux/Reducers/auth.js";
import ProtectedRoute from "./Componets/ProtectedRoute";
import Template from "./pages/Template.jsx";
import RampungAdmin from "./pages/Admin/RampungAdmin.jsx";
import Perjalanan from "./pages/Perjalanan.jsx";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("cek gak token");
          dispatch(logout());
          return;
        }
        console.log("cek ada token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/check-auth`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(data);
        if (data.isAuthenticated) {
          dispatch(
            loginSuccess({
              token: token,
              role: data.user?.role, // Pastikan role disimpan
            })
          );
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Switch>
          <ProtectedRoute component={Daftar} path="/daftar" />
          <Route component={Rampung} path="/rampung/:id" />
          <Route component={Detail} path="/detail-perjalanan/:id" />
          <Route component={Rill} path="/rill/:kwitId" />
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <Route component={Template} path="/template" />
          <Route component={RampungAdmin} path="/admin/rampung/:id" />
          <Route component={Perjalanan} path="/perjalanan" />
          <Route component={Home} path="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
