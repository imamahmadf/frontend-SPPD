export const tableStyles = {
  variants: {
    primary: (props) => ({
      table: {
        width: "100%",
        borderCollapse: "collapse",
        borderRadius: "5px",
        overflow: "hidden",
      },
      thead: {
        bg: props.colorMode === "dark" ? "primary" : "primary",
        color: props.colorMode === "dark" ? "white" : "white",
        th: {
          py: "12px",
          px: "16px",
          textAlign: "left",
          fontWeight: "600",
          fontSize: "14px",
        },
      },
      tbody: {
        tr: {
          _hover: {
            bg: props.colorMode === "dark" ? "gray.700" : "gray.50",
          },
          td: {
            py: "12px",
            px: "16px",
            borderBottom: "1px solid",
            borderColor: props.colorMode === "dark" ? "black" : "gray.200",
            fontSize: "14px",
            color: props.colorMode === "dark" ? "white" : "inherit",
            bg: props.colorMode === "dark" ? "gray.800" : "white",
          },
        },
      },
    }),
    secondary: (props) => ({
      table: {
        width: "100%",
        borderCollapse: "collapse",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid",
        borderColor: props.colorMode === "dark" ? "gray.700" : "gray.200",
      },
      thead: {
        bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
        th: {
          py: "12px",
          px: "16px",
          textAlign: "left",
          fontWeight: "600",
          fontSize: "14px",
          color: props.colorMode === "dark" ? "white" : "gray.700",
        },
      },
      tbody: {
        tr: {
          _hover: {
            bg: props.colorMode === "dark" ? "gray.700" : "primaryTerang",
          },
          td: {
            py: "12px",
            px: "16px",
            borderBottom: "1px solid",
            borderColor: props.colorMode === "dark" ? "gray.700" : "gray.200",
            fontSize: "14px",
            color: props.colorMode === "dark" ? "white" : "inherit",
          },
        },
      },
    }),
  },
};
