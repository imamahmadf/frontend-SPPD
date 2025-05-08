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
  useToast,
  Badge,
  VStack,
  Divider,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function NomorSuratAdmin() {
  const user = useSelector(userRedux);
  const [dataNomorSurat, setDataNomorSurat] = useState(null);
  async function fetchDataNomorSurat() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/nomor-surat/get/${
          user[0]?.unitKerja_profile?.indukUnitKerja.id
        }`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataNomorSurat(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  useEffect(() => {
    fetchDataNomorSurat();
  }, []);
  return (
    <Layout>
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
          my={"30px"}
        >
          {JSON.stringify(dataNomorSurat)}
          <Table>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>jenis nomor surat</Th>
                <Th>Nomor Surat</Th>
                <Th>Nomor Loket</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataNomorSurat?.map((item, index) => (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>{item.jenisSurat.jenis}</Td>
                  <Td>{item.jenisSurat.nomorSurat}</Td>
                  <Td>{item.nomorLoket}</Td>
                  <Td>
                    <Button>edit</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>
    </Layout>
  );
}

export default NomorSuratAdmin;
