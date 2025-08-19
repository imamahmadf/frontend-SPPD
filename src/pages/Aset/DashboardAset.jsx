import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  ModalCloseButton,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Textarea,
  Input,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import AsetBG from "../../assets/asetBG.png";
import { useSelector } from "react-redux";

import FooterAset from "../../Componets/Aset/FooterAset";

import NavbarAset from "../../Componets/Aset/NavbarAset";
import {
  userRedux,
  selectRole,
  selectIsAuthenticated,
} from "../../Redux/Reducers/auth";

import FotoDinkes from "../../assets/dinkes.jpg";

function DashboardAset() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  return (
    <>
      <Helmet>
        <title>Aplikasi Dinas Kesehatan Kabupaten Paser</title>
        <meta
          name="description"
          content="Pena Dinkes adalah aplikasi administrasi di Dinas Kesehatan Kabupaten paser"
        />
      </Helmet>

      <NavbarAset />
      <Box
        height="100vh"
        backgroundImage={`url(${AsetBG})`}
        backgroundSize="cover"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          // backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <Box>
          {/* {isAuthenticated ? null : (
            <>
              <Button variant={"primary"}>Login</Button>
            </>
          )} */}
        </Box>
      </Box>

      <FooterAset />
    </>
  );
}

export default DashboardAset;
