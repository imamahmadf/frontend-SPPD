export const select2Styles = {
  baseStyle: {
    chakraStyles: {
      container: (provided) => ({
        ...provided,
        borderRadius: "6px",
      }),
      control: (provided) => ({
        ...provided,
        backgroundColor: "terang",
        border: "0px",
        height: "60px",
        _hover: {
          borderColor: "yellow.700",
        },
        minHeight: "40px",
      }),
      option: (provided, state) => ({
        ...provided,
        bg: state.isFocused ? "primary" : "white",
        color: state.isFocused ? "white" : "black",
      }),
    },
    components: {
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
    },
  },
  variants: {
    primary: {
      chakraStyles: {
        container: (provided) => ({
          ...provided,
          borderRadius: "6px",
        }),
        control: (provided) => ({
          ...provided,
          backgroundColor: "terang",
          border: "0px",
          height: "60px",
          _hover: {
            borderColor: "yellow.700",
          },
          minHeight: "40px",
        }),
        option: (provided, state) => ({
          ...provided,
          bg: state.isFocused ? "primary" : "white",
          color: state.isFocused ? "white" : "black",
        }),
      },
      components: {
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};
