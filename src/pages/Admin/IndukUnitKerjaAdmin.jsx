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
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import TambahUnitKerja from "../../Componets/TambahUnitKerja";
import { BsEyeFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
function IndukUnitKerjaAdmin() {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const toast = useToast();
  const history = useHistory();

  // Fungsi untuk mengubah nilai edit
  const handleEditChange = (id, value) => {
    setEditValues((prev) => ({ ...prev, [id]: value }));
  };

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/induk-unit-kerja/get/${
          user[0].unitKerja_profile.indukUnitKerja.id
        }`
      );
      setData(response.data.result);
      console.log(response.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      toast({
        title: "Gagal mengambil data",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menangani klik tombol hapus
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  // Fungsi untuk menangani klik tombol edit
  const handleEditClick = (itemId, type, unitKerjaId = null) => {
    const uniqueId = `${type}-${unitKerjaId || "induk"}-${itemId}`;
    setEditingId(editingId === uniqueId ? null : uniqueId);

    // Set nilai awal saat memulai edit
    if (editingId !== uniqueId) {
      const item = findItemById(itemId, type, unitKerjaId);
      if (item) {
        handleEditChange(uniqueId, item.jabatan);
      }
    }
  };

  // Fungsi untuk mencari item berdasarkan ID
  const findItemById = (itemId, type, unitKerjaId) => {
    if (type === "ttdSuratTugas") {
      return data?.indukUnitKerja_ttdSuratTugas?.find(
        (item) => item.id === itemId
      );
    } else {
      const unit = data?.daftarUnitKerjas?.find((u) => u.id === unitKerjaId);
      if (!unit) return null;

      const items =
        type === "notaDinas"
          ? unit.unitKerja_notaDinas
          : type === "PPTK"
          ? unit.PPTKs
          : unit.KPAs;

      return items?.find((item) => item.id === itemId);
    }
  };

  // Fungsi untuk konfirmasi hapus data
  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      let endpoint = "";
      let payload = {};

      // Tentukan endpoint berdasarkan jenis data
      if (selectedItem.type === "ttdSuratTugas") {
        endpoint = `induk-unit-kerja/delete/ttd-surat-tugas/${selectedItem.id}`;
        payload = { id: selectedItem.id };
      } else {
        endpoint = `induk-unit-kerja/delete/tanda-tangan`;
        payload = {
          id: selectedItem.id,
          type: selectedItem.type,
          unitKerjaId: selectedItem.unitKerjaId,
        };
      }

      // Kirim request delete ke API
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${endpoint}`,
        { data: payload }
      );

      // Refresh data setelah berhasil dihapus
      await fetchData();

      toast({
        title: "Data berhasil dihapus",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Gagal menghapus data:", err);
      toast({
        title: "Gagal menghapus data",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  // Fungsi untuk menyimpan perubahan data
  const handleSaveEdit = async (item, field, newValue) => {
    try {
      setIsLoading(true);
      let endpoint = "";
      let payload = {};

      // Tentukan endpoint berdasarkan jenis data
      if (item.type === "ttdSuratTugas") {
        endpoint = "induk-unit-kerja/update/ttd-surat-tugas";
        payload = {
          id: item.id,
          [field]: newValue,
        };
      } else {
        endpoint = "induk-unit-kerja/update/tanda-tangan";
        payload = {
          id: item.id,
          type: item.type,
          unitKerjaId: item.unitKerjaId,
          [field]: newValue,
        };
      }

      // Kirim request update ke API
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${endpoint}`,
        payload
      );

      // Refresh data setelah berhasil diupdate
      await fetchData();

      toast({
        title: "Data berhasil diupdate",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEditingId(null);
    } catch (err) {
      console.error("Gagal mengupdate data:", err);
      toast({
        title: "Gagal mengupdate data",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Komponen untuk cell yang bisa di-edit
  const EditableCell = ({ value, isEditing, onChange }) => {
    return isEditing ? (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="sm"
        autoFocus
      />
    ) : (
      <Text>{value}</Text>
    );
  };

  // Fungsi untuk render tabel
  const renderTable = (items, type, unitKerjaId) => {
    if (isLoading) return <Text>Memuat data...</Text>;
    if (!items || items.length === 0) return <Text>Tidak ada data</Text>;

    return (
      <Table variant={"primary"}>
        <Thead>
          <Tr>
            <Th width="50px">No</Th>
            <Th width="450px">Jabatan</Th>
            <Th>Nama Pegawai</Th>
            <Th width="150px">Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => {
            const uniqueId = `${type}-${unitKerjaId || "induk"}-${item.id}`;
            const isEditing = editingId === uniqueId;
            const currentValue = isEditing
              ? editValues[uniqueId] || item.jabatan
              : item.jabatan;

            const handleSave = () => {
              handleSaveEdit(
                { ...item, type, unitKerjaId },
                "jabatan",
                editValues[uniqueId]
              );
            };

            const handleCancel = () => {
              setEditingId(null);
            };

            return (
              <Tr key={item.id}>
                <Td>{index + 1}</Td>
                <Td>
                  <EditableCell
                    value={currentValue}
                    isEditing={isEditing}
                    onChange={(value) => handleEditChange(uniqueId, value)}
                  />
                </Td>
                <Td>
                  {type === "notaDinas"
                    ? item.pegawai_notaDinas.nama
                    : type === "PPTK"
                    ? item.pegawai_PPTK.nama
                    : item.pegawai_KPA.nama}
                </Td>
                <Td>
                  {isEditing ? (
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={handleSave}
                        isLoading={isLoading}
                      >
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={handleCancel}
                        isDisabled={isLoading}
                      >
                        Batal
                      </Button>
                    </HStack>
                  ) : (
                    <HStack spacing={2}>
                      <Button
                        p={"0px"}
                        fontSize={"14px"}
                        variant={"secondary"}
                        onClick={() =>
                          handleEditClick(item.id, type, unitKerjaId)
                        }
                        isDisabled={isLoading}
                      >
                        <BsPencilFill />
                      </Button>
                      <Button
                        p={"0px"}
                        fontSize={"14px"}
                        variant={"cancle"}
                        onClick={() =>
                          handleDeleteClick({ ...item, type, unitKerjaId })
                        }
                        isDisabled={isLoading}
                      >
                        X
                      </Button>
                    </HStack>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  };

  // Render komponen utama
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
          px={"20px"}
          my={"30px"}
        >
          {/* Modal Konfirmasi Hapus */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Konfirmasi Hapus</ModalHeader>
              <ModalCloseButton />
              {JSON.stringify(selectedItem?.type)}
              <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={confirmDelete}
                  isLoading={isLoading}
                >
                  Ya, Hapus
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  isDisabled={isLoading}
                >
                  Batal
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Header Induk Unit Kerja */}
          <VStack align="start" spacing={2} mb={6} px={4}>
            <Heading size="lg">{data?.indukUnitKerja}</Heading>
            <Badge colorScheme="blue" fontSize="md">
              Kode: {data?.kodeInduk}
            </Badge>
            <Text>Asal: {data?.daftarUnitKerjas[0]?.asal}</Text>
          </VStack>

          {/* Tabel Tanda Tangan Surat Tugas */}
          <Box>
            <Flex mb={"20px"}>
              <Heading size="md" mb={4}>
                Tanda Tangan Surat Tugas
              </Heading>
              <Spacer />
              <Button
                variant={"primary"}
                onClick={() => {
                  history.push("/admin/ttd-surat-tugas");
                }}
              >
                Tambah TTD Surat Tugas +
              </Button>
            </Flex>
            {isLoading ? (
              <Text>Memuat data...</Text>
            ) : (
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th width="50px">No</Th>
                    <Th>Nama</Th>
                    <Th width="550px">Jabatan</Th>
                    <Th width="150px">Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.indukUnitKerja_ttdSuratTugas?.map((item, index) => {
                    const uniqueId = `ttdSuratTugas-induk-${item.id}`;
                    const isEditing = editingId === uniqueId;
                    const currentValue = isEditing
                      ? editValues[uniqueId] || item.jabatan
                      : item.jabatan;

                    const handleSave = () => {
                      handleSaveEdit(
                        { ...item, type: "ttdSuratTugas" },
                        "jabatan",
                        editValues[uniqueId]
                      );
                    };

                    const handleCancel = () => {
                      setEditingId(null);
                    };

                    return (
                      <Tr key={item.id}>
                        <Td>{index + 1}</Td>
                        <Td>{item.pegawai.nama}</Td>
                        <Td>
                          <EditableCell
                            value={currentValue}
                            isEditing={isEditing}
                            onChange={(value) =>
                              handleEditChange(uniqueId, value)
                            }
                          />
                        </Td>
                        <Td>
                          {isEditing ? (
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={handleSave}
                                isLoading={isLoading}
                              >
                                Simpan
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={handleCancel}
                                isDisabled={isLoading}
                              >
                                Batal
                              </Button>
                            </HStack>
                          ) : (
                            <HStack spacing={2}>
                              <Button
                                p={"0px"}
                                fontSize={"14px"}
                                variant={"secondary"}
                                onClick={() =>
                                  handleEditClick(item.id, "ttdSuratTugas")
                                }
                                isDisabled={isLoading}
                              >
                                <BsPencilFill />
                              </Button>
                              <Button
                                p={"0px"}
                                fontSize={"14px"}
                                variant={"cancle"}
                                onClick={() =>
                                  handleDeleteClick({
                                    ...item,
                                    type: "ttdSuratTugas",
                                  })
                                }
                                isDisabled={isLoading}
                              >
                                X
                              </Button>
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Box>

          <Divider my={6} />

          {/* Daftar Unit Kerja */}
          <Flex mb={"20px"}>
            <Heading size="md" mb={4}>
              Daftar Unit Kerja
            </Heading>
            <Spacer />
            <TambahUnitKerja
              indukUnitKerjaId={user[0].unitKerja_profile.indukUnitKerja.id}
            />
          </Flex>
          {isLoading ? (
            <Text>Memuat data...</Text>
          ) : (
            <Stack>
              {data?.daftarUnitKerjas?.map((unitKerja) => (
                <Card key={unitKerja.id} variant="outline">
                  <CardHeader bg="primary" borderBottomWidth="1px">
                    <HStack>
                      <Box color="white">
                        <Heading size="sm">{unitKerja.unitKerja}</Heading>
                        <Text fontSize="sm">
                          Asal: {unitKerja.asal} | Kode: {unitKerja.kode}
                        </Text>
                      </Box>
                      <Spacer />
                      <Button
                        variant={"primary"}
                        width={"60px"}
                        onClick={() => {
                          history.push(`/admin/unit-kerja/${unitKerja.id}`);
                        }}
                      >
                        +
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    {/* Tabel Nota Dinas */}
                    <Box mb={6}>
                      <Heading size="sm" mb={3}>
                        Nota Dinas
                      </Heading>
                      {renderTable(
                        unitKerja.unitKerja_notaDinas,
                        "notaDinas",
                        unitKerja.id
                      )}
                    </Box>

                    {/* Tabel PPTK */}
                    <Box mb={6}>
                      <Heading size="sm" mb={3}>
                        PPTK
                      </Heading>
                      {renderTable(unitKerja.PPTKs, "PPTK", unitKerja.id)}
                    </Box>

                    {/* Tabel KPA */}
                    <Box mb={6}>
                      <Heading size="sm" mb={3}>
                        KPA
                      </Heading>
                      {renderTable(unitKerja.KPAs, "KPA", unitKerja.id)}
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    </Layout>
  );
}

export default IndukUnitKerjaAdmin;
