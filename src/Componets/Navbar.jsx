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
import Logout from "./Logout";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../Redux/Reducers/auth";

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");

  console.log("Is Authenticated:", isAuthenticated);
  return (
    <Box>
      <Container py={"30px"} maxW={"1280px"}>
        <HStack gap={5}>
          <Text>LOGO</Text> <Spacer /> <Text>HOME</Text> <Text>DAFTAR</Text>{" "}
          <Text>PENGATURAN</Text>
          {isAuthenticated ? <Logout /> : <a href="/login">Login</a>}
        </HStack>
      </Container>
    </Box>
  );
}

export default Navbar;
