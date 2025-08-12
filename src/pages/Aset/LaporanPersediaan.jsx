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

function LaporanPersediaan() {
  const [DataLaporanPersediaan, setDataLaporanPersediaan] = useState([]);
  const history = useHistory();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [nama, setNama] = useState("");
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [spesifikasi, setSpesifikasi] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [harga, setHarga] = useState(0);
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");

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
    if (field == "spek") {
      setSpesifikasi(val);
    } else if (field == "jumlah") {
      setJumlah(parseInt(val));
    } else if (field == "harga") {
      setHarga(parseInt(val));
    } else if (field == "tanggal") {
      setTanggal(val);
    } else if (field == "keterangan") {
      setKeterangan(val);
    }
  };

  async function fetchLaporanPersediaan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/laporan-persediaan/get?page=${page}&limit=${limit}`
      )
      .then((res) => {
        setDataLaporanPersediaan(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const tambahLaporanPersediaan = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/laporan-persediaan/post`,
        {
          nama,
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
        fetchLaporanPersediaan();
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

  useEffect(() => {
    fetchLaporanPersediaan();
  }, [page]);
  return (
    <>
      <LayoutAset>
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Container
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            maxW={"1280px"}
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
                  <Th>Nama</Th>
                  <Th>Status</Th>
                  <Th>Akses</Th>
                </Tr>
              </Thead>
              <Tbody>
                {DataLaporanPersediaan?.map((item, index) => (
                  <Tr key={item.id}>
                    {" "}
                    <Td>{item?.nama}</Td>
                    <Td>{item?.status}</Td>
                    <Td>
                      <Button
                        onClick={() =>
                          history.push(`/aset/detail-laporan/${item.id}`)
                        }
                        variant={"primary"}
                      >
                        Detail
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Container>{" "}
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
                  <Heading color={"primary"}>Buat Laporan</Heading>
                </HStack>

                <SimpleGrid columns={2} spacing={10} p={"30px"}>
                  <FormControl my={"30px"}>
                    <FormLabel fontSize={"24px"}>Nama</FormLabel>
                    <Input
                      height={"60px"}
                      bgColor={"terang"}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Laporan TW 2 2025"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            </ModalBody>

            <ModalFooter pe={"60px"} pb={"30px"}>
              <Button onClick={tambahLaporanPersediaan} variant={"primary"}>
                buat Laporan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </LayoutAset>
    </>
  );
}

export default LaporanPersediaan;
