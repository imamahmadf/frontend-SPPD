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
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  // console.log("Is Authenticated:", isAuthenticated);
  console.log("User Data:", user);

  return (
    <Box>
      <Container py={"30px"} maxW={"1280px"}>
        <HStack gap={5}>
          <Text>LOGO</Text> <Text>{user[0]?.nama}</Text>{" "}
          <Text>{role[0]?.id}</Text> <Spacer /> <Text>HOME</Text>{" "}
          <Text>DAFTAR</Text> <Text>PENGATURAN</Text>
          {isAuthenticated ? <Logout /> : <a href="/login">Login</a>}
        </HStack>
        {JSON.stringify(role)}
      </Container>
    </Box>
  );
}

export default Navbar;
