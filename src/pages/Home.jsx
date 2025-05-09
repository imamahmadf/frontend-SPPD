import React, { useState, useEffect } from "react";
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
import Layout from "../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import HomeFoto from "../assets/home.png";

function Home() {
  return (
    <Layout>
      <Box
        height="100vh"
        backgroundImage={`url(${HomeFoto})`}
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
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <Box>
          <Text
            color="white"
            textAlign="center"
            position="relative"
            fontWeight={800}
            fontSize={{ ss: "30px", sl: "60px" }}
            mb={"20px"}
          >
            SELAMAT DATANG DI PENA
          </Text>{" "}
        </Box>
      </Box>
    </Layout>
  );
}

export default Home;
