import { extendTheme } from "@chakra-ui/react";
import { buttonStyles as Button } from "./Components/buttonStyles";
import { tableStyles as Table } from "./Components/tableStyles";
import { select2Styles as Select2 } from "./Components/select2Styles";
import { containerStyle as Container } from "./Components/containerStyle";
import { inputStyles as Input } from "./Components/inputStyles";

const breakpoints = {
  ss: "20em",
  sm: "30em",
  sl: "36em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};

export const myNewTheme = extendTheme({
  colors: {
    // primary: "rgba(29, 53, 87, 1)",
    primary: "rgba(55, 176, 134, 1)",
    primaryGelap: "rgba(19, 122, 106, 1)",
    oren: "rgba(235, 92, 24, 1)",
    ungu: "rgba(73, 79, 171, 1)",
    secondary: {
      light: "rgb(245 245 245)",
      dark: "black.900",
    },
    danger: "rgba(198, 46, 46, 1)",
    gelap: "rgba(38, 38, 38, 1)",
    terang: "rgba(243, 243, 243, 1)",
    background: "rgba(243, 243, 243, 1)",
    aset: "rgba(0, 125, 226, 1)",
    pegawai: "rgba(212, 39, 39, 1)",
    perencanaan: "rgba(235, 106, 63,1)",
  },

  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },

  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "background",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
      ".chakra-card": {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
      },
      ".chakra-input": {
        bg: props.colorMode === "dark" ? "gray.700" : "white",
      },
      ".chakra-select": {
        bg: props.colorMode === "dark" ? "gray.700" : "white",
      },
      ".chakra-textarea": {
        bg: props.colorMode === "dark" ? "gray.700" : "white",
      },
      ".chakra-modal__content": {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
      },
      ".chakra-menu__menu-list": {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
      },
      ".chakra-accordion__button": {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
        _hover: {
          bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
        },
      },
      ".chakra-accordion__panel": {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
      },
    }),
  },

  components: {
    Button,
    Table,
    Select2,
    Container,
    Input,
  },

  breakpoints: { ...breakpoints },
  //   fonts: {
  //     heading: `Work Sans`,
  //     body: `Work Sans`,
  //   },
});

// 1 secondary
// 2 ungu
//3 primary
//4 dengar
