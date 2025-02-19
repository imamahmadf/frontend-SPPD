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
  Spacer,
} from "@chakra-ui/react";

function Navbar() {
  return (
    <Box>
      <Container py={"30px"} maxW={"1280px"}>
        <HStack gap={5}>
          <Text>LOGO</Text> <Spacer /> <Text>HOME</Text> <Text>DAFTAR</Text>{" "}
          <Text>PENGATURAN</Text>
        </HStack>
      </Container>
    </Box>
  );
}

export default Navbar;
