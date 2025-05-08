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
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import Layout from "../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
function DaftarPegawai() {
  const [dataPegawai, setDataPegawai] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [dataSeed, setDataSeed] = useState([]);
  const [time, setTime] = useState("");
  const [pangkatId, setPangkatId] = useState(0);
  const [golonganId, setGolonganId] = useState(0);
  const [tingkatanId, setTingkatanId] = useState(0);
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [jabatan, setJabatan] = useState("");
  const token = localStorage.getItem("token");
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
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/post`, {
        nama,
        nip,
        jabatan,
        pangkatId,
        golonganId,
        tingkatanId,
      })
      .then((res) => {
        console.log(res.status, res.data, "tessss");
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  async function fetchDataPegawai() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/daftar?&time=${time}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        setDataPegawai(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "nama") {
      setNama(val);
    } else if (field == "nip") {
      setNip(val);
    } else if (field == "jabatan") {
      setJabatan(val);
    }
  };
  useEffect(() => {
    fetchDataPegawai();
    fetchSeed();
  }, []);
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
          ps={"0px"}
          my={"30px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Tambah Tujuan</Heading>
          </HStack>

          <Box p={"30px"}>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
              <Input
                height={"60px"}
                bgColor={"terang"}
                onChange={(e) => handleSubmitChange("nama", e.target.value)}
                placeholder="Contoh: Sifulan, SKM"
              />
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>NIP</FormLabel>
              <Input
                height={"60px"}
                bgColor={"terang"}
                onChange={(e) => handleSubmitChange("nip", e.target.value)}
                placeholder="Contoh: 19330722 195502 1 003"
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
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
                    bg: state.isFocused ? "primary" : "white",
                    color: state.isFocused ? "white" : "black",
                  }),
                }}
              />
            </FormControl>
            <FormControl my={"30px"} border={0} bgColor={"white"} flex="1">
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
                    bg: state.isFocused ? "primary" : "white",
                    color: state.isFocused ? "white" : "black",
                  }),
                }}
              />
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Jabatan</FormLabel>
              <Input
                height={"60px"}
                bgColor={"terang"}
                onChange={(e) => handleSubmitChange("jabatan", e.target.value)}
                placeholder="Contoh: bendahara"
              />
            </FormControl>{" "}
            <FormControl my={"30px"} border={0} bgColor={"white"} flex="1">
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
                    bg: state.isFocused ? "primary" : "white",
                    color: state.isFocused ? "white" : "black",
                  }),
                }}
              />
            </FormControl>
            <Button onClick={tambahPegawai} variant={"primary"}>
              Tambah Pegawai
            </Button>
          </Box>
          {/* {JSON.stringify(dataSeed.resultPangkat)} */}
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
        >
          <Table>
            <Thead bgColor={"primary"} border={"1px"}>
              <Tr>
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  nama
                </Th>{" "}
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  NIP
                </Th>{" "}
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  Pangkat
                </Th>{" "}
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  Gol.
                </Th>{" "}
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  Jabatan
                </Th>{" "}
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  Tingkatan
                </Th>{" "}
                <Th
                  fontSize={"14px"}
                  borderColor={"secondary"}
                  color={"secondary"}
                  py={"15px"}
                  px={"5px"}
                  border={"1px"}
                >
                  Aksi
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataPegawai?.result?.map((item, index) => (
                <Tr>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                  >
                    {item.nama}
                  </Td>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                    minWidth={"200px"}
                  >
                    {item.nip}
                  </Td>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                  >
                    {item.daftarPangkat.pangkat}
                  </Td>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                  >
                    {item.daftarGolongan.golongan}
                  </Td>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                  >
                    {item.jabatan}
                  </Td>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                  >
                    {item.daftarTingkatan.tingkatan}
                  </Td>
                  <Td
                    borderWidth="1px"
                    px={"5px"}
                    py={"5px"}
                    borderColor="primary"
                  >
                    <Flex>
                      <Button
                        height={"30px"}
                        onClick={() =>
                          history.push(`/admin/detail-pegawai/${item.id}`)
                        }
                        variant={"primary"}
                      >
                        Detail
                      </Button>
                      <Button
                        height={"30px"}
                        onClick={() =>
                          history.push(`/admin/edit-pegawai/${item.id}`)
                        }
                        variant={"primary"}
                      >
                        Ubah
                      </Button>
                      <Button height={"30px"} variant={"secondary"}>
                        hapus
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>{" "}
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
        </Container>
      </Box>
    </Layout>
  );
}

export default DaftarPegawai;
