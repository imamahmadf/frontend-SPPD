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
  Flex,
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
  const [dataTipe, setDataTipe] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [kodeRekening, setKodeRekening] = useState("");
  const [subKegiatan, setSubKegiatan] = useState("");
  const [subKegiatanId, setSubKegiatanId] = useState(0);
  const [anggaran, setAnggaran] = useState(0);
  const [tahun, setTahun] = useState("");
  const [tipePerjalananId, setTipePerjalananId] = useState(0);
  const [filterTahun, setFilterTahun] = useState("2025");
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

  const {
    isOpen: isAnggaranOpen,
    onOpen: onAnggaranOpen,
    onClose: onAnggaranClose,
  } = useDisclosure();

  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "kodeRekening") {
      setKodeRekening(val);
    } else if (field == "subKegiatan") {
      setSubKegiatan(val);
    } else if (field == "anggaran") {
      setAnggaran(parseInt(val));
    } else if (field == "tahun") {
      setTahun(val);
    }
  };

  const tambahSubKegiatan = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/sub-kegiatan/post`,
        {
          kodeRekening,
          subKegiatan,

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

  const tambahAnggaran = () => {
    console.log(anggaran, tahun, tipePerjalananId, subKegiatanId);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/sub-kegiatan/post/anggaran`,
        {
          nilai: anggaran,
          tahun,
          tipePerjalananId,
          subKegiatanId,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataSubKegiatan();
        onAnggaranClose();
        toast({
          title: "Berhasil",
          description: "Berhasil Menambah Anggaran",
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
        }?&filterTahun=${filterTahun}`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataSubKegiatan(res.data.result);
        setDataTipe(res.data.resultTipe);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  useEffect(() => {
    fetchDataSubKegiatan();
  }, [filterTahun]);

  const handleEdit = (item) => {
    if (editingId !== null) {
      toast({
        title: "Peringatan",
        description: "Selesaikan edit yang sedang berlangsung terlebih dahulu",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      <Box bgColor={"secondary"} px={"30px"}>
        <Container variant={"primary"} maxW={"2880px"} p={"30px"}>
          {" "}
          <Button onClick={onTambahOpen} mb={"30px"} variant={"primary"}>
            Tambah +
          </Button>{" "}
          <FormControl>
            <FormLabel>Jenis Template</FormLabel>
            <Select
              mt="10px"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                setFilterTahun(e.target.value);
              }}
            >
              <option value="2025">2025 </option>
              <option value="2026">2026</option>
              <option value="2027">2027 </option>
            </Select>
          </FormControl>
          <Box>
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Kode Rekening</Th>
                  <Th>Sub Kegiatan</Th>
                  <Th>Anggaran</Th>
                  <Th>Realisasi</Th>
                  <Th>Presentase</Th>
                  <Th>Sisa Anggaran</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataSubKegiatan?.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {/* Baris Sub Kegiatan */}
                    <Tr>
                      <Td rowSpan={item.anggaranByTipe?.length + 1}>
                        {index + 1}
                      </Td>

                      <Td rowSpan={item.anggaranByTipe?.length + 1}>
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

                      <Td colspan={4}></Td>

                      <Td rowSpan={item.anggaranByTipe?.length + 1}>
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
                          <Flex>
                            <Button
                              variant={"primary"}
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={"primary"}
                              onClick={() => {
                                onAnggaranOpen();
                                setSubKegiatanId(item.id);
                              }}
                            >
                              Anggaran
                            </Button>
                          </Flex>
                        )}
                      </Td>
                    </Tr>

                    {/* Baris Tipe Perjalanan */}
                    {item.anggaranByTipe.map((tipe, tipeIndex) => {
                      const sisa = tipe.anggaran - tipe.totalRealisasi;
                      const persen = tipe.anggaran
                        ? ((tipe.totalRealisasi / tipe.anggaran) * 100).toFixed(
                            2
                          )
                        : "-";

                      return (
                        <Tr key={tipeIndex}>
                          <Td>
                            {tipe.tipePerjalananId === 1
                              ? "- Dalam Daerah"
                              : "- Luar Daerah"}
                          </Td>
                          <Td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(tipe.anggaran)}
                          </Td>
                          <Td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(tipe.totalRealisasi)}
                          </Td>
                          <Td>{persen}%</Td>
                          <Td
                            bgColor={sisa < 0 ? "red.500" : undefined}
                            color={sisa < 0 ? "white" : "black"}
                          >
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(sisa)}
                          </Td>
                        </Tr>
                      );
                    })}
                  </React.Fragment>
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
                <Heading color={"primary"}>Tambah Sub Kegiatan</Heading>
              </HStack>
              <Box p={"30px"}>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Kode Rekening</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("kodeRekening", e.target.value)
                    }
                    placeholder="Contoh: 1.02.01.2.05.05"
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
                    placeholder="Contoh: Monitoring, Evaluasi, dan Penilaian Kinerja Pegawai"
                  />
                </FormControl>
                {/* <FormControl my={"30px"}>
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
                </FormControl> */}
              </Box>
              <Button variant={"primary"} onClick={tambahSubKegiatan}>
                Tambah
              </Button>
            </ModalBody>

            <ModalFooter pe={"60px"} pb={"30px"}></ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          closeOnOverlayClick={false}
          isOpen={isAnggaranOpen}
          onClose={onAnggaranClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="1200px">
            <ModalHeader></ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <HStack>
                <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
                <Heading color={"primary"}>Anggaran Sub Kegiatan</Heading>
              </HStack>
              <Box p={"30px"}>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Anggaran</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("anggaran", e.target.value)
                    }
                    placeholder="Contoh: Rp. 1.000.000.000"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"24px"}>Sumber Dana</FormLabel>
                  <Select2
                    options={dataTipe?.map((val) => {
                      return {
                        value: val.id,
                        label: `${val.tipe}`,
                      };
                    })}
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setTipePerjalananId(selectedOption.value);
                    }}
                    components={{
                      DropdownIndicator: () => null, // Hilangkan tombol panah
                      IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
                    }}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: "0px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "terang",
                        color: "gelap",
                        textTransform: "none",
                        border: "0px",

                        height: "30px",
                        _hover: {
                          borderColor: "yellow.700",
                        },
                        minHeight: "60px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        bg: state.isFocused ? "primary" : "white",
                        color: state.isFocused ? "white" : "gelap",
                        textTransform: "none",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Tahun</FormLabel>
                  <Input
                    type="month"
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("tahun", e.target.value)
                    }
                    placeholder="Contoh: 2025"
                    min="2000"
                    max="2100"
                  />
                </FormControl>
              </Box>
              <Button variant={"primary"} onClick={tambahAnggaran}>
                Tambah
              </Button>
            </ModalBody>

            <ModalFooter pe={"60px"} pb={"30px"}></ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export default SubKegiatanAdmin;
