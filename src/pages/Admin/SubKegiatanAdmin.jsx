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
  Select,
  useToast,
  Badge,
  VStack,
  Divider,
  FormControl,
  FormLabel,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function SubKegiatanAdmin() {
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [kodeRekening, setKodeRekening] = useState("");
  const [subKegiatan, setSubKegiatan] = useState("");
  const [anggaran, setAnggaran] = useState(0);
  const [editForm, setEditForm] = useState({
    kodeRekening: "",
    subKegiatan: "",
    anggaran: "",
  });
  const toast = useToast();
  const user = useSelector(userRedux);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "kodeRekening") {
      setKodeRekening(val);
    } else if (field == "subKegiatan") {
      setSubKegiatan(val);
    } else if (field == "anggaran") {
      setAnggaran(parseInt(val));
    }
  };

  const tambahSubKegiatan = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/sub-kegiatan/post`,
        {
          kodeRekening,
          subKegiatan,
          anggaran,
          unitKerjaId: user[0]?.unitKerja_profile?.id,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataSubKegiatan();
        onTambahClose();
        toast({
          title: "Berhasil",
          description: "Berhasil Menambah subKegiatan",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err); // Tangani error
      });
  };
  async function fetchDataSubKegiatan() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/sub-kegiatan/get/${
          user[0]?.unitKerja_profile?.id
        }`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataSubKegiatan(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  useEffect(() => {
    fetchDataSubKegiatan();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      kodeRekening: item.kodeRekening,
      subKegiatan: item.subKegiatan,
      anggaran: item.anggaran,
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/sub-kegiatan/edit/${id}`,
        editForm
      );

      toast({
        title: "Berhasil",
        description: "Data berhasil diperbarui",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditingId(null);
      fetchDataSubKegiatan();
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
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
          {" "}
          <Button onClick={onTambahOpen} mb={"30px"} variant={"primary"}>
            Tambah +
          </Button>
          <Box>
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Kode Rekening</Th>
                  <Th>sub Kegiatan</Th>
                  <Th>Anggaran</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataSubKegiatan?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>{index + 1}</Td>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.kodeRekening}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              kodeRekening: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.kodeRekening
                      )}
                    </Td>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.subKegiatan}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              subKegiatan: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.subKegiatan
                      )}
                    </Td>
                    <Td>
                      {editingId === item.id ? (
                        <Input
                          value={editForm.anggaran}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              anggaran: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.anggaran
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
                          <Button colorScheme="red" onClick={handleCancel}>
                            Batal
                          </Button>
                        </HStack>
                      ) : (
                        <Button
                          variant={"primary"}
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
        <Modal
          closeOnOverlayClick={false}
          isOpen={isTambahOpen}
          onClose={onTambahClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="1200px">
            <ModalHeader></ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <HStack>
                <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
                <Heading color={"primary"}>Tambah Tujuan</Heading>
              </HStack>
              <Box p={"30px"}>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Nama Tujuan</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("kodeRekening", e.target.value)
                    }
                    placeholder="Contoh: 1.00.12"
                  />
                </FormControl>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Sub Kegiatan</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("subKegiatan", e.target.value)
                    }
                    placeholder="Contoh: xxx"
                  />
                </FormControl>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Anggaran</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    type="number"
                    onChange={(e) =>
                      handleSubmitChange("anggaran", e.target.value)
                    }
                    placeholder="RP. 3400000"
                  />
                </FormControl>
              </Box>
              <Button onClick={tambahSubKegiatan}>Tambah</Button>
            </ModalBody>

            <ModalFooter pe={"60px"} pb={"30px"}></ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export default SubKegiatanAdmin;
