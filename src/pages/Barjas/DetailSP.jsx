import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import Foto from "../../assets/add_photo.png";
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
  Heading,
  SimpleGrid,
  Th,
  Td,
  Tfoot,
  Divider,
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useColorMode,
  VStack,
  Checkbox,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import LayoutAset from "../../Componets/Aset/LayoutAset";
function DetailSP(props) {
  const [dataDokumen, setDataDokumen] = useState([]);
  const history = useHistory();
  const [dataJenisBarjas, setDataJenisBarjas] = useState(null);
  const [dataJenisDokumen, setDataJenisDokumen] = useState(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [jenisDokumenId, setJenisDokumenId] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [daftarBarjas, setDaftarBarjas] = useState([
    {
      jenisBarjasId: null,
      nama: "",
      harga: 0,
      jumlah: 1,
      SPId: props.match.params.id,
    },
  ]);
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const {
    isOpen: isPilihBarjasOpen,
    onOpen: onPilihBarjasOpen,
    onClose: onPilihBarjasClose,
  } = useDisclosure();
  const [selectedBarjas, setSelectedBarjas] = useState([]);

  async function fetchDataDokumen() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/dokumen/${
          props.match.params.id
        }`
      )
      .then((res) => {
        setDataDokumen(res.data.result);

        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const handlePilihBarjas = () => {
    // Validasi form sebelum membuka modal
    if (!jenisDokumenId) {
      toast({
        title: "Error!",
        description: "Pilih jenis surat terlebih dahulu",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!tanggal) {
      toast({
        title: "Error!",
        description: "Pilih tanggal terlebih dahulu",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // Reset selected barjas dan buka modal
    setSelectedBarjas([]);
    onPilihBarjasOpen();
  };

  const isBarjasSelected = (barjasId) =>
    selectedBarjas.some((b) => b.id === barjasId);

  const getBarjasJumlah = (barjasId) => {
    const found = selectedBarjas.find((b) => b.id === barjasId);
    return found?.jumlah ?? 1;
  };

  const setBarjasJumlah = (barjasId, jumlah) => {
    setSelectedBarjas((prev) =>
      prev.map((b) => (b.id === barjasId ? { ...b, jumlah } : b))
    );
  };

  const handleToggleBarjas = (barjasId, defaultJumlah = 1) => {
    setSelectedBarjas((prev) => {
      if (prev.some((b) => b.id === barjasId)) {
        return prev.filter((b) => b.id !== barjasId);
      } else {
        return [...prev, { id: barjasId, jumlah: defaultJumlah }];
      }
    });
  };

  const handleSelectAllBarjas = () => {
    if (selectedBarjas.length === (dataDokumen?.barjas?.length || 0)) {
      setSelectedBarjas([]);
    } else {
      setSelectedBarjas(
        (dataDokumen?.barjas || []).map((item) => ({
          id: item.id,
          jumlah: Number(item?.jumlah || 1),
        }))
      );
    }
  };

  const tambahDokumen = () => {
    if (selectedBarjas.length === 0) {
      toast({
        title: "Error!",
        description: "Pilih minimal satu barang dan jasa",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/barjas/post/tambah-dokumen`,
        {
          SPId: props.match.params.id,
          jenisDokumenBarjasId: jenisDokumenId,
          tanggal,
          indukUnitKerjaId: user[0]?.unitKerja_profile?.indukUnitKerja?.id,
          barjasData: selectedBarjas.map((b) => ({
            barjasId: b.id,
            jumlah: b.jumlah,
          })),
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil!",
          description: "Pengajuan berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchDataDokumen();
        onPilihBarjasClose();
        setSelectedBarjas([]);
        setJenisDokumenId(null);
        setTanggal("");
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Data Kendaraan Tidak Ditemukan",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const tambahBarjas = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/post/barjas`,
        {
          data: daftarBarjas,
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil!",
          description: "Pengajuan berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchDataDokumen();
        setDaftarBarjas([
          {
            jenisBarjasId: null,
            nama: "",
            harga: 0,
            jumlah: 1,
            SPId: props.match.params.id,
          },
        ]);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Data Kendaraan Tidak Ditemukan",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  async function fetchSeed() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/seed-detail`
      )
      .then((res) => {
        setDataJenisBarjas(res.data.resultJenisBarjas);
        setDataJenisDokumen(res.data.resultJenisDokumenBarjas);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataDokumen();
    fetchSeed();
  }, []);

  const handleBarjasChange = (index, field, value) => {
    setDaftarBarjas((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addBarjasRow = () => {
    setDaftarBarjas((prev) => [
      ...prev,
      {
        jenisBarjasId: null,
        nama: "",
        harga: 0,
        jumlah: 1,
        SPId: props.match.params.id,
      },
    ]);
  };

  const removeBarjasRow = (index) => {
    setDaftarBarjas((prev) => prev.filter((_, i) => i !== index));
  };
  const formatRupiah = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseRupiah = (str) => {
    if (!str) return 0;
    const onlyDigits = str.toString().replace(/[^0-9]/g, "");
    return onlyDigits ? parseInt(onlyDigits, 10) : 0;
  };
  const formatTanggalIndo = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (_) {
      return iso;
    }
  };
  const totalBerjalan = (daftarBarjas || []).reduce(
    (sum, it) => sum + Number(it?.harga || 0) * Number(it?.jumlah || 0),
    0
  );
  return (
    <>
      <LayoutAset>
        <Container
          maxW="container.2xl"
          py={{ base: 4, md: 8 }}
          px={{ base: 4, md: 8 }}
        >
          {/* Ringkasan Surat Card */}
          <Box
            bgColor={colorMode === "dark" ? "gray.800" : "white"}
            p={{ base: 4, md: 6 }}
            borderRadius="12px"
            boxShadow="md"
            mb={6}
          >
            <Heading size="md" mb={4} color="primary">
              Ringkasan Surat
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Nomor
                </Text>
                <Text fontSize="md" fontWeight="semibold">
                  {dataDokumen?.nomor || "-"}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Tanggal
                </Text>
                <Text fontSize="md" fontWeight="semibold">
                  {formatTanggalIndo(dataDokumen?.tanggal)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Akun Belanja
                </Text>
                <Text fontSize="md" fontWeight="semibold">
                  {dataDokumen?.akunBelanja?.akun || "-"}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Sub Kegiatan
                </Text>
                <Text fontSize="md" fontWeight="semibold">
                  {dataDokumen?.subKegPer?.nama || "-"}
                </Text>
              </Box>
              <Box gridColumn={{ base: "1 / -1", md: "1 / -1" }}>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Unit Kerja
                </Text>
                <Text fontSize="md" fontWeight="semibold">
                  {dataDokumen?.subKegPer?.daftarUnitKerja?.unitKerja || "-"}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Form Tambah Dokumen */}
          <Box
            bgColor={colorMode === "dark" ? "gray.800" : "white"}
            p={{ base: 4, md: 6 }}
            borderRadius="12px"
            boxShadow="md"
            mb={6}
          >
            <Heading size="md" mb={4} color="primary">
              Tambah Dokumen Barang dan Jasa
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="medium" mb={2}>
                  Jenis Surat
                </FormLabel>
                <Select2
                  options={dataJenisDokumen?.map((val) => ({
                    value: val.id,
                    label: `${val.jenis}`,
                  }))}
                  placeholder="Pilih jenis surat..."
                  focusBorderColor="primary"
                  onChange={(selectedOption) => {
                    setJenisDokumenId(selectedOption.value);
                  }}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: "8px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      backgroundColor:
                        colorMode === "dark" ? "gray.700" : "terang",
                      border: "1px solid",
                      borderColor:
                        colorMode === "dark" ? "gray.600" : "gray.200",
                      height: "48px",
                      _hover: {
                        borderColor: "primary",
                      },
                      minHeight: "48px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      bg: state.isFocused ? "primary" : "white",
                      color: state.isFocused ? "white" : "black",
                    }),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="medium" mb={2}>
                  Tanggal
                </FormLabel>
                <Input
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                  height="48px"
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  borderRadius="8px"
                  border="1px solid"
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                />
              </FormControl>
            </SimpleGrid>
            <Button
              onClick={handlePilihBarjas}
              variant="primary"
              mt={4}
              w={{ base: "full", md: "auto" }}
            >
              Tambah Dokumen
            </Button>
          </Box>

          {/* Tabel Dokumen */}
          <Box
            bgColor={colorMode === "dark" ? "gray.800" : "white"}
            p={{ base: 4, md: 6 }}
            borderRadius="12px"
            boxShadow="md"
            mb={6}
            overflowX="auto"
          >
            <Heading size="md" mb={4} color="primary">
              Daftar Dokumen
            </Heading>
            <Table variant="aset" size="sm">
              <Thead>
                <Tr>
                  <Th>Jenis</Th>
                  <Th>Nomor</Th>
                  <Th>Tanggal Surat</Th>
                  <Th>Tanggal Input</Th>
                  <Th isNumeric>Jumlah Item</Th>
                  <Th isNumeric>Jumlah Barang</Th>
                  <Th isNumeric>Nominal</Th>
                  <Th>Rincian Item</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataDokumen?.dokumenBarjas?.length > 0 ? (
                  dataDokumen.dokumenBarjas.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{item?.jenisDokumenBarja?.jenis || "-"}</Td>
                      <Td>{item?.nomor || "-"}</Td>
                      <Td>
                        {item?.tanggal
                          ? new Date(item?.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </Td>
                      <Td>
                        {item?.createdAt
                          ? new Date(item?.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </Td>
                      <Td isNumeric>{item?.itemDokumenBarjas?.length || 0}</Td>
                      <Td isNumeric>
                        {(item?.itemDokumenBarjas || [])
                          .reduce((sum, it) => sum + Number(it?.jumlah || 0), 0)
                          .toLocaleString("id-ID")}
                      </Td>
                      <Td isNumeric>
                        {formatRupiah(
                          (item?.itemDokumenBarjas || []).reduce(
                            (sum, it) =>
                              sum +
                              Number(it?.jumlah || 0) *
                                Number(it?.barja?.harga || 0),
                            0
                          )
                        )}
                      </Td>
                      <Td>
                        {item?.itemDokumenBarjas?.length > 0
                          ? item.itemDokumenBarjas
                              .map((it) => {
                                const nama = it?.barja?.nama ?? "-";
                                const qty = Number(
                                  it?.jumlah || 0
                                ).toLocaleString("id-ID");
                                return `${nama} (${qty})`;
                              })
                              .join(", ")
                          : "-"}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={8}>
                      <Text color="gray.500">Belum ada dokumen</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Container>

        <Box bgColor={"secondary"} pb={"40px"} px={{ base: 4, md: "30px" }}>
          <Container maxW="container.2xl">
            {/* Form Input Barang dan Jasa */}
            <Box
              bgColor={colorMode === "dark" ? "gray.800" : "white"}
              p={{ base: 4, md: 6 }}
              borderRadius="12px"
              boxShadow="md"
              mb={6}
            >
              <Heading size="md" mb={4} color="primary">
                Input Barang dan Jasa
              </Heading>
              {daftarBarjas.map((item, index) => (
                <Box
                  key={index}
                  mt={index > 0 ? 4 : 0}
                  p={4}
                  borderWidth="2px"
                  borderRadius="12px"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  bg={colorMode === "dark" ? "gray.700" : "terang"}
                >
                  <Heading size="sm" mb={4} color="primary">
                    Item {index + 1}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Jenis Barang dan Jasa
                      </FormLabel>
                      <Select2
                        value={
                          item.jenisBarjasId
                            ? {
                                value: item.jenisBarjasId,
                                label:
                                  dataJenisBarjas?.find(
                                    (v) => v.id === item.jenisBarjasId
                                  )?.jenis || "",
                              }
                            : null
                        }
                        options={dataJenisBarjas?.map((val) => ({
                          value: val.id,
                          label: `${val.jenis}`,
                        }))}
                        placeholder="Pilih jenis..."
                        focusBorderColor="primary"
                        onChange={(selectedOption) => {
                          handleBarjasChange(
                            index,
                            "jenisBarjasId",
                            selectedOption?.value || null
                          );
                        }}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "8px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor:
                              colorMode === "dark" ? "gray.600" : "white",
                            border: "1px solid",
                            borderColor:
                              colorMode === "dark" ? "gray.500" : "gray.200",
                            height: "48px",
                            _hover: {
                              borderColor: "primary",
                            },
                            minHeight: "48px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "primary" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Nama Barang dan Jasa
                      </FormLabel>
                      <Input
                        bgColor={colorMode === "dark" ? "gray.600" : "white"}
                        height="48px"
                        type="text"
                        value={item.nama}
                        onChange={(e) =>
                          handleBarjasChange(index, "nama", e.target.value)
                        }
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.200"
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Jumlah
                      </FormLabel>
                      <Input
                        bgColor={colorMode === "dark" ? "gray.600" : "white"}
                        height="48px"
                        type="text"
                        inputMode="numeric"
                        value={item.jumlah ?? 0}
                        onChange={(e) => {
                          const digits = e.target.value
                            .toString()
                            .replace(/[^0-9]/g, "");
                          const parsed = digits ? parseInt(digits, 10) : 0;
                          handleBarjasChange(index, "jumlah", parsed);
                        }}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.200"
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Harga Satuan
                      </FormLabel>
                      <Input
                        bgColor={colorMode === "dark" ? "gray.600" : "white"}
                        height="48px"
                        type="text"
                        inputMode="numeric"
                        value={formatRupiah(item.harga)}
                        onChange={(e) => {
                          const parsed = parseRupiah(e.target.value);
                          handleBarjasChange(index, "harga", parsed);
                        }}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.200"
                        }
                      />
                    </FormControl>
                  </SimpleGrid>

                  <Flex mt={4} gap={2} flexWrap="wrap">
                    <Button
                      variant="secondary"
                      onClick={addBarjasRow}
                      size="sm"
                      flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                    >
                      + Tambah Input
                    </Button>
                    {daftarBarjas.length > 1 && (
                      <Button
                        variant="danger"
                        onClick={() => removeBarjasRow(index)}
                        size="sm"
                        flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                      >
                        Hapus
                      </Button>
                    )}
                  </Flex>
                </Box>
              ))}

              <Divider my={6} />
              <Flex gap={3} flexWrap="wrap">
                <Button
                  onClick={addBarjasRow}
                  variant="secondary"
                  flex={{ base: "1 1 100%", md: "0 1 auto" }}
                >
                  + Tambah Item
                </Button>
                <Button
                  variant="primary"
                  onClick={tambahBarjas}
                  flex={{ base: "1 1 100%", md: "0 1 auto" }}
                >
                  Simpan Semua
                </Button>
              </Flex>
            </Box>

            {/* Tabel Daftar Barang dan Jasa */}
            <Box
              bgColor={colorMode === "dark" ? "gray.800" : "white"}
              p={{ base: 4, md: 6 }}
              borderRadius="12px"
              boxShadow="md"
              overflowX="auto"
            >
              <Heading size="md" mb={4} color="primary">
                Daftar Barang dan Jasa
              </Heading>
              <Table variant="aset" size="sm">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Nama</Th>
                    <Th>Jenis</Th>
                    <Th isNumeric>Jumlah</Th>
                    <Th isNumeric>Harga Satuan</Th>
                    <Th isNumeric>Subtotal</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataDokumen?.barjas?.length > 0 ? (
                    dataDokumen.barjas.map((item, index) => (
                      <Tr key={item.id}>
                        <Td>{index + 1}</Td>
                        <Td>{item?.nama || "-"}</Td>
                        <Td>{item?.jenisBarja?.jenis || "-"}</Td>
                        <Td isNumeric>
                          {Number(item?.jumlah || 0).toLocaleString("id-ID")}
                        </Td>
                        <Td isNumeric>
                          {formatRupiah(Number(item?.harga || 0))}
                        </Td>
                        <Td isNumeric fontWeight="semibold">
                          {formatRupiah(
                            Number(item?.harga || 0) * Number(item?.jumlah || 0)
                          )}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={8}>
                        <Text color="gray.500">
                          Belum ada data barang dan jasa
                        </Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td
                      colSpan={5}
                      textAlign="right"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      Total
                    </Td>
                    <Td
                      isNumeric
                      fontWeight="bold"
                      fontSize="md"
                      color="primary"
                    >
                      {formatRupiah(
                        (dataDokumen?.barjas || []).reduce(
                          (sum, it) =>
                            sum +
                            Number(it?.harga || 0) * Number(it?.jumlah || 0),
                          0
                        )
                      )}
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </Box>
          </Container>
        </Box>
      </LayoutAset>

      {/* Modal Pilih Barjas */}
      <Modal
        isOpen={isPilihBarjasOpen}
        onClose={onPilihBarjasClose}
        size="4xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          maxH="90vh"
        >
          <ModalHeader>
            <Heading size="md" color="primary">
              Pilih Barang dan Jasa
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY="auto">
            {dataDokumen?.barjas?.length > 0 ? (
              <>
                <Flex mb={4} justifyContent="space-between" alignItems="center">
                  <Text fontSize="sm" color="gray.600">
                    Pilih barang dan jasa yang akan ditambahkan ke dokumen
                  </Text>
                  <Checkbox
                    isChecked={
                      selectedBarjas.length === dataDokumen.barjas.length &&
                      dataDokumen.barjas.length > 0
                    }
                    onChange={handleSelectAllBarjas}
                    colorScheme="primary"
                  >
                    Pilih Semua
                  </Checkbox>
                </Flex>
                <Box
                  borderWidth="1px"
                  borderRadius="8px"
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                  overflowX="auto"
                >
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th width="50px">
                          <Checkbox
                            isChecked={
                              selectedBarjas.length ===
                                dataDokumen.barjas.length &&
                              dataDokumen.barjas.length > 0
                            }
                            onChange={handleSelectAllBarjas}
                            colorScheme="primary"
                          />
                        </Th>
                        <Th>No</Th>
                        <Th>Nama</Th>
                        <Th>Jenis</Th>
                        <Th isNumeric>Jumlah</Th>
                        <Th isNumeric>Jumlah Dipilih</Th>
                        <Th isNumeric>Harga Satuan</Th>
                        <Th isNumeric>Subtotal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dataDokumen.barjas.map((item, index) => (
                        <Tr
                          key={item.id}
                          bgColor={
                            isBarjasSelected(item.id)
                              ? colorMode === "dark"
                                ? "gray.700"
                                : "blue.50"
                              : "transparent"
                          }
                          _hover={{
                            bgColor:
                              colorMode === "dark" ? "gray.700" : "gray.50",
                          }}
                          cursor="pointer"
                          onClick={() =>
                            handleToggleBarjas(
                              item.id,
                              Number(item?.jumlah || 1)
                            )
                          }
                        >
                          <Td onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              isChecked={isBarjasSelected(item.id)}
                              onChange={() =>
                                handleToggleBarjas(
                                  item.id,
                                  Number(item?.jumlah || 1)
                                )
                              }
                              colorScheme="primary"
                            />
                          </Td>
                          <Td>{index + 1}</Td>
                          <Td fontWeight="medium">{item?.nama || "-"}</Td>
                          <Td>{item?.jenisBarja?.jenis || "-"}</Td>
                          <Td isNumeric>
                            {Number(item?.jumlah || 0).toLocaleString("id-ID")}
                          </Td>
                          <Td isNumeric onClick={(e) => e.stopPropagation()}>
                            <Input
                              height="32px"
                              maxW="100px"
                              type="text"
                              inputMode="numeric"
                              value={getBarjasJumlah(item.id)}
                              onChange={(e) => {
                                const digits = e.target.value
                                  .toString()
                                  .replace(/[^0-9]/g, "");
                                const parsed = digits
                                  ? parseInt(digits, 10)
                                  : 0;
                                if (isBarjasSelected(item.id)) {
                                  setBarjasJumlah(item.id, parsed);
                                } else {
                                  handleToggleBarjas(item.id, parsed || 1);
                                }
                              }}
                              isDisabled={!isBarjasSelected(item.id)}
                            />
                          </Td>
                          <Td isNumeric>
                            {formatRupiah(Number(item?.harga || 0))}
                          </Td>
                          <Td isNumeric fontWeight="semibold">
                            {formatRupiah(
                              Number(item?.harga || 0) *
                                Number(item?.jumlah || 0)
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <Box mt={4} p={4} bgColor="gray.50" borderRadius="8px">
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Barang dan Jasa Terpilih: {selectedBarjas.length} dari{" "}
                    {dataDokumen.barjas.length}
                  </Text>
                </Box>
              </>
            ) : (
              <Center py={8}>
                <VStack spacing={2}>
                  <Text color="gray.500" fontSize="md">
                    Belum ada data barang dan jasa
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    Tambahkan barang dan jasa terlebih dahulu
                  </Text>
                </VStack>
              </Center>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPilihBarjasClose}>
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={tambahDokumen}
              isDisabled={selectedBarjas.length === 0}
            >
              Simpan ({selectedBarjas.length})
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DetailSP;
