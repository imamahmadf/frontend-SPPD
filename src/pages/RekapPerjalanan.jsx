import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { BsDownload } from "react-icons/bs";
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
  Tooltip,
  Input,
  Spacer,
  useToast,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";
import DataKosong from "../Componets/DataKosong";

function RekapPerjalanan() {
  const { colorMode } = useColorMode();
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [pegawaiId, setPegawaiId] = useState(0);
  const [time, setTime] = useState("");
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);
  const [subKegiatanId, setSubKegiatanId] = useState(0);
  const [dataRekap, setDataRekap] = useState([]);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  async function fetchSubKegiatan() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/sub-kegiatan/get-filter/${user[0]?.unitKerja_profile?.id}`
      );
      setDataSubKegiatan(res.data.result);

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/rekap/get/perjalanan/download?subKegiatanId=${subKegiatanId}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id
        }`,
        {
          responseType: "blob", // agar respons dibaca sebagai file
          // headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-Kendaraan-dinas.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengunduh file Excel:", error);
      alert("Terjadi kesalahan saat mengunduh file.");
    }
  };

  async function fetchDataRekap() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/rekap/get?time=${time}&page=${page}&limit=${limit}&subKegiatanId=${subKegiatanId}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id
        }&tanggalBerangkat=${tanggalAwal}&tanggalPulang=${tanggalAkhir}&pegawaiId=${pegawaiId}`
      );
      setDataRekap(res.data.result);
      setPage(res.data.page);
      setPages(res.data.totalPage);
      setRows(res.data.totalRows);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDataRekap();
    fetchSubKegiatan();
  }, [page, subKegiatanId, tanggalAkhir, tanggalAwal, pegawaiId]);

  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Box
          style={{ overflowX: "auto" }}
          bgColor={"white"}
          p={"30px"}
          borderRadius={"5px"}
          bg={colorMode === "dark" ? "gray.800" : "white"}
          mb={"40px"}
        >
          <Flex gap={4} mb={4} zIndex={999}>
            {" "}
            <Button
              variant={"primary"}
              fontWeight={900}
              onClick={downloadExcel}
            >
              <BsDownload />
            </Button>{" "}
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
              <AsyncSelect
                loadOptions={async (inputValue) => {
                  if (!inputValue) return [];
                  try {
                    const res = await axios.get(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/pegawai/search?q=${inputValue}`
                    );
                    return res.data.result.map((val) => ({
                      value: val,
                      label: val.nama,
                    }));
                  } catch (err) {
                    console.error("Failed to load options:", err.message);
                    return [];
                  }
                }}
                placeholder="Ketik Nama Pegawai"
                onChange={(selectedOption) => {
                  setPegawaiId(selectedOption.value.id);
                }}
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
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
                    _hover: { borderColor: "yellow.700" },
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
              <FormLabel fontSize={"24px"}> Sub Kegiatan</FormLabel>
              <Select2
                options={dataSubKegiatan?.map((val) => {
                  return {
                    value: val.id,
                    label: `${val.subKegiatan} - ${val.kodeRekening}`,
                  };
                })}
                placeholder="Cari Kegiatan"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  setSubKegiatanId(selectedOption.value);
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
          </Flex>{" "}
          <Flex gap={4} mb={4}>
            <FormControl>
              <FormLabel>Tanggal Berangkat (Awal)</FormLabel>
              <Input
                type="date"
                value={tanggalAwal}
                onChange={(e) => setTanggalAwal(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tanggal Pulang (Akhir)</FormLabel>
              <Input
                type="date"
                value={tanggalAkhir}
                onChange={(e) => setTanggalAkhir(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Box>
        <Box
          style={{ overflowX: "auto" }}
          bgColor={"white"}
          p={"30px"}
          borderRadius={"5px"}
          bg={colorMode === "dark" ? "gray.800" : "white"}
        >
          <Table variant={"primary"}>
            <Thead>
              <Tr>
                <Th>No. Surat Tugas</Th>
                <Th>Tujuan</Th>
                <Th>Tanggal Berangkat</Th>
                <Th>Tanggal Pulang</Th>
                <Th>Nama Pegawai</Th>
                <Th>No. SPD</Th> <Th>Sub Kegiatan</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataRekap.map((item) =>
                item.personils.map((personil, idx) => (
                  <Tr key={`${item.id}-${personil.id}`}>
                    <Td>{item.noSuratTugas}</Td>
                    <Td>
                      {" "}
                      {item.jenisPerjalanan.tipePerjalanan.id === 1
                        ? item.tempats.map((val) => (
                            <Text key={val.id}>{val.dalamKota.nama}</Text>
                          ))
                        : item.tempats.map((val) => (
                            <Text key={val.id}>{val.tempat}</Text>
                          ))}
                    </Td>
                    <Td>
                      {item.tempats?.[0]?.tanggalBerangkat
                        ? new Date(
                            item.tempats[0].tanggalBerangkat
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </Td>
                    <Td>
                      {item.tempats?.[item.tempats.length - 1]?.tanggalPulang
                        ? new Date(
                            item.tempats[item.tempats.length - 1].tanggalPulang
                          ).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </Td>
                    <Td>{personil.pegawai?.nama || "-"}</Td>
                    <Td>{personil.nomorSPD || "-"}</Td>{" "}
                    <Td>{item.daftarSubKegiatan.subKegiatan || "-"}</Td>
                  </Tr>
                ))
              )}
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
          </div>{" "}
        </Box>
      </Box>
    </Layout>
  );
}
export default RekapPerjalanan;
