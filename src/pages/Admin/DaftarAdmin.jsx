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
import { BsEyeFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import Loading from "../../Componets/Loading";

function DaftarAdmin() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector(userRedux);
  const role = useSelector(selectRole);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  async function fetchDataPerjalanan() {
    setIsLoading(true);
    try {
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
        })
        .catch((err) => {
          console.error(err);
        });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page]);
  return (
    <Layout>
      <Box pt={"140px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        {isLoading ? (
          <Loading />
        ) : (
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
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th>no.</Th>
                    <Th>jenis Perjalanan</Th>

                    <Th>Unit Kerja Surat Tugas</Th>
                    <Th>No Surat Tugas</Th>
                    <Th>No Nota Dinas</Th>
                    <Th>Tanggal Berangkat</Th>
                    <Th>tanggal Pulang</Th>
                    <Th>Personil 1</Th>
                    <Th>Personil 2</Th>
                    <Th>Personil 3</Th>
                    <Th>Personil 4</Th>
                    <Th>Personil 5</Th>
                    <Th>Kode Rekening</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataPerjalanan?.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1}</Td> <Td>{item.jenisPerjalanan.jenis}</Td>{" "}
                      <Td>
                        {
                          item.ttdSuratTuga.indukUnitKerja_ttdSuratTugas
                            .kodeInduk
                        }
                      </Td>
                      <Td>{item.noSuratTugas ? item.noSuratTugas : "-"}</Td>
                      <Td>
                        {item.suratKeluar.nomor ? item.suratKeluar.nomor : "-"}
                      </Td>
                      <Td>
                        {item.tempats?.[0]?.tanggalBerangkat
                          ? new Date(
                              item.tempats[0].tanggalBerangkat
                            ).toLocaleDateString()
                          : "-"}
                      </Td>
                      <Td>
                        {item.tempats?.[0]?.tanggalPulang
                          ? new Date(
                              item.tempats[0].tanggalPulang
                            ).toLocaleDateString()
                          : "-"}
                      </Td>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Td key={i}>
                          {item.personils?.[i]?.pegawai?.nama || "-"}
                        </Td>
                      ))}
                      <Td>{item.kodeRekening?.kode || "-"}</Td>
                      <Td>
                        <Button
                          variant={"primary"}
                          p={"0px"}
                          fontSize={"14px"}
                          onClick={() =>
                            history.push(`/admin/rampung/${item.id}`)
                          }
                        >
                          <BsEyeFill />
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
        )}
      </Box>
    </Layout>
  );
}

export default DaftarAdmin;
