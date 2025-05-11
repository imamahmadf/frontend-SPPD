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
        bg: "primary",
        color: "white",
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
            bg: "gray.50",
          },
          td: {
            py: "12px",
            px: "16px",
            borderBottom: "1px solid",
            borderColor: "gray.200",
            fontSize: "14px",
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
        borderColor: "gray.200",
      },
      thead: {
        bg: "gray.100",
        th: {
          py: "12px",
          px: "16px",
          textAlign: "left",
          fontWeight: "600",
          fontSize: "14px",
          color: "gray.700",
        },
      },
      tbody: {
        tr: {
          _hover: {
            bg: "primaryTerang",
          },
          td: {
            py: "12px",
            px: "16px",
            borderBottom: "1px solid",
            borderColor: "gray.200",
            fontSize: "14px",
          },
        },
      },
    }),
  },
};
