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
  const [time, setTime] = useState("");

  async function fetchDataPegawai() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/daftar?&time=${time}&page=${page}&limit=${limit}`
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

  useEffect(() => {
    fetchDataPegawai();
  }, []);
  return (
    <Layout>
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Table>
          <Thead bgColor={"primary"} border={"1px"}>
            <Tr>
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                nama
              </Th>{" "}
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                NIP
              </Th>{" "}
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                Pangkat
              </Th>{" "}
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                Golongan
              </Th>{" "}
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                Jabatan
              </Th>{" "}
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                Tingkatan
              </Th>{" "}
              <Th
                fontSize={"14px"}
                borderColor={"secondary"}
                color={"secondary"}
                py={"15px"}
                border={"1px"}
              >
                Aksi
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataPegawai?.result?.map((item, index) => (
              <Tr>
                <Td borderWidth="1px" borderColor="primary">
                  {item.nama}
                </Td>
                <Td borderWidth="1px" borderColor="primary">
                  {item.nip}
                </Td>
                <Td borderWidth="1px" borderColor="primary">
                  {item.daftarPangkat.pangkat}
                </Td>
                <Td borderWidth="1px" borderColor="primary">
                  {item.daftarGolongan.golongan}
                </Td>
                <Td borderWidth="1px" borderColor="primary">
                  {item.jabatan}
                </Td>
                <Td borderWidth="1px" borderColor="primary">
                  {item.daftarTingkatan.tingkatan}
                </Td>
                <Td borderWidth="1px" borderColor="primary">
                  <Button
                    onClick={() =>
                      history.push(`/admin/edit-pegawai/${item.id}`)
                    }
                    variant={"primary"}
                  >
                    {" "}
                    Ubah
                  </Button>
                  <Button variant={"secondary"}>hapus</Button>
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
    </Layout>
  );
}

export default DaftarPegawai;
