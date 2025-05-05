import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
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
  Spacer,
} from "@chakra-ui/react";

function TambahBendahara() {
  return (
    <Layout>
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"2280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
          my={"30px"}
        ></Container>
      </Box>
    </Layout>
  );
}

export default TambahBendahara;
