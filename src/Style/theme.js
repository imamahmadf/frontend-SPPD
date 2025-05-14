import { extendTheme } from "@chakra-ui/react";
import { buttonStyles as Button } from "./Components/buttonStyles";
import { tableStyles as Table } from "./Components/tableStyles";

// import "@fontsource/work-sans";

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
    secondary: "rgba(244, 244, 237, 1)",
    danger: "rgba(198, 46, 46, 1)",
    gelap: "rgba(38, 38, 38, 1)",
    terang: "rgba(243, 243, 243, 1)",
    background: "rgba(243, 243, 243, 1)",
  },
  components: {
    Button,
    Table,
  },

  breakpoints: { ...breakpoints },
  //   fonts: {
  //     heading: `Work Sans`,
  //     body: `Work Sans`,
  //   },
});
