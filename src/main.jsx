import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Redux/Reducers";
import { ChakraProvider } from "@chakra-ui/react";
import { myNewTheme } from "./Style/theme";
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider resetCSS theme={myNewTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ChakraProvider>
);
