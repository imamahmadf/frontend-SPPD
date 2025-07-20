import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import { Link, useHistory } from "react-router-dom";
import Rill from "../Componets/Rill";
import { useDisclosure } from "@chakra-ui/react";
import Foto from "../assets/add_photo.png";

import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useFormik } from "formik";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  Heading,
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
  Select,
  Td,
  Flex,
  Textarea,
  Alert,
  Toast,
  Input,
  FormHelperText,
  Spacer,
  VStack,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";

function UsulanPegawai() {
  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        ></Container>
      </Box>
    </Layout>
  );
}

export default UsulanPegawai;
