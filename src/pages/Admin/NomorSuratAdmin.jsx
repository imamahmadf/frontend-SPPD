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
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    nomorLoket: "",
  });
  const toast = useToast();

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

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      nomorLoket: item.nomorLoket,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/nomor-surat/edit/${id}`,
        editData
      );
      toast({
        title: "Berhasil",
        description: "Data berhasil diperbarui",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEditingId(null);
      fetchDataNomorSurat();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data",
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
      <Box pt={"40px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
          my={"30px"}
        >
          <Table>
            <Thead bgColor={"primary"} border={"1px"}>
              <Tr>
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  p={"10px"}
                  border={"1px"}
                >
                  No
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  p={"10px"}
                  border={"1px"}
                >
                  jenis nomor surat
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  p={"10px"}
                  border={"1px"}
                >
                  Nomor Surat
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  p={"10px"}
                  border={"1px"}
                >
                  Nomor Loket
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  p={"10px"}
                  border={"1px"}
                >
                  Aksi
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataNomorSurat?.map((item, index) => (
                <Tr key={item.id}>
                  <Td borderWidth="1px" borderColor="primary">
                    {index + 1}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary">
                    {item.jenisSurat.jenis}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary">
                    {item.jenisSurat.nomorSurat}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary">
                    {editingId === item.id ? (
                      <Input
                        value={editData.nomorLoket}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nomorLoket: e.target.value,
                          })
                        }
                      />
                    ) : (
                      item.nomorLoket
                    )}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary">
                    {editingId === item.id ? (
                      <HStack spacing={2}>
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
        </Container>
      </Box>
    </Layout>
  );
}

export default NomorSuratAdmin;
