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
  Heading,
  SimpleGrid,
  Checkbox,
  useToast,
} from "@chakra-ui/react";

function DataKosong(props) {
  return (
    <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
      <Container
        border={"1px"}
        borderRadius={"6px"}
        borderColor={"rgba(229, 231, 235, 1)"}
        maxW={"1280px"}
        bgColor={"white"}
        pt={"30px"}
        ps={"0px"}
      >
        <Center minH={"80vh"}>
          <Heading></Heading>
          <Button></Button>
        </Center>
      </Container>
    </Box>
  );
}

export default DataKosong;
