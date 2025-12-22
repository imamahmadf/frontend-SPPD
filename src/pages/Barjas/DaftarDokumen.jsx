import React, { useState, useEffect } from "react";
import axios from "axios";

import LayoutAset from "../../Componets/Aset/LayoutAset";
import ReactPaginate from "react-paginate";

import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import Foto from "../../assets/add_photo.png";
import { BsDownload } from "react-icons/bs";
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
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  VStack,
  Divider,
  Badge,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";

import {
  BsThreeDotsVertical,
  BsEyeFill,
  BsFileEarmarkArrowDown,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function DaftarDokumen() {
  const [DataDokumen, setDataDokumen] = useState([]);
  const history = useHistory();
  const [dataSeed, setDataSeed] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  const [time, setTime] = useState("");
  const [loadingItems, setLoadingItems] = useState({});
  const [loadingSurat, setLoadingSurat] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [nomorPlat, setNomorPlat] = useState("");
  const [unitKerjaFilterId, setUnitKerjaFilterId] = useState(0);
  const [pegawaiFilterId, setPegawaiFilterId] = useState(0);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [subKegPerId, setSubKegPerId] = useState(null);
  const [rekananId, setRekananId] = useState(null);
  const [unitKerjaId, setUnitKerjaId] = useState(null);
  const [nomorSPId, setNomorSPId] = useState(null);
  const [akunBelanjaId, setAkunBelanjaId] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [isTambahRekananBaru, setIsTambahRekananBaru] = useState(false);
  const [subKegPerFilterId, setSubKegPerFilterId] = useState(null);
  const [namaRekananBaru, setNamaRekananBaru] = useState("");
  const [isTulisManualSP, setIsTulisManualSP] = useState(false);
  const [nomorSPManual, setNomorSPManual] = useState("");
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  // Reset ke halaman pertama saat filter berubah
  useEffect(() => {
    setPage(0);
  }, [
    unitKerjaFilterId,
    pegawaiFilterId,
    tanggalAwal,
    tanggalAkhir,
    subKegPerFilterId,
  ]);

  const handleCloseModal = () => {
    setNomorSPId(null);
    setNomorSPManual("");
    setIsTulisManualSP(false);
    setSubKegPerId(null);
    setRekananId(null);
    setUnitKerjaId(null);
    setAkunBelanjaId(null);
    setTanggal("");
    setNamaRekananBaru("");
    setIsTambahRekananBaru(false);
    onTambahClose();
  };

  const tambahRekanan = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/post/rekanan`,
        { nama: namaRekananBaru }
      )
      .then((res) => {
        toast({
          title: "Berhasil!",
          description: "Rekanan ditambahkan.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setNamaRekananBaru("");
        setIsTambahRekananBaru(false);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Gagal Menambahkan",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  const tambahSP = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/post/sp`, {
        subKegPerId,
        nomorSPId: isTulisManualSP ? null : nomorSPId,
        nomorSPManual: isTulisManualSP ? nomorSPManual : null,
        rekananId,
        akunBelanjaId,
        tanggal,
        indukUnitKerjaId: user[0]?.unitKerja_profile?.indukUnitKerja?.id,
        unitKerjaId,
      })
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
        handleCloseModal();
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
        handleCloseModal();
      });
  };
  async function fetchSeed() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/seed/${
          user[0]?.unitKerja_profile.id
        }`
      )
      .then((res) => {
        console.log(res.data);
        setDataSeed(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataDokumen() {
    setIsLoading(true);
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/barjas/get?time=${time}&page=${page}&limit=${limit}&unitKerjaId=${unitKerjaFilterId}&pegawaiId=${pegawaiFilterId}&startDate=${tanggalAwal}&endDate=${tanggalAkhir}&subKegPerId=${subKegPerFilterId}`
      )
      .then((res) => {
        setDataDokumen(res.data.result);
        // Jangan set page dari response, biarkan dikontrol oleh user
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal memuat data dokumen",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/download`,
        {
          responseType: "blob", // agar respons dibaca sebagai file
          // headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-nomor-dokumen.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengunduh file Excel:", error);
      alert("Terjadi kesalahan saat mengunduh file.");
    }
  };

  function inputHandler(event, field) {
    const tes = setTimeout(() => {
      const { value } = event.target;

      setNomorPlat(value);
    }, 2000);
  }
  useEffect(() => {
    fetchDataDokumen();
    fetchSeed();
  }, [
    page,
    limit,
    unitKerjaFilterId,
    pegawaiFilterId,
    nomorPlat,
    tanggalAkhir,
    tanggalAwal,
    subKegPerFilterId,
  ]);
  return (
    <>
      <LayoutAset>
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"} pt={"30px"}>
          <Box
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            p={"30px"}
            borderRadius={"10px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            boxShadow="sm"
          >
            {/* Header Section */}
            <Flex
              justify="space-between"
              align="center"
              mb={"30px"}
              flexWrap="wrap"
              gap={4}
            >
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="gray.700">
                  Daftar Dokumen Barjas
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Total: {rows} dokumen
                </Text>
              </VStack>
              <HStack gap={3}>
                <Button
                  onClick={onTambahOpen}
                  variant={"primary"}
                  px={"30px"}
                  size="md"
                  leftIcon={<Text fontSize="lg">+</Text>}
                >
                  Tambah Dokumen
                </Button>
                <Button
                  variant={"outline"}
                  onClick={downloadExcel}
                  leftIcon={<BsDownload />}
                  size="md"
                >
                  Export Excel
                </Button>
              </HStack>
            </Flex>

            <Divider mb={"30px"} />

            {/* Filter Section */}
            <Box mb={"30px"}>
              <Heading size="md" mb={"20px"} color="gray.700">
                Filter Pencarian
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <FormControl>
                  <FormLabel fontSize={"16px"} fontWeight="medium">
                    Unit Kerja
                  </FormLabel>
                  <AsyncSelect
                    loadOptions={async (inputValue) => {
                      if (!inputValue) return [];
                      try {
                        const res = await axios.get(
                          `${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/admin/search/unit-kerja?q=${inputValue}`
                        );

                        const filtered = res.data.result;

                        return filtered.map((val) => ({
                          value: val.id,
                          label: val.unitKerja,
                        }));
                      } catch (err) {
                        console.error("Failed to load options:", err.message);
                        return [];
                      }
                    }}
                    placeholder="Ketik Nama Unit Kerja"
                    onChange={(selectedOption) => {
                      setUnitKerjaFilterId(selectedOption.value);
                    }}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: "6px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "terang",
                        border: "0px",
                        height: "60px",
                        _hover: { borderColor: "yellow.700" },
                        minHeight: "40px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        bg: state.isFocused ? "aset" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"16px"} fontWeight="medium">
                    Sub Kegiatan
                  </FormLabel>
                  <AsyncSelect
                    loadOptions={async (inputValue) => {
                      if (!inputValue) return [];
                      try {
                        const res = await axios.get(
                          `${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/barjas/get/sub-kegiatan/search?q=${inputValue}&indukUnitKerjaId=${
                            user[0]?.unitKerja_profile?.id
                          }`
                        );

                        const filtered = res.data.result;

                        return filtered.map((val) => ({
                          value: val.id,
                          label: val.nama,
                        }));
                      } catch (err) {
                        console.error("Failed to load options:", err.message);
                        return [];
                      }
                    }}
                    placeholder="Ketik Nama Sub Kegiatan"
                    onChange={(selectedOption) => {
                      setSubKegPerFilterId(selectedOption.value);
                    }}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: "6px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "terang",
                        border: "0px",
                        height: "60px",
                        _hover: { borderColor: "yellow.700" },
                        minHeight: "40px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        bg: state.isFocused ? "aset" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
              </SimpleGrid>
              {(unitKerjaFilterId || subKegPerFilterId) && (
                <Button
                  mt={4}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    setUnitKerjaFilterId(0);
                    setSubKegPerFilterId(null);
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </Box>

            <Divider mb={"30px"} />

            {/* Table Section */}
            <Box
              borderRadius="8px"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              <Table variant="simple" size="md">
                <Thead bg={colorMode === "dark" ? "gray.700" : "gray.50"}>
                  <Tr>
                    <Th fontWeight="bold" textTransform="capitalize">
                      Nomor SP
                    </Th>
                    <Th fontWeight="bold" textTransform="capitalize">
                      Tanggal
                    </Th>
                    <Th fontWeight="bold" textTransform="capitalize">
                      Bidang
                    </Th>
                    <Th fontWeight="bold" textTransform="capitalize">
                      Sub Kegiatan
                    </Th>
                    <Th fontWeight="bold" textTransform="capitalize">
                      Akun Belanja
                    </Th>
                    <Th fontWeight="bold" textTransform="capitalize">
                      Rekanan
                    </Th>
                    <Th fontWeight="bold" textTransform="capitalize" isNumeric>
                      Nominal
                    </Th>
                    <Th
                      fontWeight="bold"
                      textTransform="capitalize"
                      textAlign="center"
                    >
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <Tr key={index}>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                      </Tr>
                    ))
                  ) : DataDokumen?.length > 0 ? (
                    DataDokumen?.map((item, index) => (
                      <Tr
                        key={item.id}
                        _hover={{
                          bg: colorMode === "dark" ? "gray.700" : "gray.50",
                        }}
                        transition="all 0.2s"
                      >
                        <Td>
                          <Text fontWeight="medium">{item?.nomor || "-"}</Text>
                        </Td>
                        <Td>
                          {item?.tanggal
                            ? new Date(item?.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </Td>
                        <Td>
                          <Text fontSize="sm">
                            {item?.subKegPer?.daftarUnitKerja?.unitKerja || "-"}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={2}>
                            {item?.subKegPer?.nama || "-"}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={2}>
                            {item?.akunBelanja?.akun || "-"}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue" variant="subtle">
                            {item?.rekanan?.nama || "-"}
                          </Badge>
                        </Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" color="green.600">
                            Rp{" "}
                            {item?.barjas && item.barjas.length > 0
                              ? item.barjas
                                  .reduce(
                                    (total, barja) =>
                                      total +
                                      (barja.harga || 0) * (barja.jumlah || 0),
                                    0
                                  )
                                  .toLocaleString("id-ID")
                              : "0"}
                          </Text>
                        </Td>
                        <Td textAlign="center">
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() =>
                              history.push(`/barjas/detail-sp/${item.id}`)
                            }
                          >
                            Detail
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={8} textAlign="center" py={10}>
                        <VStack spacing={2}>
                          <Text fontSize="lg" color="gray.500">
                            Tidak ada data dokumen
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            Klik tombol "Tambah Dokumen" untuk menambahkan data
                            baru
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
            {/* Pagination */}
            <Box
              mt={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                pageCount={pages}
                onPageChange={changePage}
                activeClassName={"item active "}
                breakClassName={"item break-me "}
                breakLabel={"..."}
                containerClassName={"pagination"}
                disabledClassName={"disabled-page"}
                marginPagesDisplayed={1}
                nextClassName={"item next "}
                pageClassName={"item pagination-page "}
                pageRangeDisplayed={2}
                previousClassName={"item previous"}
              />
            </Box>
          </Box>

          <Modal
            closeOnOverlayClick={false}
            isOpen={isTambahOpen}
            onClose={handleCloseModal}
          >
            <ModalOverlay />
            <ModalContent borderRadius={0} maxWidth="1200px">
              <ModalHeader></ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Box>
                  <HStack mb={6} spacing={3}>
                    <Box
                      bgColor={"aset"}
                      width={"4px"}
                      height={"30px"}
                      borderRadius="2px"
                    ></Box>
                    <Heading size="lg" color={"aset"}>
                      Buat Nomor Surat Pesanan
                    </Heading>
                  </HStack>

                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacing={6}
                    p={"20px"}
                  >
                    <FormControl>
                      <FormLabel fontSize={"16px"} fontWeight="medium">
                        Nomor SP
                      </FormLabel>
                      <Select2
                        options={dataSeed?.resultNomorSP?.map((val) => ({
                          value: val.id,
                          label: `${val.nomorSurat}`,
                        }))}
                        placeholder="Contoh: Roda Dua"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setNomorSPId(selectedOption?.value || null);
                          if (selectedOption) {
                            setNomorSPManual("");
                            setIsTulisManualSP(false);
                          }
                        }}
                        isDisabled={isTulisManualSP}
                        components={{
                          DropdownIndicator: () => null, // Hilangkan tombol panah
                          IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "6px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "terang",
                            border: "0px",
                            height: "60px",
                            _hover: {
                              borderColor: "yellow.700",
                            },
                            minHeight: "40px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />{" "}
                      <Button
                        mt={4}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => {
                          if (isTulisManualSP) {
                            // Jika sedang mode tulis manual, batalkan dan reset
                            setIsTulisManualSP(false);
                            setNomorSPManual("");
                            setNomorSPId(null);
                          } else {
                            // Jika tidak, aktifkan mode tulis manual
                            setIsTulisManualSP(true);
                            setNomorSPId(null);
                          }
                        }}
                      >
                        {isTulisManualSP ? "Batalkan" : "Tulis Manual"}
                      </Button>
                      {isTulisManualSP && (
                        <>
                          <Input
                            mt={4}
                            height={"50px"}
                            bgColor={"terang"}
                            placeholder="Masukkan Nomor SP Manual"
                            value={nomorSPManual}
                            onChange={(e) => {
                              setNomorSPManual(e.target.value);
                              setNomorSPId(null);
                            }}
                          />
                        </>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize={"16px"} fontWeight="medium">
                        Rekanan
                      </FormLabel>
                      <AsyncSelect
                        loadOptions={async (inputValue) => {
                          if (!inputValue) return [];
                          try {
                            const res = await axios.get(
                              `${
                                import.meta.env.VITE_REACT_APP_API_BASE_URL
                              }/barjas/get/rekanan/search?q=${inputValue}`
                            );

                            const filtered = res.data.result;

                            return filtered.map((val) => ({
                              value: val.id,
                              label: val.nama,
                            }));
                          } catch (err) {
                            console.error(
                              "Failed to load options:",
                              err.message
                            );
                            return [];
                          }
                        }}
                        placeholder="Ketik Nama Rekanan"
                        onChange={(selectedOption) => {
                          setRekananId(selectedOption.value);
                        }}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "6px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "terang",
                            border: "0px",
                            height: "60px",
                            _hover: { borderColor: "yellow.700" },
                            minHeight: "40px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                      <Button
                        mt={4}
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() =>
                          setIsTambahRekananBaru((prevState) => !prevState)
                        }
                      >
                        {isTambahRekananBaru ? "Batalkan" : "Tambah Rekanan"}
                      </Button>
                      {isTambahRekananBaru && (
                        <>
                          <Flex>
                            <Input
                              height={"50px"}
                              bgColor={"terang"}
                              me={"10px"}
                              placeholder="Nama Rekanan Baru"
                              value={namaRekananBaru}
                              onChange={(e) =>
                                setNamaRekananBaru(e.target.value)
                              }
                            />{" "}
                            <Button
                              variant="outline"
                              colorScheme="blue"
                              height={"50px"}
                              onClick={tambahRekanan}
                            >
                              +
                            </Button>
                          </Flex>
                        </>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize={"16px"} fontWeight="medium">
                        Sub Kegiatan
                      </FormLabel>
                      <AsyncSelect
                        loadOptions={async (inputValue) => {
                          if (!inputValue) return [];
                          try {
                            const res = await axios.get(
                              `${
                                import.meta.env.VITE_REACT_APP_API_BASE_URL
                              }/barjas/get/sub-kegiatan/search?q=${inputValue}&indukUnitKerjaId=${
                                user[0]?.unitKerja_profile?.id
                              }`
                            );

                            const filtered = res.data.result;

                            return filtered.map((val) => ({
                              value: val.id,
                              label: val.nama,
                            }));
                          } catch (err) {
                            console.error(
                              "Failed to load options:",
                              err.message
                            );
                            return [];
                          }
                        }}
                        placeholder="Ketik Nama Sub Kegiatan"
                        onChange={(selectedOption) => {
                          setSubKegPerId(selectedOption.value);
                        }}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "6px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "terang",
                            border: "0px",
                            height: "60px",
                            _hover: { borderColor: "yellow.700" },
                            minHeight: "40px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize={"16px"} fontWeight="medium">
                        Akun Belanja
                      </FormLabel>
                      <Select2
                        options={dataSeed?.resultAkunBelanja?.map((val) => ({
                          value: val.id,
                          label: `${val.akun}`,
                        }))}
                        placeholder="Pilih Akun Belanja"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setAkunBelanjaId(selectedOption.value);
                        }}
                        components={{
                          DropdownIndicator: () => null, // Hilangkan tombol panah
                          IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "6px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "terang",
                            border: "0px",
                            height: "60px",
                            _hover: {
                              borderColor: "yellow.700",
                            },
                            minHeight: "40px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize={"16px"} fontWeight="medium">
                        Tanggal
                      </FormLabel>
                      <Input
                        bgColor={"terang"}
                        height={"50px"}
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize={"16px"} fontWeight="medium">
                        Unit Kerja
                      </FormLabel>
                      <AsyncSelect
                        loadOptions={async (inputValue) => {
                          if (!inputValue) return [];
                          try {
                            const res = await axios.get(
                              `${
                                import.meta.env.VITE_REACT_APP_API_BASE_URL
                              }/admin/search/unit-kerja?q=${inputValue}`
                            );

                            const filtered = res.data.result;

                            return filtered.map((val) => ({
                              value: val.id,
                              label: val.unitKerja,
                            }));
                          } catch (err) {
                            console.error(
                              "Failed to load options:",
                              err.message
                            );
                            return [];
                          }
                        }}
                        placeholder="Ketik Nama Unit Kerja"
                        onChange={(selectedOption) => {
                          setUnitKerjaId(selectedOption.value);
                        }}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "6px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "terang",
                            border: "0px",
                            height: "60px",
                            _hover: { borderColor: "yellow.700" },
                            minHeight: "40px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </ModalBody>

              <ModalFooter pe={"30px"} pb={"30px"} pt={"20px"}>
                <HStack spacing={3}>
                  <Button
                    onClick={handleCloseModal}
                    variant="ghost"
                    colorScheme="gray"
                  >
                    Batal
                  </Button>
                  <Button onClick={tambahSP} variant={"primary"} size="md">
                    Simpan Surat Pesanan
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </LayoutAset>
    </>
  );
}

export default DaftarDokumen;
