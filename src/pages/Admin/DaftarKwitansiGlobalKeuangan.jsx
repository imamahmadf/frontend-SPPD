import React, { useState, useEffect } from "react";
import axios from "axios";

import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import { BsCartDash } from "react-icons/bs";

import { BsClipboard2Data } from "react-icons/bs";
import { BsLock } from "react-icons/bs";
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
import { BsCartPlus } from "react-icons/bs";
function DaftarKwitansiGlobalKeuangan() {
  const [dataKwitGlobal, setDataKwitGlobal] = useState([]);
  const history = useHistory();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const [dataBendahara, setDataBendahara] = useState(null);
  const [dataKPA, setDataKPA] = useState(null);
  const [dataJenisPerjalanan, setDataJenisPerjalanan] = useState(null);
  const [dataTemplate, setDataTemplate] = useState(null);
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);

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

  async function fetchKwitansiGlobal() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi-global/get/all?page=${page}&limit=${limit}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id
        }&indukUnitKerjaId=${user[0]?.unitKerja_profile?.indukUnitKerja.id}`
      )
      .then((res) => {
        setDataKwitGlobal(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        setDataKPA(res.data.resultKPA);
        setDataBendahara(res.data.resultBendahara);
        setDataJenisPerjalanan(res.data.resultJenisPerjalanan);
        setDataTemplate(res.data.resultTemplate);
        setDataSubKegiatan(res.data.resultDaftarSubKegiatan);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchKwitansiGlobal();
  }, [page]);
  return (
    <>
      <Layout>
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Container
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            maxW={"3280px"}
            p={"30px"}
            borderRadius={"5px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <HStack gap={5} mb={"30px"}>
              <Spacer />
            </HStack>

            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>jenis Perjalanan</Th>
                  <Th>Sub Kegiatan</Th>
                  <Th>Pengguna Anggaran</Th>
                  <Th>Bendahara</Th>
                  <Th>Sumber Dana</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataKwitGlobal?.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item?.jenisPerjalanan?.jenis || "-"}</Td>
                    <Td>{item?.subKegiatan?.subKegiatan || "-"}</Td>
                    <Td>{item?.KPA?.pegawai_KPA?.nama || "-"}</Td>
                    <Td>{item?.bendahara?.pegawai_bendahara?.nama}</Td>
                    <Td>{item?.bendahara?.sumberDana?.sumber}</Td>
                    <Td>{item?.status}</Td>
                    <Td>
                      <Button
                        onClick={() =>
                          history.push(
                            `/keuangan/detail-kwitansi-global/${item.id}`
                          )
                        }
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
      </Layout>
    </>
  );
}

export default DaftarKwitansiGlobalKeuangan;
