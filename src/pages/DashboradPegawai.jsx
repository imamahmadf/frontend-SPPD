import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Reducers/auth"; // Import action creator
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Box,
  Center,
  Text,
  Button,
  FormControl,
  FormLabel,
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
  useToast,
  Badge,
  VStack,
  Divider,
  Spacer,
  Image,
  useDisclosure,
  useColorMode,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";

import LayoutPegawai from "../Componets/Pegawai/LayoutPegawai";

export default function DashboradPegawai() {
  const history = useHistory();
  return (
    <LayoutPegawai>
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
          {/* {JSON.stringify(dataProfile)} */}EPGAWAI
          <Center>
            <Flex gap={5}>
              <Menu>
                <MenuButton as={Button}>Usulan Kenaikan Pangkat</MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      history.push("/pegawai/naik-golongan");
                    }}
                  >
                    kenaikan pangkat Berkala
                  </MenuItem>
                </MenuList>
              </Menu>

              <Button>Usulan Kenaikan Jenjang</Button>
            </Flex>
          </Center>
        </Container>
      </Box>
    </LayoutPegawai>
  );
}
