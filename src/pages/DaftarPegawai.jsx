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
  Th,
  Td,
  Flex,
  Textarea,
  Input,
  Heading,
  SimpleGrid,
  Spacer,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import { BsCart4 } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import Loading from "../Componets/Loading";
import { Select as Select2 } from "chakra-react-select";
import axios from "axios";
import Layout from "../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import LayoutPegawai from "../Componets/Pegawai/LayoutPegawai";

function DaftarPegawai() {
  const [dataPegawai, setDataPegawai] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [keyword, setKeyword] = useState("");
  const [alfabet, setAlfabet] = useState("");
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [dataSeed, setDataSeed] = useState([]);
  const [time, setTime] = useState("");
  const [pangkatId, setPangkatId] = useState(0);
  const [golonganId, setGolonganId] = useState(0);
  const [tingkatanId, setTingkatanId] = useState(0);
  const [statusPegawaiId, setStatusPegawaiId] = useState(0);
  const [profesiId, setProfesiId] = useState(0);
  const [nama, setNama] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [nip, setNip] = useState("");
  const [unitKerjaId, setUnitKerjaId] = useState(0);
  const [jabatan, setJabatan] = useState("");
  const [filterUnitKerjaId, setFilterUnitKerjaId] = useState(0);
  const [filterStatusPegawaiId, setFilterStatusPegawaiId] = useState(0);
  const [filterProfesiId, setFilterProfesiId] = useState(0);
  const [filtergolonganId, setFilterGolonganId] = useState(0);
  const [filtertingkatanId, setFilterTingkatanId] = useState(0);
  const [filterPangkatId, setFilterPangkatId] = useState(0);
  const token = localStorage.getItem("token");
  const [filterPendidikan, setFilterPendidikan] = useState("");
  const [filterNip, setFilterNip] = useState("");
  const [filterJabatan, setFilterJabatan] = useState("");
  const [tanggalTMT, setTanggalTMT] = useState("");
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector(userRedux);
  const { colorMode, toggleColorMode } = useColorMode();

  function inputHandler(event, field) {
    const tes = setTimeout(() => {
      const { value } = event.target;

      setKeyword(value);
    }, 2000);
  }
  async function fetchSeed() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get/seed`)
      .then((res) => {
        setDataSeed(res.data);
        console.log(res.data, "DATASEEED");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const tambahPegawai = () => {
    axios;
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/post`,
        {
          nama,
          nip,
          jabatan,
          pangkatId,
          golonganId,
          tingkatanId,
          unitKerjaId,
          statusPegawaiId,
          profesiId,
          pendidikan,
          tanggalTMT,
          password: "paserkab",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        onTambahClose();
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  async function fetchDataPegawai() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/daftar?search_query=${keyword}&alfabet=${alfabet}&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${filterUnitKerjaId}&statusPegawaiId=${filterStatusPegawaiId}&profesiId=${filterProfesiId}&golonganId=${filtergolonganId}&tingkatanId=${filtertingkatanId}&pangkatId=${filterPangkatId}&filterNip=${filterNip}&filterJabatan=${filterJabatan}&filterPendidikan=${filterPendidikan}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.status, res.data, "tessss");
      setPage(res.data.page);
      setPages(res.data.totalPage);
      setRows(res.data.totalRows);
      setDataPegawai(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const resetFilter = () => {
    setPage(0);
    setKeyword("");
    setFilterUnitKerjaId(0);
    setFilterStatusPegawaiId(0);
    setFilterProfesiId(0);
    setFilterGolonganId(0);
    setFilterPangkatId(0);
    setFilterTingkatanId(0);
    setFilterJabatan("");
    setFilterPendidikan("");
    setFilterNip("");

    const inputFIleds = document.querySelectorAll('input[type="name"]');
    inputFIleds.forEach((input) => {
      input.value = "";
    });

    const selectComponents = ducument.querySelectorAll(".chakra-react-select");
    selectComponents.forEach((select) => {
      const event = new Event("change", { bubbles: true });
      select.value = null;
      select.dispatchEvent(event);
    });
  };
  const handleSubmitFilterChange = (field, val) => {
    const tes = setTimeout(() => {
      if (field == "nip") {
        setFilterNip(val);
      } else if (field == "jabatan") {
        setFilterJabatan(val);
      } else if (field == "pendidikan") {
        setFilterPendidikan(val);
      }
    }, 2000);
  };

  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "nama") {
      setNama(val);
    } else if (field == "nip") {
      setNip(val);
    } else if (field == "jabatan") {
      setJabatan(val);
    } else if (field == "pendidikan") {
      setPendidikan(val);
    }
  };

  const downloadExcelPegawai = async (unitKerjaId = null) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get/download`,
        {
          params: unitKerjaId ? { unitKerjaId } : {},
          responseType: "blob", // agar respons dibaca sebagai file
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-pegawai.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengunduh file Excel:", error);
      alert("Terjadi kesalahan saat mengunduh file.");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchDataPegawai(), fetchSeed()]);
    };
    fetchData();
  }, [
    page,
    keyword,
    filterUnitKerjaId,
    filterStatusPegawaiId,
    filterProfesiId,
    filtergolonganId,
    filterPangkatId,
    filtertingkatanId,
    filterJabatan,
    filterPendidikan,
    filterNip,
  ]);
  return (
    <LayoutPegawai>
      {isLoading ? (
        <Loading />
      ) : (
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"} minH={"65vh"}>
          <Container
            border={"1px"}
            borderRadius={"6px"}
            borderColor={
              colorMode === "dark" ? "gray.800" : "rgba(229, 231, 235, 1)"
            }
            maxW={"2880px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            p={"30px"}
          >
            <Flex gap={5}>
              <Button
                onClick={onTambahOpen}
                mb={"30px"}
                variant={"primary"}
                px={"50px"}
              >
                Tambah +
              </Button>
              <Spacer />
              <Button onClick={downloadExcelPegawai}>DL</Button>
            </Flex>
            <Table variant={"pegawai"}>
              <Thead>
                <Tr>
                  <Th>
                    No.
                    <Box>
                      <Box></Box>
                    </Box>
                  </Th>
                  <Th>
                    nama
                    <Box>
                      <Box>
                        <FormControl mt={"5px"}>
                          <Input
                            onChange={inputHandler}
                            color={"gelap"}
                            type="name"
                            borderRadius="5px"
                            h={"30px"}
                            bgColor={"secondary"}
                          />
                        </FormControl>
                      </Box>
                    </Box>
                  </Th>
                  <Th textTransform="none">
                    NIP
                    <Box>
                      <FormControl mt={"5px"}>
                        <Input
                          onChange={(e) =>
                            handleSubmitFilterChange("nip", e.target.value)
                          }
                          type="name"
                          color={"gelap"}
                          borderRadius="5px"
                          h={"30px"}
                          bgColor={"secondary"}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Pangkat
                    <Box>
                      <FormControl mt={"5px"}>
                        <Select2
                          options={dataSeed?.resultPangkat?.map((val) => ({
                            value: val.id,
                            label: `${val.pangkat}`,
                          }))}
                          focusBorderColor="red"
                          onChange={(selectedOption) => {
                            setFilterPangkatId(selectedOption.value);
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
                              minHeight: "30px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              bg: state.isFocused ? "pegawai" : "white",
                              color: state.isFocused ? "white" : "gelap",
                              textTransform: "none",
                            }),
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Golongan
                    <Box>
                      <FormControl mt={"5px"}>
                        <Select2
                          options={dataSeed?.resultGolongan?.map((val) => ({
                            value: val.id,
                            label: `${val.golongan}`,
                          }))}
                          focusBorderColor="red"
                          onChange={(selectedOption) => {
                            setFilterGolonganId(selectedOption.value);
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
                              color: "gelap",
                              textTransform: "none",
                              border: "0px",
                              height: "30px",
                              _hover: {
                                borderColor: "yellow.700",
                              },
                              minHeight: "30px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              bg: state.isFocused ? "pegawai" : "white",
                              color: state.isFocused ? "white" : "black",
                              textTransform: "none",
                            }),
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Jabatan
                    <Box>
                      <FormControl mt={"5px"}>
                        <Input
                          onChange={(e) =>
                            handleSubmitFilterChange("jabatan", e.target.value)
                          }
                          type="name"
                          color={"gelap"}
                          borderRadius="5px"
                          h={"30px"}
                          bgColor={"secondary"}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Tingkatan
                    <Box>
                      <FormControl mt={"5px"}>
                        <Select2
                          options={dataSeed?.resultTingkatan?.map((val) => ({
                            value: val.id,
                            label: `${val.tingkatan}`,
                          }))}
                          focusBorderColor="red"
                          onChange={(selectedOption) => {
                            setFilterTingkatanId(selectedOption.value);
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
                              color: "gelap",
                              textTransform: "none",
                              border: "0px",
                              height: "30px",
                              _hover: {
                                borderColor: "yellow.700",
                              },
                              minHeight: "30px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              bg: state.isFocused ? "pegawai" : "white",
                              color: state.isFocused ? "white" : "black",
                              textTransform: "none",
                            }),
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Unit Kerja
                    <Box>
                      <FormControl mt={"5px"}>
                        <Select2
                          options={dataSeed?.resultUnitKerja?.map((val) => ({
                            value: val.id,
                            label: `${val.unitKerja}`,
                          }))}
                          focusBorderColor="red"
                          onChange={(selectedOption) => {
                            setFilterUnitKerjaId(selectedOption.value);
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

                              textTransform: "none",
                              border: "0px",
                              height: "30px",
                              _hover: {
                                borderColor: "yellow.700",
                              },
                              minHeight: "30px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              bg: state.isFocused ? "pegawai" : "white",
                              color: state.isFocused ? "white" : "black",
                              textTransform: "none",
                            }),
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Pendidikan
                    <Box>
                      <FormControl mt={"5px"}>
                        <Input
                          onChange={(e) =>
                            handleSubmitFilterChange(
                              "pendidikan",
                              e.target.value
                            )
                          }
                          color={"gelap"}
                          type="name"
                          borderRadius="5px"
                          h={"30px"}
                          bgColor={"secondary"}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Status Pegawai
                    <Box>
                      <FormControl mt={"5px"}>
                        <Select2
                          options={dataSeed?.resultStatusPegawai?.map(
                            (val) => ({
                              value: val.id,
                              label: `${val.status}`,
                            })
                          )}
                          focusBorderColor="red"
                          onChange={(selectedOption) => {
                            setFilterStatusPegawaiId(selectedOption.value);
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
                              color: "gelap",
                              textTransform: "none",
                              border: "0px",
                              height: "30px",
                              _hover: {
                                borderColor: "yellow.700",
                              },
                              minHeight: "30px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              bg: state.isFocused ? "pegawai" : "white",
                              color: state.isFocused ? "white" : "black",
                              textTransform: "none",
                            }),
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Profesi
                    <Box>
                      <FormControl mt={"5px"}>
                        <Select2
                          options={dataSeed?.resultProfesi?.map((val) => ({
                            value: val.id,
                            label: `${val.nama}`,
                          }))}
                          focusBorderColor="red"
                          onChange={(selectedOption) => {
                            setFilterProfesiId(selectedOption.value);
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
                              color: "gelap",
                              textTransform: "none",
                              border: "0px",
                              height: "30px",
                              _hover: {
                                borderColor: "yellow.700",
                              },
                              minHeight: "30px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              bg: state.isFocused ? "pegawai" : "white",
                              color: state.isFocused ? "white" : "black",
                              textTransform: "none",
                            }),
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Th>
                  <Th>
                    Aksi
                    <Box>
                      <Button
                        onClick={resetFilter}
                        mt={"5px"}
                        variant={"secondary"}
                        h={"30px"}
                      >
                        Reset
                      </Button>
                    </Box>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataPegawai?.result?.map((item, index) => (
                  <Tr>
                    <Td>{page * limit + index + 1}</Td>
                    <Td>{item.nama}</Td>
                    <Td minWidth={"200px"}>{item.nip}</Td>
                    <Td>{item.daftarPangkat.pangkat}</Td>
                    <Td>{item.daftarGolongan.golongan}</Td>
                    <Td>{item.jabatan}</Td>
                    <Td>{item.daftarTingkatan.tingkatan}</Td>
                    <Td>{item?.daftarUnitKerja?.unitKerja}</Td>
                    <Td>{item.pendidikan}</Td>
                    <Td>{item?.statusPegawai?.status}</Td>
                    <Td>{item?.profesi?.nama}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          p={"0px"}
                          fontSize={"14px"}
                          onClick={() =>
                            history.push(`/admin/edit-pegawai/${item.id}`)
                          }
                          variant={"primary"}
                        >
                          <BsEyeFill />
                        </Button>
                        <Button p={"0px"} fontSize={"14px"} variant={"cancle"}>
                          X
                        </Button>
                      </Flex>
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
                previousLabel={<BsCaretLeftFill />}
                nextLabel={<BsCaretRightFill />}
                pageCount={pages}
                onPageChange={changePage}
                activeClassName={"item active "}
                breakClassName={"item break-me "}
                breakLabel={"..."}
                containerClassName={"pagination"}
                disabledClassName={"disabled-page"}
                marginPagesDisplayed={2}
                nextClassName={"item next "}
                pageClassName={"item pagination-page "}
                pageRangeDisplayed={2}
                previousClassName={"item previous"}
              />
            </div>
          </Container>
        </Box>
      )}

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
                <Box bgColor={"pegawai"} width={"30px"} height={"30px"}></Box>
                <Heading color={"pegawai"}>Tambah Pegawai</Heading>
              </HStack>

              <SimpleGrid columns={2} spacing={10} p={"30px"}>
                <FormControl my={"15px"}>
                  <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) => handleSubmitChange("nama", e.target.value)}
                    placeholder="Contoh: Sifulan, SKM"
                  />
                </FormControl>
                <FormControl my={"15px"}>
                  <FormLabel fontSize={"24px"}>NIP</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) => handleSubmitChange("nip", e.target.value)}
                    placeholder="Contoh: 19330722 195502 1 003"
                  />
                </FormControl>
                <FormControl my={"15px"}>
                  <FormLabel fontSize={"24px"}>Pangkat</FormLabel>
                  <Select2
                    options={dataSeed?.resultPangkat?.map((val) => ({
                      value: val.id,
                      label: `${val.pangkat}`,
                    }))}
                    placeholder="Contoh: Pembina"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setPangkatId(selectedOption.value);
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
                        bg: state.isFocused ? "pegawai" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"15px"} border={0} bgColor={"white"} flex="1">
                  <FormLabel fontSize={"24px"}>Golongan</FormLabel>
                  <Select2
                    options={dataSeed?.resultGolongan?.map((val) => ({
                      value: val.id,
                      label: `${val.golongan}`,
                    }))}
                    placeholder="Contoh: VI a"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setGolonganId(selectedOption.value);
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
                        bg: state.isFocused ? "pegawai" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"15px"}>
                  <FormLabel fontSize={"24px"}>Jabatan</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("jabatan", e.target.value)
                    }
                    placeholder="Contoh: bendahara"
                  />
                </FormControl>
                <FormControl my={"15px"} border={0} bgColor={"white"} flex="1">
                  <FormLabel fontSize={"24px"}>Tingkatan</FormLabel>
                  <Select2
                    options={dataSeed?.resultTingkatan?.map((val) => ({
                      value: val.id,
                      label: `${val.tingkatan}`,
                    }))}
                    placeholder="Contoh: TIngkat 3"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setTingkatanId(selectedOption.value);
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
                        bg: state.isFocused ? "pegawai" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"15px"} border={0} bgColor={"white"} flex="1">
                  <FormLabel fontSize={"24px"}>Unit Kerja</FormLabel>
                  <Select2
                    options={dataSeed?.resultUnitKerja?.map((val) => ({
                      value: val.id,
                      label: `${val.unitKerja}`,
                    }))}
                    placeholder="Contoh: TIngkat 3"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setUnitKerjaId(selectedOption.value);
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
                        bg: state.isFocused ? "pegawai" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"15px"} border={0} bgColor={"white"} flex="1">
                  <FormLabel fontSize={"24px"}>Status Pegawai</FormLabel>
                  <Select2
                    options={dataSeed?.resultStatusPegawai?.map((val) => ({
                      value: val.id,
                      label: `${val.status}`,
                    }))}
                    placeholder="Contoh: TIngkat 3"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setStatusPegawaiId(selectedOption.value);
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
                        bg: state.isFocused ? "pegawai" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"15px"} border={0} bgColor={"white"} flex="1">
                  <FormLabel fontSize={"24px"}>Profesi</FormLabel>
                  <Select2
                    options={dataSeed?.resultProfesi?.map((val) => ({
                      value: val.id,
                      label: `${val.nama}`,
                    }))}
                    placeholder="Contoh: TIngkat 3"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setProfesiId(selectedOption.value);
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
                        bg: state.isFocused ? "pegawai" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl my={"15px"}>
                  <FormLabel fontSize={"24px"}>Pendidikan</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) =>
                      handleSubmitChange("pendidikan", e.target.value)
                    }
                    placeholder="Contoh: S-1 Ekonomi"
                  />
                </FormControl>{" "}
                <FormControl>
                  <FormLabel fontSize={"24px"}>Tanggal TMT Golongan</FormLabel>
                  <Input
                    minWidth={"200px"}
                    bgColor={"terang"}
                    height={"60px"}
                    type="date"
                    value={tanggalTMT}
                    onChange={(e) => setTanggalTMT(e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>
          </ModalBody>

          <ModalFooter pe={"60px"} pb={"30px"}>
            <Button onClick={tambahPegawai} variant={"primary"}>
              Tambah Pegawai
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutPegawai>
  );
}

export default DaftarPegawai;
