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

function DaftarBendaharaAdmin() {
  const [dataBendahara, setDataBendahara] = useState(null);

  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  async function fetchDataBendahara() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/keuangan/get/bendahara/${
          user[0]?.unitKerja_profile?.indukUnitKerja.id
        }`
      )

      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataBendahara(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  useEffect(() => {
    fetchDataBendahara();
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
          <Button>Tambah +</Button>
          <Table>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Sumber Dana</Th>
                <Th>Jabatan</Th>
                <Th>Nama</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataBendahara &&
                dataBendahara.map((item, index) =>
                  item.bendaharas.map((b, idx) => (
                    <Tr key={`${index}-${idx}`}>
                      <Td>{index + 1}</Td>
                      <Td>{item.sumber}</Td>
                      <Td>{b.jabatan}</Td>
                      <Td>{b.pegawai_bendahara?.nama || "-"}</Td>
                      <Td>
                        <Button>Hapus</Button>
                        <Button>Edit</Button>
                      </Td>
                    </Tr>
                  ))
                )}
            </Tbody>
          </Table>
        </Container>
      </Box>
    </Layout>
  );
}

export default DaftarBendaharaAdmin;
