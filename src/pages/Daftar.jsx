import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
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
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { BsEyeFill, BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";
import DataKosong from "../Componets/DataKosong";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import "moment/locale/id";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Fungsi untuk menghasilkan warna unik dari nama pegawai
function stringToColor(str) {
  if (!str) return "#000000";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

function KalenderPerjalanan({ events, colorMode, formats, localizer }) {
  return (
    <Box
      bgColor={"white"}
      p={"30px"}
      borderRadius={"5px"}
      mb={"30px"}
      bg={colorMode === "dark" ? "gray.800" : "white"}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        formats={formats}
        popup={false}
        eventPropGetter={(event) => {
          const backgroundColor = stringToColor(event.title || "");
          return {
            style: {
              backgroundColor,
              color: "white",
              borderRadius: "4px",
              border: "none",
            },
          };
        }}
      />
      <style>{`
        .rbc-month-row {
          min-height: 140px !important;
        }
        .rbc-date-cell {
          vertical-align: top !important;
        }
        .rbc-event {
          font-size: 12px;
          padding: 2px 4px;
        }
      `}</style>
    </Box>
  );
}
function Daftar() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [selectedPerjalanan, setSelectedPerjalanan] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const postNotaDinas = (val) => {
    console.log(val);
    setIsLoading(true);

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/daftar/nota-dinas`,
        {
          indukUnitKerjaId:
            user[0]?.unitKerja_profile?.indukUnitKerja?.id || "",
          pegawai: val?.personils || [],
          dataTtdSurTug: val?.ttdSuratTuga || null,
          dataTtdNotaDinas: val?.ttdNotaDina || null,

          tanggalPengajuan: val?.tanggalPengajuan || "",
          noSurTug: val?.noSuratTugas || "",
          noNotDis: val?.noNotaDinas || "",

          subKegiatan: val?.daftarSubKegiatan?.subKegiatan || "",
          untuk: val?.untuk || "",
          dasar: val?.dasar || "",
          asal: val?.asal || "",
          kodeRekeningFE: `${val?.daftarSubKegiatan?.kodeRekening || ""}${
            val?.jenisPerjalanan?.kodeRekening || ""
          }`,
          tempat: val?.tempats || [],
          // sumber: dataKegiatan.value.sumber,
          jenis: val?.jenisPerjalanan?.id || "",
          jenisPerjalanan: val?.jenisPerjalanan?.jenis || "",
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        console.log(res.data); // Log respons dari backend

        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "nota_dinas.docx"); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Tampilkan toast sukses
        toast({
          title: "Berhasil",
          description: "File nota dinas berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        // Redirect setelah download selesai
        history.push(`/daftar`);
      })
      .catch((err) => {
        console.error(err); // Tangani error
        setIsLoading(false);

        // Tampilkan toast error
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat mengunduh file",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });
  };
  const hapusPerjalanan = (e) => {
    console.log(e);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perjalanan/delete/${e}`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        fetchDataPerjalanan();
        onClose();
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const postSuratTugas = (val) => {
    setIsLoading(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/surat-tugas`,
        {
          asal: val?.asal || "",
          jenis: val?.jenisPerjalanan?.id || "",
          kode: `${val?.daftarSubKegiatan?.kodeRekening || ""}${
            val?.jenisPerjalanan?.kodeRekening || ""
          }`,
          personilFE: val?.personils || [],
          ttdSurTug: val?.ttdSuratTuga || null,
          id: val?.id || "",
          tanggalPengajuan: val?.tanggalPengajuan || "",
          tempat: val?.tempats || [],
          untuk: val?.untuk || "",
          dasar: val?.dasar || "",
          isNotaDinas: val?.isNotaDinas || 0,
          ttdSurTugJabatan: val?.ttdSuratTuga?.jabatan || "",
          ttdSurTugNama: val?.ttdSuratTuga?.pegawai?.nama || "",
          ttdSurTugNip: val?.ttdSuratTuga?.pegawai?.nip || "",
          ttdSurTugPangkat:
            val?.ttdSuratTuga?.pegawai?.daftarPangkat?.pangkat || "",
          ttdSurTugGolongan:
            val?.ttdSuratTuga?.pegawai?.daftarGolongan?.golongan || "",
          ttdSurTugUnitKerja: val?.ttdSuratTuga?.indukUnitKerjaId || "",
          ttdSurtTugKode:
            val?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas?.kodeInduk || "",

          noNotaDinas: val?.suratKeluar?.nomor || "",
          noSuratTugas: val?.noSuratTugas || "",
          unitKerja: user[0]?.unitKerja_profile || null,
          indukUnitKerjaFE: user[0]?.unitKerja_profile || null,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Surat_Tugas_${
            user[0]?.unitKerja_profile?.kode || "unknown"
          }_${Date.now()}.docx`
        ); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();
        fetchDataPerjalanan();

        toast({
          title: "Berhasil",
          description: "File surat tugas berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err); // Tangani error
        toast({
          title: "Gagal",
          description: "Gagal mengunduh file surat tugas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const postSPD = (val) => {
    setIsLoading(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/surat-perjalanan-dinas`,
        {
          asal: val?.asal || "",
          jenis: val?.jenisPerjalanan?.id || "",
          kode: `${val?.daftarSubKegiatan?.kodeRekening || ""}${
            val?.jenisPerjalanan?.kodeRekening || ""
          }`,
          personilFE: val?.personils || [],
          ttdSurTug: val?.ttdSuratTuga || null,
          id: val?.id || "",
          tanggalPengajuan: val?.tanggalPengajuan || "",
          tempat: val?.tempats || [],
          untuk: val?.untuk || "",
          dasar: val?.dasar || "",
          isNotaDinas: val?.isNotaDinas || 0,
          ttdSurTugUnitKerja: val?.ttdSuratTuga?.indukUnitKerjaId || "",
          ttdSurtTugKode:
            val?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas?.kodeInduk || "",
          KPANama: val?.KPA?.pegawai_KPA?.nama || "",
          KPANip: val?.KPA?.pegawai_KPA?.nip || "",
          KPAPangkat: val?.KPA?.pegawai_KPA?.daftarPangkat?.pangkat || "",
          KPAGolongan: val?.KPA?.pegawai_KPA?.daftarGolongan?.golongan || "",
          KPAJabatan: val?.KPA?.jabatan || "",
          noNotaDinas: val?.suratKeluar?.nomor || "",
          noSuratTugas: val?.noSuratTugas || "",
          unitKerja: user[0]?.unitKerja_profile || null,
          indukUnitKerjaFE: user[0]?.unitKerja_profile || null,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Surat_Tugas_${
            user[0]?.unitKerja_profile?.kode || "unknown"
          }_${Date.now()}.docx`
        ); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();
        fetchDataPerjalanan();

        toast({
          title: "Berhasil",
          description: "File surat tugas berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err); // Tangani error
        toast({
          title: "Gagal",
          description: "Gagal mengunduh file surat tugas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const postSuratTugasKendaraan = (val) => {
    setIsLoading(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/surat-tugas-kendaraan`,
        {
          asal: val?.asal || "",
          jenis: val?.jenisPerjalanan?.id || "",
          kode: `${val?.daftarSubKegiatan?.kodeRekening || ""}${
            val?.jenisPerjalanan?.kodeRekening || ""
          }`,
          personilFE: val?.personils || [],
          ttdSurTug: val?.ttdSuratTuga || null,
          id: val?.id || "",
          tanggalPengajuan: val?.tanggalPengajuan || "",
          tempat: val?.tempats || [],
          untuk: val?.untuk || "",
          dasar: val?.dasar || "",
          ttdSurTugJabatan: val?.ttdSuratTuga?.jabatan || "",
          ttdSurTugNama: val?.ttdSuratTuga?.pegawai?.nama || "",
          ttdSurTugNip: val?.ttdSuratTuga?.pegawai?.nip || "",
          ttdSurTugPangkat:
            val?.ttdSuratTuga?.pegawai?.daftarPangkat?.pangkat || "",
          ttdSurTugGolongan:
            val?.ttdSuratTuga?.pegawai?.daftarGolongan?.golongan || "",
          ttdSurTugUnitKerja: val?.ttdSuratTuga?.indukUnitKerjaId || "",
          ttdSurtTugKode:
            val?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas?.kodeInduk || "",
          KPANama: val?.KPA?.pegawai_KPA?.nama || "",
          KPANip: val?.KPA?.pegawai_KPA?.nip || "",
          KPAPangkat: val?.KPA?.pegawai_KPA?.daftarPangkat?.pangkat || "",
          KPAGolongan: val?.KPA?.pegawai_KPA?.daftarGolongan?.golongan || "",
          KPAJabatan: val?.KPA?.jabatan || "",
          noNotaDinas: val?.suratKeluar?.nomor || "",
          noSuratTugas: val?.noSuratTugas || "",
          unitKerja: user[0]?.unitKerja_profile || null,
          indukUnitKerjaFE: user[0]?.unitKerja_profile || null,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        fetchDataPerjalanan();

        toast({
          title: "Berhasil",
          description: "File surat tugas berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err); // Tangani error
        toast({
          title: "Gagal",
          description: "Gagal mengunduh file surat tugas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/all-perjalanan?&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id || ""
        }&tanggalBerangkat=${tanggalAwal}&tanggalPulang=${tanggalAkhir}`
      )
      .then((res) => {
        setDataPerjalanan(res?.data?.result || []);
        setPage(res?.data?.page || 0);
        setPages(res?.data?.totalPage || 0);
        setRows(res?.data?.totalRows || 0);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setDataPerjalanan([]);
        setPage(0);
        setPages(0);
        setRows(0);
      });
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page, tanggalAkhir, tanggalAwal]);

  // Mapping dataPerjalanan ke events untuk kalender, setiap personil jadi event terpisah
  const events = (dataPerjalanan || []).flatMap((item) => {
    if (!item) return [];
    const start = item?.tempats?.[0]?.tanggalBerangkat
      ? new Date(item?.tempats?.[0]?.tanggalBerangkat)
      : null;
    const end = item?.tempats?.[item?.tempats?.length - 1]?.tanggalPulang
      ? new Date(item?.tempats?.[item?.tempats?.length - 1]?.tanggalPulang)
      : start;
    return (item?.personils || []).map((p) => ({
      title: p?.pegawai?.nama || "-",
      start,
      end,
      allDay: true,
      resource: item,
    }));
  });

  moment.locale("id");
  const localizer = momentLocalizer(moment);
  const formats = {
    dayFormat: (date, culture, localizer) =>
      format(date, "EEEE", { locale: idLocale }),
    weekdayFormat: (date, culture, localizer) =>
      format(date, "EEEEEE", { locale: idLocale }),
    monthHeaderFormat: (date, culture, localizer) =>
      format(date, "MMMM yyyy", { locale: idLocale }),
    dayHeaderFormat: (date, culture, localizer) =>
      format(date, "EEEE, d MMMM", { locale: idLocale }),
  };

  return (
    <>
      {isLoading && <Loading />}
      <Layout>
        {/* Kalender Perjalanan */}

        {dataPerjalanan[0] ? (
          <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
            {" "}
            <Box bgColor={"secondary"} pb={"20px"} px={"30px"}>
              <KalenderPerjalanan
                events={events}
                colorMode={colorMode}
                formats={formats}
                localizer={localizer}
              />
            </Box>
            <Box
              mt={"50px"}
              style={{ overflowX: "auto" }}
              bgColor={"white"}
              p={"30px"}
              borderRadius={"5px"}
              bg={colorMode === "dark" ? "gray.800" : "white"}
            >
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
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th>no.</Th>
                    <Th maxWidth={"120px"}>Unit Kerja Surtug</Th>
                    <Th>No Surat/Nota/Telaahan</Th>
                    <Th>Tanggal Berangkat</Th>
                    <Th>tanggal Pulang</Th>
                    <Th>Jenis & Tujuan</Th>
                    <Th>Personil 1</Th>
                    <Th>Personil 2</Th>
                    <Th>Personil 3</Th>
                    <Th>Personil 4</Th>
                    <Th>Personil 5</Th>

                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataPerjalanan?.map((item, index) => (
                    <Tr key={item?.id || index}>
                      <Td maxWidth={"20px"}>{index + 1}</Td>
                      <Td>
                        {item?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas
                          ?.kodeInduk || "-"}
                      </Td>
                      <Td>
                        <Box>
                          {item?.noSuratTugas && (
                            <Box mb={item?.suratKeluar?.nomor ? "8px" : "0"}>
                              <Text fontSize={"xs"} color={"gray.600"}>
                                Surat Tugas:
                              </Text>
                              <Text fontWeight={"medium"}>
                                {item?.noSuratTugas || "-"}
                              </Text>
                            </Box>
                          )}
                          {item?.suratKeluar?.nomor ? (
                            <Box>
                              <Text fontSize={"xs"} color={"gray.600"}>
                                {item?.isNotaDinas === 0
                                  ? "Telaahan Staf:"
                                  : "Nota Dinas:"}
                              </Text>
                              <Text fontWeight={"medium"}>
                                {item?.suratKeluar?.nomor || "-"}
                              </Text>
                            </Box>
                          ) : (
                            !item?.noSuratTugas && <Text>-</Text>
                          )}
                        </Box>
                      </Td>
                      <Td>
                        {item?.tempats?.[0]?.tanggalBerangkat
                          ? new Date(
                              item?.tempats?.[0]?.tanggalBerangkat
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </Td>
                      <Td>
                        {item?.tempats?.[item?.tempats?.length - 1]
                          ?.tanggalPulang
                          ? new Date(
                              item?.tempats?.[
                                item?.tempats?.length - 1
                              ]?.tanggalPulang
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </Td>
                      <Td>
                        <Box>
                          <Box mb={item?.tempats?.length > 0 ? "8px" : "0"}>
                            <Text fontSize={"xs"} color={"gray.600"}>
                              Jenis:
                            </Text>
                            <Text fontWeight={"medium"}>
                              {item?.jenisPerjalanan?.jenis || "-"}
                            </Text>
                          </Box>
                          {item?.tempats?.length > 0 && (
                            <Box>
                              <Text fontSize={"xs"} color={"gray.600"}>
                                Tujuan:
                              </Text>
                              {item?.jenisPerjalanan?.tipePerjalanan?.id === 1
                                ? item?.tempats?.map((val) => (
                                    <Text
                                      key={val?.id || Math.random()}
                                      fontWeight={"medium"}
                                    >
                                      {val?.dalamKota?.nama || "-"}
                                    </Text>
                                  ))
                                : item?.tempats?.map((val) => (
                                    <Text
                                      key={val?.id || Math.random()}
                                      fontWeight={"medium"}
                                    >
                                      {val?.tempat || "-"}
                                    </Text>
                                  ))}
                            </Box>
                          )}
                        </Box>
                      </Td>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Td key={i}>
                          <Tooltip
                            label={
                              item?.personils?.[i]?.status?.statusKuitansi ||
                              "-"
                            }
                            aria-label="A tooltip"
                            bgColor={
                              item?.personils?.[i]?.statusId === 1
                                ? "gelap"
                                : item?.personils?.[i]?.statusId === 2
                                ? "ungu"
                                : item?.personils?.[i]?.statusId === 3
                                ? "primary"
                                : item?.personils?.[i]?.statusId === 4
                                ? "danger"
                                : null
                            }
                          >
                            <Badge
                              display={"flex"}
                              alignItems={"center"}
                              gap={"1px"}
                              px={"8px"}
                              py={"3px"}
                              maxW={"250px"}
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                              whiteSpace={"nowrap"}
                              borderRadius={"md"}
                              textTransform={"none"}
                              bgColor={
                                item?.personils?.[i]?.statusId === 1
                                  ? "gelap"
                                  : item?.personils?.[i]?.statusId === 2
                                  ? "ungu"
                                  : item?.personils?.[i]?.statusId === 3
                                  ? "primary"
                                  : item?.personils?.[i]?.statusId === 4
                                  ? "danger"
                                  : "gray.200"
                              }
                              color={
                                item?.personils?.[i]?.statusId === 1 ||
                                item?.personils?.[i]?.statusId === 2 ||
                                item?.personils?.[i]?.statusId === 3 ||
                                item?.personils?.[i]?.statusId === 4
                                  ? "white"
                                  : "gray.700"
                              }
                            >
                              {item?.personils?.[i]?.pegawai?.nama || "-"}
                            </Badge>
                          </Tooltip>
                        </Td>
                      ))}
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<BsThreeDotsVertical />}
                            variant="ghost"
                            size="sm"
                            aria-label="Menu aksi"
                          />
                          <MenuList>
                            {item?.noSuratTugas && (
                              <MenuItem
                                icon={<BsEyeFill />}
                                onClick={() =>
                                  history.push(
                                    `/detail-perjalanan/${item?.id || ""}`
                                  )
                                }
                              >
                                Lihat Detail
                              </MenuItem>
                            )}
                            <MenuItem
                              icon={<BsFileEarmarkArrowDown />}
                              onClick={() => postSuratTugas(item)}
                            >
                              Cetak Surat Tugas
                            </MenuItem>

                            <MenuItem
                              icon={<BsFileEarmarkArrowDown />}
                              onClick={() => postSPD(item)}
                            >
                              Cetak Surat Perjalanan Dinas
                            </MenuItem>
                            <MenuItem
                              icon={<BsFileEarmarkArrowDown />}
                              onClick={() => postNotaDinas(item)}
                            >
                              Cetak Nota Dinas
                            </MenuItem>
                            {!item?.personils?.some(
                              (p) => p?.statusId === 2 || p?.statusId === 3
                            ) && (
                              <MenuItem
                                onClick={() => {
                                  setSelectedPerjalanan(item?.id || 0);
                                  onOpen();
                                }}
                                color="red.500"
                              >
                                Hapus
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Konfirmasi Hapus</ModalHeader>
                  <ModalCloseButton />

                  <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="red"
                      mr={3}
                      onClick={() => hapusPerjalanan(selectedPerjalanan)}
                    >
                      Ya, Hapus
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Batal
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </Box>
        ) : (
          <DataKosong />
        )}
      </Layout>
    </>
  );
}

export default Daftar;
