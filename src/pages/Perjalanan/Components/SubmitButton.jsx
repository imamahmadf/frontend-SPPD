import React from "react";
import { Button, Container } from "@chakra-ui/react";

const SubmitButton = ({ actions, isLoading }) => {
  return (
    <Container maxW="1280px" variant="primary" p={0}>
      <Button
        variant="primary"
        onClick={actions?.submitPerjalanan}
        isLoading={isLoading}
        loadingText="Mengunduh..."
        width="100%"
        height="60px"
      >
        Submit
      </Button>
    </Container>
  );
};

export default SubmitButton;
