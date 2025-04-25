import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
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
  FormLabel,
  FormControl,
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
  HStack,
  Spacer,
} from "@chakra-ui/react";
function suratKeluarAdmin() {
  const [dataSuratKeluar, setDataSuratKeluar] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");
  const [klasifikasi, setKlasifikasi] = useState(null);
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [dataKlasifikasi, setDataKlasifikasi] = useState([]);
  const [dataKodeKlasifikasi, setDataKodeKlasifikasi] = useState(null);
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(null);
  const [dataUnitKerja, setDataUnitKerja] = useState(null);
  const [selectedUnitKerja, setSelectedUnitKerja] = useState(null);
  const [tujuan, setTujuan] = useState("");
  const [perihal, setPerihal] = useState("");
  const [tanggalSurat, setTanggalSurat] = useState("");
  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "tujuan") {
      setTujuan(val);
    } else if (field == "perihal") {
      setPerihal(val);
    } else if (field == "tanggalSurat") {
      setTanggalSurat(val);
    }
  };

  const submitSuratKeluar = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/post/surat-keluar`,
        {
          unitKerja: user[0]?.unitKerja_profile,
          dataKodeKlasifikasi,
          perihal,
          tujuan,
          tanggalSurat,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataSuratKeluar();
      })
      .catch((err) => {
        console.error(err); // Tangani error
      });
  };

  async function fetchKlasifikasi() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/klasifikasi/get`)
      .then((res) => {
        setKlasifikasi(res.data.result);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataSuratKeluar() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/get/surat-keluar?&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id
        }`
      )
      .then((res) => {
        setDataSuratKeluar(res.data.result);
        setDataUnitKerja(res.data.resultUnitKerja);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const fetchDataKodeKlasifikasi = async (id) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/klasifikasi/get/kode-klasifikasi/${id}`
      )
      .then((res) => {
        console.log(res.data, "tessss");
        setKodeKlasifikasi(res.data.result);
        setDataKlasifikasi(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  useEffect(() => {
    fetchDataSuratKeluar();
    fetchKlasifikasi();
  }, [page]);
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
        >
          {JSON.stringify(dataKodeKlasifikasi)}
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Data Nota Dinas</Heading>
          </HStack>
          <Box p={"30px"}>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Klasifikasi</FormLabel>
              <Select2
                options={klasifikasi?.map((val) => {
                  return {
                    value: val,
                    label: `${val.kode}-${val.namaKlasifikasi}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  //   setKlasifikasi(selectedOption);
                  fetchDataKodeKlasifikasi(selectedOption.value.id);
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
            {dataKlasifikasi[0] ? (
              <FormControl my={"30px"}>
                <FormLabel fontSize={"24px"}>Klasifikasi</FormLabel>
                <Select2
                  options={dataKlasifikasi.map((val) => ({
                    value: val.kode,
                    label: `${val.kode} - ${val.kegiatan}`,
                  }))}
                  placeholder="Pilih Klasifikasi"
                  focusBorderColor="red"
                  onChange={(selectedOption) => {
                    setDataKodeKlasifikasi(selectedOption.value);
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
            ) : null}
            <FormControl border={0} bgColor={"white"} flex="1">
              <FormLabel fontSize={"24px"}>Klasifikasi</FormLabel>
              <Select2
                options={dataUnitKerja?.map((val) => ({
                  value: val.kode,
                  label: `${val.kode}`,
                }))}
                placeholder="Pilih Klasifikasi"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  setSelectedUnitKerja(selectedOption.value);
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
            </FormControl>{" "}
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Tujuan</FormLabel>
              <Input
                height={"60px"}
                bgColor={"terang"}
                onChange={(e) => handleSubmitChange("tujuan", e.target.value)}
                placeholder="Tujuan Surat"
              />
            </FormControl>{" "}
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Perihal</FormLabel>
              <Input
                height={"60px"}
                bgColor={"terang"}
                onChange={(e) => handleSubmitChange("perihal", e.target.value)}
                placeholder="Perihal"
              />
            </FormControl>{" "}
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Tanggal Surat</FormLabel>
              <Input
                type="date"
                height={"60px"}
                bgColor={"terang"}
                onChange={(e) =>
                  handleSubmitChange("tanggalSurat", e.target.value)
                }
                placeholder="Perihal"
              />
            </FormControl>
            <Button
              mt={"30px"}
              variant={"primary"}
              onClick={() => {
                submitSuratKeluar();
              }}
            >
              Submit
            </Button>
          </Box>
          <Box p={"30px"}>
            <Table variant="simple">
              <Thead bgColor={"primary"}>
                <Tr>
                  <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                    no.
                  </Th>
                  <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                    Nomor Surat
                  </Th>{" "}
                  <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                    Jenis Surat
                  </Th>
                  <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                    Tujuan
                  </Th>
                  <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                    Perihal
                  </Th>
                </Tr>
              </Thead>
              <Tbody bgColor={"secondary"}>
                {dataSuratKeluar?.map((item, index) => {
                  return (
                    <Tr key={item.id}>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {index + 1}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {item.nomor}
                      </Td>{" "}
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {item.perjalanans[0] ? "Nota Dinas" : "Surat keluar"}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {item.tujuan}
                      </Td>{" "}
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {item.perihal}
                      </Td>{" "}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
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

export default suratKeluarAdmin;
