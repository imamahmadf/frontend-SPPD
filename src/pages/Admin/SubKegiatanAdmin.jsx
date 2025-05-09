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
  ModalCloseButton,
  Container,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  useToast,
  Badge,
  VStack,
  Divider,
  FormControl,
  FormLabel,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function SubKegiatanAdmin() {
  return (
    <Layout>
      <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"} pb={"40px"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        ></Container>
      </Box>
    </Layout>
  );
}

export default SubKegiatanAdmin;
