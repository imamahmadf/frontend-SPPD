import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Daftar from "./pages/Daftar";
import Kwitansi from "./pages/Kwitansi";
import Rill from "./pages/Rill";
function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route component={Daftar} path="/daftar" />
          <Route component={Kwitansi} path="/kwitansi/:id" />
          <Route component={Rill} path="/rill/:kwitId" />
          <Route component={Home} path="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
