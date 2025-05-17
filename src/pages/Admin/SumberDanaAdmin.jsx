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
  FormControl,
  FormLabel,
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
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import Loading from "../../Componets/Loading";

function SumberDanaAdmin() {
  const [dataSumberDana, setDataSumberDana] = useState(null);
  const [dataJenisPerjalanan, setDataJenisPerjalanan] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    sumber: "",
    untukPembayaran: "",
    kalimat1: "",
    kalimat2: "",
  });
  const toast = useToast();

  async function fetchDataSumberDana() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/keuangan/get/all-sumber-dana`
      )
      .then((res) => {
        console.log(res.data);
        setDataSumberDana(res.data.result);
        setDataJenisPerjalanan(res.data.resultJenisPerjalanan);
      })
      .catch((err) => {
        console.error(err); // Tangani error
      });
  }

  useEffect(() => {
    fetchDataSumberDana();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      sumber: item.sumber,
      untukPembayaran: item.untukPembayaran,
      kalimat1: item.kalimat1,
      kalimat2: item.kalimat2,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/keuangan/edit/sumber-dana/${id}`,
        editForm
      );

      toast({
        title: "Berhasil",
        description: "Data sumber dana berhasil diperbarui",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditingId(null);
      fetchDataSumberDana();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data sumber dana",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <Layout>
      <Box pt={"140px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
          my={"30px"}
        >
          <Box>
            <Heading mb={"20px"}>Sumber Dana</Heading>
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>sumber</Th>
                  <Th>Untuk Pembayaran</Th>
                  <Th>Kalimat 1</Th>
                  <Th>Kalimat 2</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataSumberDana?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.sumber}
                          onChange={(e) =>
                            setEditForm({ ...editForm, sumber: e.target.value })
                          }
                        />
                      ) : (
                        item.sumber
                      )}
                    </Td>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.untukPembayaran}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              untukPembayaran: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.untukPembayaran
                      )}
                    </Td>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.kalimat1}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              kalimat1: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.kalimat1
                      )}
                    </Td>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.kalimat2}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              kalimat2: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.kalimat2
                      )}
                    </Td>
                    <Td>
                      {editingId === item.id ? (
                        <HStack>
                          <Button
                            colorScheme="green"
                            onClick={() => handleSave(item.id)}
                          >
                            Simpan
                          </Button>
                          <Button onClick={handleCancel}>Batal</Button>
                        </HStack>
                      ) : (
                        <Button onClick={() => handleEdit(item)}>Edit</Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
          my={"30px"}
        >
          <Heading mb={"20px"}>Jenis Perjalanan</Heading>
          <Table variant={"primary"}>
            <Thead>
              <Tr>
                <Th>Jenis</Th>
                <Th>Kode Rekening</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataJenisPerjalanan?.map((item, index) => (
                <Tr>
                  <Td>{item.jenis}</Td>
                  <Td>{item.kodeRekening}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>
    </Layout>
  );
}

export default SumberDanaAdmin;
