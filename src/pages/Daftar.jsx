import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
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
  Spacer,
} from "@chakra-ui/react";
function Daftar() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/all-perjalanan?&time=${time}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        setDataPerjalanan(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page]);
  return (
    <>
      <Layout>
        <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"} pb={"40px"}>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            p={"30px"}
          >
            DAFTAR
            <Box style={{ overflowX: "auto" }}>
              <Table>
                <Thead>
                  <Tr>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      no.
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Tanggal Berangkat
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      tanggal Pulang
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Pegawai 1
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Pegawai 2
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Pegawai 3
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Pegawai 4
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Kode Rekening
                    </Th>
                    <Th
                      bgColor={"blue"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataPerjalanan?.map((item, index) => (
                    <Tr key={item.id}>
                      <Td borderWidth="1px" borderColor="primary">
                        {index + 1}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item?.tanggalBerangkat}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.tanggalPulang}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.pegawai1.nama}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.pegawai2.nama}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.pegawai3.nama}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.pegawai4.nama}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.kodeRekening.kode}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        <Button
                          onClick={() => {
                            history.push(`/kwitansi/${item.id}`);
                          }}
                        >
                          Detail
                        </Button>
                      </Td>
                    </Tr>
                  ))}
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
    </>
  );
}

export default Daftar;
