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
  const [nomorSPId, setNomorSPId] = useState(null);
  const [akunBelanjaId, setAkunBelanjaId] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [isTambahRekananBaru, setIsTambahRekananBaru] = useState(false);
  const [namaRekananBaru, setNamaRekananBaru] = useState("");
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();

  const changePage = ({ selected }) => {
    setPage(selected);
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
        onTambahClose();
      });
  };
  const tambahSP = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/post/sp`, {
        subKegPerId,
        nomorSPId,
        rekananId,
        akunBelanjaId,
        tanggal,
        indukUnitKerjaId: user[0]?.unitKerja_profile?.indukUnitKerja?.id,
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
        onTambahClose();
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
        onTambahClose();
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
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/barjas/get?time=${time}&page=${page}&limit=${limit}&unitKerjaId=${unitKerjaFilterId}&pegawaiId=${pegawaiFilterId}&nomor=${nomorPlat}&startDate=${tanggalAwal}&endDate=${tanggalAkhir}`
      )
      .then((res) => {
        setDataDokumen(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
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
      link.setAttribute("download", "data-Kendaraan-dinas.xlsx");
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
    unitKerjaFilterId,
    pegawaiFilterId,
    nomorPlat,
    tanggalAkhir,
    tanggalAwal,
  ]);
  return (
    <>
      <LayoutAset>
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Box
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            p={"30px"}
            borderRadius={"5px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <HStack gap={5} mb={"30px"}>
              <Button onClick={onTambahOpen} variant={"primary"} px={"50px"}>
                Tambah +
              </Button>{" "}
              <Spacer />
              <Button
                variant={"primary"}
                fontWeight={900}
                onClick={downloadExcel}
              >
                <BsDownload />
              </Button>{" "}
            </HStack>{" "}
            {/* <Flex
              borderRadius={"5px"}
              bg={colorMode === "dark" ? "gray.800" : "white"}
              mb={"30px"}
              gap={5}
            >
              <FormControl>
                <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
                <AsyncSelect
                  loadOptions={async (inputValue) => {
                    if (!inputValue) return [];
                    try {
                      const res = await axios.get(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/pegawai/search?q=${inputValue}`
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
                  placeholder="Ketik Nama Pegawai"
                  onChange={(selectedOption) => {
                    setPegawaiFilterId(selectedOption.value);
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
              </FormControl>{" "}
              {JSON.stringify(user[0]?.unitKerja_profile.indukUnitKerja.id)}
              <FormControl border={0}>
                <FormLabel fontSize={"24px"}>Unit Kerja</FormLabel>
                <Select2
                  options={dataSeed?.unitKerja?.map((val) => ({
                    value: val.id,
                    label: `${val.unitKerja}`,
                  }))}
                  placeholder="Contoh: Laboratorium kesehatan daerah"
                  focusBorderColor="red"
                  onChange={(selectedOption) => {
                    setUnitKerjaFilterId(selectedOption.value);
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
              </FormControl>{" "}
              <FormControl>
                <FormLabel fontSize={"24px"}>Nomor Plat</FormLabel>
                <Input
                  height={"60px"}
                  bgColor={"terang"}
                  onChange={inputHandler}
                  placeholder="Contoh : 3321"
                />
              </FormControl>{" "}
              <FormControl>
                <FormLabel fontSize={"24px"}>Awal</FormLabel>
                <Input
                  minWidth={"200px"}
                  bgColor={"terang"}
                  height={"60px"}
                  type="date"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={"24px"}> Akhir</FormLabel>
                <Input
                  type="date"
                  minWidth={"200px"}
                  bgColor={"terang"}
                  height={"60px"}
                  value={tanggalAkhir}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                />
              </FormControl>
            </Flex> */}
            <Table variant={"aset"}>
              <Thead>
                <Tr>
                  <Th>nomor</Th>
                  <Th>tanggal</Th>
                  <Th>Bidang</Th>
                  <Th>Sub Kegiatan</Th>
                  <Th>Akun Belanja</Th> <Th>Rekanan</Th> <Th>Nominal</Th>{" "}
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {DataDokumen?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>{item?.nomor}</Td>
                    <Td>
                      {item?.tanggal
                        ? new Date(item?.tanggal).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </Td>
                    <Td>{item?.subKegPer?.daftarUnitKerja?.unitKerja}</Td>
                    <Td>{item?.subKegPer?.nama}</Td>
                    <Td>{item?.akunBelanja?.akun}</Td>
                    <Td>{item?.rekanan?.nama}</Td>
                    <Td>
                      {" "}
                      Rp
                      {Number(item?.total).toLocaleString("id-ID")}
                    </Td>
                    <Td>
                      <Button
                        onClick={() =>
                          history.push(`/barjas/detail-sp/${item.id}`)
                        }
                      >
                        Detail
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                boxSizing: "border-box",
                width: "100%",
                height: "100%",
              }}
            >
              <ReactPaginate
                previousLabel={"+"}
                nextLabel={"-"}
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
            </div>
          </Box>

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
                <Box>
                  <HStack>
                    <Box bgColor={"aset"} width={"30px"} height={"30px"}></Box>
                    <Heading color={"aset"}>Buat Nomor Surat Pesanan</Heading>
                  </HStack>

                  <SimpleGrid columns={2} spacing={10} p={"30px"}>
                    {" "}
                    <FormControl border={0} bgColor={"white"} flex="1">
                      <FormLabel fontSize={"24px"}>Nomor SP</FormLabel>
                      <Select2
                        options={dataSeed?.resultNomorSP?.map((val) => ({
                          value: val.id,
                          label: `${val.nomorSurat}`,
                        }))}
                        placeholder="Contoh: Roda Dua"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setNomorSPId(selectedOption.value);
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
                      />{" "}
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
                      <FormLabel fontSize={"24px"}>Rekanan</FormLabel>
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
                        placeholder="Ketik Nama Pegawai"
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
                    </FormControl>{" "}
                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>SubKegiatan</FormLabel>
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
                        placeholder="Ketik Nama Pegawai"
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
                    <FormControl
                      my={"30px"}
                      border={0}
                      bgColor={"white"}
                      flex="1"
                    >
                      <FormLabel fontSize={"24px"}>Akun Belanja</FormLabel>
                      <Select2
                        options={dataSeed?.resultAkunBelanja?.map((val) => ({
                          value: val.id,
                          label: `${val.akun}`,
                        }))}
                        placeholder="Contoh: Roda Dua"
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
                    </FormControl>{" "}
                    <FormControl>
                      <FormLabel fontSize={"24px"}>Tanggal</FormLabel>
                      <Input
                        minWidth={"200px"}
                        bgColor={"terang"}
                        height={"60px"}
                        type="date"
                        value={tanggalAwal}
                        onChange={(e) => setTanggal(e.target.value)}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </ModalBody>

              <ModalFooter pe={"60px"} pb={"30px"}>
                <Button onClick={tambahSP} variant={"primary"}>
                  Tambah Surat Pesanan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </LayoutAset>
    </>
  );
}

export default DaftarDokumen;
