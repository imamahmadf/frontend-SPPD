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
  Spinner,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function DaftarAdmin() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");

  const user = useSelector(userRedux);
  const role = useSelector(selectRole);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/get/keuangan/daftar-perjalanan?&time=${time}&page=${page}&limit=${limit}`
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
    <Layout>
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"2280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
          my={"30px"}
        >
          <Box style={{ overflowX: "auto" }} p={"30px"}>
            <Table>
              <Thead bgColor={"primary"} border={"1px"}>
                <Tr>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    no.
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    jenis Perjalanan
                  </Th>

                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Unit Kerja Surat Tugas
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    No Surat Tugas
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    No Nota Dinas
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Tanggal Berangkat
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    tanggal Pulang
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Personil 1
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Personil 2
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Personil 3
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Personil 4
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Personil 5
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
                  >
                    Kode Rekening
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    p={"10px"}
                    border={"1px"}
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
                    </Td>{" "}
                    <Td borderWidth="1px" borderColor="primary">
                      {item.jenisPerjalanan.jenis}
                    </Td>{" "}
                    <Td borderWidth="1px" borderColor="primary">
                      {item.ttdSuratTuga.indukUnitKerja_ttdSuratTugas.kodeInduk}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.noSuratTugas ? item.noSuratTugas : "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.suratKeluar.nomor ? item.suratKeluar.nomor : "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.tempats?.[0]?.tanggalBerangkat
                        ? new Date(
                            item.tempats[0].tanggalBerangkat
                          ).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.tempats?.[0]?.tanggalPulang
                        ? new Date(
                            item.tempats[0].tanggalPulang
                          ).toLocaleDateString()
                        : "-"}
                    </Td>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Td key={i} borderWidth="1px" borderColor="primary">
                        {item.personils?.[i]?.pegawai?.nama || "-"}
                      </Td>
                    ))}
                    <Td borderWidth="1px" borderColor="primary">
                      {item.kodeRekening?.kode || "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      <Button
                        onClick={() =>
                          history.push(`/admin/rampung/${item.id}`)
                        }
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
  );
}

export default DaftarAdmin;
