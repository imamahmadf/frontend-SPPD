import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";

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

function Kwitansi(props) {
  const history = useHistory();
  return (
    <>
      <Layout>
        <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"} pb={"40px"}>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            p={"30px"}
          >
            {props.match.params.id}
            <Button
              onClick={() => {
                history.push(history.push(`/rill/${props.match.params.id}`));
              }}
            >
              Rill
            </Button>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default Kwitansi;
