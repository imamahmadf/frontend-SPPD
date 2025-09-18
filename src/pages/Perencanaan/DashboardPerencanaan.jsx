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
import PerencanaanBG from "../../assets/bgPerencanaan.jpg";
import { useSelector } from "react-redux";
import FooterPerencanaan from "../../Componets/perencanaan/FooterPerencanaan";
import NavbarPerencanaan from "../../Componets/perencanaan/NavbarPerencanaan";
import {
  userRedux,
  selectRole,
  selectIsAuthenticated,
} from "../../Redux/Reducers/auth";

function DashboardPerencanaan() {
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

      <NavbarPerencanaan />
      <Box
        height="100vh"
        backgroundImage={`url(${PerencanaanBG})`}
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

      <FooterPerencanaan />
    </>
  );
}

export default DashboardPerencanaan;
