import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutAset from "../../Componets/Aset/LayoutAset";
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
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useColorMode,
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

function DaftarPersediaan() {
  const [DataPersediaan, setDataPersediaan] = useState([]);
  const history = useHistory();
  const [dataSeed, setDataSeed] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [tipeId, setTipeId] = useState(0);
  const [kode, setKode] = useState("");
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [nama, setNama] = useState("");
  const [NUSP, setNUSP] = useState("");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "kode") {
      setKode(val);
    } else if (field == "nama") {
      setNama(val);
    } else if (field == "NUSP") {
      setNUSP(val);
    }
  };

  async function fetchDataPersediaan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/persediaan/get?page=${page}&limit=${limit}`
      )
      .then((res) => {
        setDataPersediaan(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const tambahPersediaan = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/persediaan/post`, {
        nama,
        kode,
        NUSP,
        tipeId,
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
        fetchDataPersediaan();
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
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/persediaan/get/seed`)
      .then((res) => {
        console.log(res.data);
        setDataSeed(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPersediaan();
    fetchSeed();
  }, [page]);
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
            {" "}
            <HStack gap={5} mb={"30px"}>
              <Button onClick={onTambahOpen} variant={"primary"} px={"50px"}>
                Tambah +
              </Button>

              <Spacer />
            </HStack>{" "}
            <Table variant={"aset"}>
              <Thead>
                <Tr>
                  <Th>Kode barang</Th>
                  <Th maxWidth={"20px"}>Tipe Barang</Th>
                  <Th>Nama barang</Th>
                  <Th>NUSP </Th>
                </Tr>
              </Thead>
              <Tbody>
                {DataPersediaan?.map((item, index) => (
                  <Tr key={item.id}>
                    {" "}
                    <Td>{item?.kodeBarang}</Td>
                    <Td>{item?.tipePersediaan.nama}</Td>
                    <Td>{item?.nama}</Td> <Td>{item?.NUSP}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>{" "}
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
        </Box>{" "}
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
                  <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
                  <Heading color={"primary"}>Tambah Pegawai</Heading>
                </HStack>

                <SimpleGrid columns={2} spacing={10} p={"30px"}>
                  <FormControl my={"30px"}>
                    <FormLabel fontSize={"24px"}>Kode Barang</FormLabel>
                    <Input
                      height={"60px"}
                      bgColor={"terang"}
                      onChange={(e) =>
                        handleSubmitChange("kode", e.target.value)
                      }
                      placeholder="Contoh:1405"
                    />
                  </FormControl>
                  <FormControl my={"30px"}>
                    <FormLabel fontSize={"24px"}>Nama barang</FormLabel>
                    <Input
                      height={"60px"}
                      bgColor={"terang"}
                      onChange={(e) =>
                        handleSubmitChange("nama", e.target.value)
                      }
                      placeholder="Contoh: Kertas Cover"
                    />
                  </FormControl>

                  <FormControl my={"30px"}>
                    <FormLabel fontSize={"24px"}>NUSP</FormLabel>
                    <Input
                      height={"60px"}
                      bgColor={"terang"}
                      onChange={(e) =>
                        handleSubmitChange("NUSP", e.target.value)
                      }
                      placeholder="Contoh: 005"
                    />
                  </FormControl>

                  <FormControl
                    my={"30px"}
                    border={0}
                    bgColor={"white"}
                    flex="1"
                  >
                    <FormLabel fontSize={"24px"}>Jenis Kendaraan</FormLabel>
                    <Select2
                      options={dataSeed?.resultTipe?.map((val) => ({
                        value: val.id,
                        label: `${val.nama}`,
                      }))}
                      placeholder="Contoh: Roda Dua"
                      focusBorderColor="red"
                      onChange={(selectedOption) => {
                        setTipeId(selectedOption.value);
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
                </SimpleGrid>
              </Box>
            </ModalBody>

            <ModalFooter pe={"60px"} pb={"30px"}>
              <Button onClick={tambahPersediaan} variant={"primary"}>
                Tambah Persediaan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </LayoutAset>
    </>
  );
}

export default DaftarPersediaan;
