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
import TambahUnitKerja from "../../Componets/TambahUnitKerja";

function DetailIndukUnitKerja(props) {
  const [data, setData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    unitKerja: "",
    kode: "",
    asal: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editIndukForm, setEditIndukForm] = useState({
    indukUnitKerja: "",
    kodeInduk: "",
  });
  const toast = useToast();
  const user = useSelector(userRedux);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchDataIndukUnitKerja() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/induk-unit-kerja/get/detail/${props.match.params.id}`
      );
      setData(res.data.result);
      console.log(res.data.result);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  }
  //   if (loading) {
  //     return (
  //       <Layout>
  //         <Loading />
  //       </Layout>
  //     );
  //   }
  if (error) {
    return (
      <Layout>
        <Center pt="80px" h="100vh">
          <Text color="red.500">{error}</Text>
        </Center>
      </Layout>
    );
  }
  useEffect(() => {
    fetchDataIndukUnitKerja();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      unitKerja: item.unitKerja,
      kode: item.kode,
      asal: item.asal,
    });
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/induk-unit-kerja/edit/unit-kerja/${id}`,
        editForm
      );

      // Update data lokal
      setData((prevData) => ({
        ...prevData,
        daftarUnitKerjas: prevData.daftarUnitKerjas.map((item) =>
          item.id === id ? { ...item, ...editForm } : item
        ),
      }));

      setEditingId(null);
      toast({
        title: "Berhasil",
        description: "Data berhasil diperbarui",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

  const handleEditInduk = () => {
    setEditIndukForm({
      indukUnitKerja: data?.indukUnitKerja,
      kodeInduk: data?.kodeInduk,
      asal: data?.daftarUnitKerjas[0]?.asal,
    });
    onOpen();
  };

  const handleSaveInduk = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/induk-unit-kerja/edit/${
          props.match.params.id
        }`,
        editIndukForm
      );

      setData((prevData) => ({
        ...prevData,
        ...editIndukForm,
      }));

      onClose();
      toast({
        title: "Berhasil",
        description: "Data induk unit kerja berhasil diperbarui",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data induk unit kerja",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
          <VStack align="start" spacing={2} mb={6} px={4}>
            <Flex justify="space-between" width="100%" align="center">
              <Heading size="lg">{data?.indukUnitKerja}</Heading>
              <Button colorScheme="blue" onClick={handleEditInduk}>
                Edit Induk Unit Kerja
              </Button>
            </Flex>
            <Badge colorScheme="blue" fontSize="md">
              Kode: {data?.kodeInduk}
            </Badge>
            <Text>Asal: {data?.daftarUnitKerjas[0]?.asal}</Text>
            <Flex gap={2} align="center">
              <Text>Sumber Dana: </Text>
              {data?.indukUKSumberDanas?.map((item, index) => (
                <Badge key={index}>{item.sumberDana.sumber}</Badge>
              ))}
            </Flex>
          </VStack>
          <TambahUnitKerja
            indukUnitKerjaId={user[0].unitKerja_profile.indukUnitKerja.id}
          />
          <Table variant={"primary"} mt={"30px"}>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Unit Kerja</Th>
                <Th>kode</Th>
                <Th>Asal</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.daftarUnitKerjas.map((item, index) => (
                <Tr key={item.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    {editingId === item.id ? (
                      <Input
                        value={editForm.unitKerja}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            unitKerja: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      item.unitKerja
                    )}
                  </Td>
                  <Td>
                    {editingId === item.id ? (
                      <Input
                        value={editForm.kode}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            kode: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      item.kode
                    )}
                  </Td>
                  <Td>
                    {editingId === item.id ? (
                      <Input
                        value={editForm.asal}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            asal: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      item.asal
                    )}
                  </Td>
                  <Td>
                    {editingId === item.id ? (
                      <HStack spacing={2}>
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() => handleSave(item.id)}
                        >
                          Simpan
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Batal
                        </Button>
                      </HStack>
                    ) : (
                      <Button onClick={() => handleEdit(item)}>Edit</Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Induk Unit Kerja</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Nama Induk Unit Kerja</FormLabel>
                    <Input
                      value={editIndukForm.indukUnitKerja}
                      onChange={(e) =>
                        setEditIndukForm((prev) => ({
                          ...prev,
                          indukUnitKerja: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Kode Induk</FormLabel>
                    <Input
                      value={editIndukForm.kodeInduk}
                      onChange={(e) =>
                        setEditIndukForm((prev) => ({
                          ...prev,
                          kodeInduk: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSaveInduk}>
                  Simpan
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Batal
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Box>
    </Layout>
  );
}

export default DetailIndukUnitKerja;
