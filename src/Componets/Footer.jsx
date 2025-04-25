import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
  Table,
  Spacer,
} from "@chakra-ui/react";

function Footer() {
  return (
    <>
      <Box
        borderTop={"1px"}
        borderColor={"white"}
        py={"20px"}
        bgColor={"primary"}
        color={"white"}
      >
        {" "}
        <Container py={"30px"} maxW={"1280px"}>
          <Text>FOOTER</Text>
        </Container>
      </Box>
      <Box py={"20px"} bgColor={"gelap"} color={"white"}>
        <Container>
          <Center>
            Copyright © 2025 Imam Ahmad Fahrurazi. All Right Reserved
          </Center>
        </Container>
      </Box>
    </>
  );
}

export default Footer;
