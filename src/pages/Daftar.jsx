import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../Style/pagination.css";
import AppPagination from "../Componets/AppPagination";
import { useHistory } from "react-router-dom";
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
  ModalCloseButton,
  FormControl,
  FormLabel,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Grid,
  useToast,
  useDisclosure,
  useColorMode,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Heading,
  VStack,
  Skeleton,
  Checkbox,
} from "@chakra-ui/react";
import {
  BsEyeFill,
  BsX,
  BsSearch,
  BsPrinter,
  BsTrash,
  BsChevronDown,
  BsListUl,
  BsCalendar3,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";
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

const STATUS_PERSONIL = {
  1: {
    label: "SPD & Surat Tugas dibuat",
    dot: "#3B82F6",
    bg: "#EFF6FF",
    color: "#1D4ED8",
  },
  2: {
    label: "Pengajuan kuitansi",
    dot: "#F59E0B",
    bg: "#FFF7ED",
    color: "#C2410C",
  },
  3: {
    label: "Kuitansi tervierifikasi",
    dot: "#16A34A",
    bg: "#F0FDF4",
    color: "#15803D",
  },
  4: {
    label: "Kuitansi ditolak",
    dot: "#EF4444",
    bg: "#FEF2F2",
    color: "#B91C1C",
  },
};

function gayaStatus(statusId) {
  return (
    STATUS_PERSONIL[statusId] || {
      label: "Draft — SPD belum dibuat",
      dot: "#9CA3AF",
      bg: "#F3F4F6",
      color: "#4B5563",
    }
  );
}

function gayaTipe(item) {
  const tipeId = item?.jenisPerjalanan?.tipePerjalanan?.id;
  const label =
    item?.jenisPerjalanan?.tipePerjalanan?.tipe ||
    item?.jenisPerjalanan?.jenis ||
    "-";
  if (tipeId === 1) {
    return { label, bg: "#ECFDF3", color: "#067647" };
  }
  if (tipeId === 2) {
    return { label, bg: "#EFF8FF", color: "#175CD3" };
  }
  return { label, bg: "#F2F4F7", color: "#344054" };
}

function daftarTujuan(item) {
  const dalamDaerah = item?.jenisPerjalanan?.tipePerjalanan?.id === 1;
  return (item?.tempats || [])
    .map((tempat) => (dalamDaerah ? tempat?.dalamKota?.nama : tempat?.tempat))
    .filter(Boolean);
}

function formatTanggalSingkat(nilai) {
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "-";
  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatJadwal(mulai, selesai) {
  if (!mulai) return "-";
  const awal = new Date(mulai);
  const akhir = selesai ? new Date(selesai) : null;
  if (Number.isNaN(awal.getTime())) return "-";
  if (
    !akhir ||
    Number.isNaN(akhir.getTime()) ||
    awal.toDateString() === akhir.toDateString()
  ) {
    return formatTanggalSingkat(awal);
  }

  const bulanAwal = awal.toLocaleDateString("id-ID", { month: "short" });
  const bulanAkhir = akhir.toLocaleDateString("id-ID", { month: "short" });
  if (
    awal.getFullYear() === akhir.getFullYear() &&
    awal.getMonth() === akhir.getMonth()
  ) {
    return `${awal.getDate()}–${akhir.getDate()} ${bulanAwal} ${awal.getFullYear()}`;
  }
  if (awal.getFullYear() === akhir.getFullYear()) {
    return `${awal.getDate()} ${bulanAwal} – ${akhir.getDate()} ${bulanAkhir} ${awal.getFullYear()}`;
  }
  return `${formatTanggalSingkat(awal)} – ${formatTanggalSingkat(akhir)}`;
}

function hitungDurasi(mulai, selesai) {
  if (!mulai) return null;
  const awal = new Date(mulai);
  const akhir = selesai ? new Date(selesai) : new Date(mulai);
  if (Number.isNaN(awal.getTime()) || Number.isNaN(akhir.getTime()))
    return null;
  const hari =
    Math.round(
      (new Date(akhir).setHours(0, 0, 0, 0) -
        new Date(awal).setHours(0, 0, 0, 0)) /
        86400000,
    ) + 1;
  if (!Number.isFinite(hari) || hari < 1) return null;
  return `${hari} hari`;
}

function KalenderPerjalanan({ events, colorMode, formats, localizer }) {
  return (
    <Box
      bg={colorMode === "dark" ? "gray.800" : "white"}
      p={{ base: "20px", md: "30px" }}
      borderRadius={"10px"}
      mb={"30px"}
      boxShadow="sm"
      border="1px solid"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
    >
      <Heading
        size="md"
        mb={4}
        color={colorMode === "dark" ? "white" : "gray.700"}
      >
        Kalender Perjalanan Dinas
      </Heading>
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
          cursor: pointer;
        }
        .rbc-header {
          padding: 10px 3px;
          font-weight: 600;
        }
        .rbc-today {
          background-color: rgba(55, 176, 134, 0.1) !important;
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [selectedPerjalanan, setSelectedPerjalanan] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCetakSPD,
    onOpen: onOpenCetakSPD,
    onClose: onCloseCetakSPD,
  } = useDisclosure();
  const [selectedPerjalananSPD, setSelectedPerjalananSPD] = useState(null);
  const [jenisKendaraan, setJenisKendaraan] = useState({
    darat: true,
    laut: false,
    udara: false,
  });
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [kataCari, setKataCari] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [tampilan, setTampilan] = useState("daftar");

  const resetFilter = () => {
    setTanggalAwal("");
    setTanggalAkhir("");
    setKataCari("");
    setJenisFilter("");
  };

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
          penomoran: user[0]?.unitKerja_profile?.indukUnitKerja?.penomoran,
          tanggalPengajuan: val?.tanggalPengajuan || "",
          noSurTug: val?.noSuratTugas || "",
          noNotDis: val?.noNotaDinas || "",
          isSrikandi: val?.tipeSrikandi,
          isNotaDinas: val?.isNotaDinas,
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
        },
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
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perjalanan/delete/${e}`,
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
          tipeSrikandi: val?.tipeSrikandi,
          penomoran: user[0]?.unitKerja_profile?.indukUnitKerja?.penomoran,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        },
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
          }_${Date.now()}.docx`,
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

  const handleCetakSPD = () => {
    if (!selectedPerjalananSPD) return;

    // Mengumpulkan jenis kendaraan yang dipilih
    const kendaraanTerpilih = [];
    if (jenisKendaraan.darat) kendaraanTerpilih.push(1);
    if (jenisKendaraan.laut) kendaraanTerpilih.push(2);
    if (jenisKendaraan.udara) kendaraanTerpilih.push(3);

    // Jika tidak ada yang dipilih, default ke darat
    if (kendaraanTerpilih.length === 0) {
      kendaraanTerpilih.push(1);
    }

    postSPD(selectedPerjalananSPD, kendaraanTerpilih);
    handleTutupModalCetakSPD();
  };

  const handleBukaModalCetakSPD = (item) => {
    setSelectedPerjalananSPD(item);
    // Reset checkbox ke default
    setJenisKendaraan({
      darat: true,
      laut: false,
      udara: false,
    });
    onOpenCetakSPD();
  };

  const handleTutupModalCetakSPD = () => {
    setSelectedPerjalananSPD(null);
    // Reset checkbox ke default
    setJenisKendaraan({
      darat: true,
      laut: false,
      udara: false,
    });
    onCloseCetakSPD();
  };

  const postSPD = (val, kendaraanTerpilih = [1]) => {
    console.log(val?.personils);
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
          jenisKendaraan: kendaraanTerpilih,
          penomoran: user[0]?.unitKerja_profile?.indukUnitKerja?.penomoran,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        },
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
          }_${Date.now()}.docx`,
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
        },
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
    setIsLoadingData(true);

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/all-perjalanan?&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id || ""
        }&tanggalBerangkat=${tanggalAwal}&tanggalPulang=${tanggalAkhir}`,
      );
      setDataPerjalanan(res?.data?.result || []);
      setPage(res?.data?.page || 0);
      setPages(res?.data?.totalPage || 0);
      setRows(res?.data?.totalRows || 0);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setDataPerjalanan([]);
      setPage(0);
      setPages(0);
      setRows(0);
      toast({
        title: "Error",
        description: "Gagal memuat data perjalanan dinas",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page, tanggalAkhir, tanggalAwal]);

  const dataTampil = useMemo(() => {
    const kata = kataCari.trim().toLowerCase();
    return (dataPerjalanan || []).filter((item) => {
      if (
        jenisFilter &&
        String(item?.jenisPerjalanan?.id || "") !== String(jenisFilter)
      ) {
        return false;
      }
      if (!kata) return true;

      const tujuan = daftarTujuan(item).join(" ");
      const namaPersonil = (item?.personils || [])
        .map((personil) => personil?.pegawai?.nama)
        .filter(Boolean)
        .join(" ");
      const dokumen = [
        item?.noSuratTugas,
        item?.suratKeluar?.nomor,
        item?.noNotaDinas,
        item?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas?.kodeInduk,
        item?.jenisPerjalanan?.jenis,
        item?.jenisPerjalanan?.tipePerjalanan?.tipe,
      ]
        .filter(Boolean)
        .join(" ");

      return `${tujuan} ${namaPersonil} ${dokumen}`
        .toLowerCase()
        .includes(kata);
    });
  }, [dataPerjalanan, kataCari, jenisFilter]);

  const opsiJenis = useMemo(() => {
    const unik = new Map();
    (dataPerjalanan || []).forEach((item) => {
      const id = item?.jenisPerjalanan?.id;
      const nama = item?.jenisPerjalanan?.jenis;
      if (id && nama && !unik.has(String(id))) {
        unik.set(String(id), nama);
      }
    });
    return Array.from(unik, ([id, nama]) => ({ id, nama }));
  }, [dataPerjalanan]);

  const adaFilter = Boolean(
    kataCari || jenisFilter || tanggalAwal || tanggalAkhir,
  );

  // Mapping dataPerjalanan ke events untuk kalender, setiap personil jadi event terpisah
  const events = (dataTampil || []).flatMap((item) => {
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
        <Box
          bg={colorMode === "dark" ? "gray.900" : "#F5F7FB"}
          pb={{ base: "30px", md: "40px" }}
          px={{ base: "16px", md: "28px" }}
          pt={{ base: "20px", md: "28px" }}
          minH="100vh"
        >
          {isLoadingData ? (
            <Box>
              <Skeleton height="28px" width="280px" mb={3} />
              <Skeleton height="16px" width="420px" mb={6} />
              <Skeleton height="92px" borderRadius="xl" mb={4} />
              <Skeleton height="420px" borderRadius="xl" />
            </Box>
          ) : (
            <>
              <Flex
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
                align={{ base: "stretch", lg: "flex-start" }}
                gap={4}
                mb={5}
              >
                <Box>
                  <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={colorMode === "dark" ? "white" : "gray.900"}
                    letterSpacing="-0.02em"
                  >
                    Daftar Perjalanan Dinas
                  </Heading>
                  <Text
                    mt={1}
                    fontSize="sm"
                    color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  >
                    {rows} perjalanan tercatat. Pilih salah satu untuk melihat
                    detail, personil, dan biaya.
                  </Text>
                </Box>
                <HStack
                  spacing={2}
                  alignSelf={{ base: "stretch", lg: "center" }}
                  bg={colorMode === "dark" ? "gray.800" : "transparent"}
                  p={colorMode === "dark" ? 1 : 0}
                  borderRadius="xl"
                >
                  <Button
                    size="sm"
                    leftIcon={<BsListUl />}
                    onClick={() => setTampilan("daftar")}
                    bg={
                      tampilan === "daftar"
                        ? colorMode === "dark"
                          ? "gray.700"
                          : "white"
                        : colorMode === "dark"
                          ? "transparent"
                          : "white"
                    }
                    color={
                      tampilan === "daftar"
                        ? colorMode === "dark"
                          ? "white"
                          : "gray.800"
                        : "gray.500"
                    }
                    border="1px solid"
                    borderColor={
                      tampilan === "daftar"
                        ? colorMode === "dark"
                          ? "gray.600"
                          : "gray.200"
                        : colorMode === "dark"
                          ? "gray.700"
                          : "gray.200"
                    }
                    boxShadow={tampilan === "daftar" ? "sm" : "none"}
                    borderRadius="lg"
                    fontWeight="semibold"
                    px={4}
                    _hover={{ bg: colorMode === "dark" ? "gray.700" : "white" }}
                  >
                    Daftar
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<BsCalendar3 />}
                    onClick={() => setTampilan("kalender")}
                    bg={
                      tampilan === "kalender"
                        ? colorMode === "dark"
                          ? "gray.700"
                          : "white"
                        : colorMode === "dark"
                          ? "transparent"
                          : "white"
                    }
                    color={
                      tampilan === "kalender"
                        ? colorMode === "dark"
                          ? "white"
                          : "gray.800"
                        : "gray.500"
                    }
                    border="1px solid"
                    borderColor={
                      tampilan === "kalender"
                        ? colorMode === "dark"
                          ? "gray.600"
                          : "gray.200"
                        : colorMode === "dark"
                          ? "gray.700"
                          : "gray.200"
                    }
                    boxShadow={tampilan === "kalender" ? "sm" : "none"}
                    borderRadius="lg"
                    fontWeight="semibold"
                    px={4}
                    _hover={{ bg: colorMode === "dark" ? "gray.700" : "white" }}
                  >
                    Kalender
                  </Button>
                </HStack>
              </Flex>

              <Box
                bg={colorMode === "dark" ? "gray.800" : "white"}
                border="1px solid"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                borderRadius="xl"
                boxShadow="sm"
                p={{ base: 4, md: 5 }}
                mb={4}
              >
                <Grid
                  templateColumns={{
                    base: "1fr",
                    lg: adaFilter
                      ? "minmax(220px, 1.6fr) minmax(160px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) auto"
                      : "minmax(220px, 1.6fr) minmax(160px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr)",
                  }}
                  gap={4}
                  alignItems="end"
                >
                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="medium"
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      mb={1.5}
                    >
                      Cari
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" h="40px">
                        <BsSearch color="#98A2B3" />
                      </InputLeftElement>
                      <Input
                        value={kataCari}
                        onChange={(e) => setKataCari(e.target.value)}
                        placeholder="Tujuan, nomor surat, atau nama personil"
                        h="40px"
                        pl={10}
                        bg={colorMode === "dark" ? "gray.900" : "white"}
                        borderColor={
                          colorMode === "dark" ? "gray.600" : "gray.200"
                        }
                        borderRadius="lg"
                        fontSize="sm"
                        _placeholder={{ color: "gray.400" }}
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "primary",
                          boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="medium"
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      mb={1.5}
                    >
                      Jenis perjalanan
                    </FormLabel>
                    <Select
                      value={jenisFilter}
                      onChange={(e) => setJenisFilter(e.target.value)}
                      h="40px"
                      bg={colorMode === "dark" ? "gray.900" : "white"}
                      borderColor={
                        colorMode === "dark" ? "gray.600" : "gray.200"
                      }
                      borderRadius="lg"
                      fontSize="sm"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "primary",
                        boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
                      }}
                    >
                      <option value="">Semua jenis</option>
                      {opsiJenis.map((jenis) => (
                        <option key={jenis.id} value={jenis.id}>
                          {jenis.nama}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="medium"
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      mb={1.5}
                    >
                      Berangkat dari
                    </FormLabel>
                    <Input
                      type="date"
                      value={tanggalAwal}
                      onChange={(e) => {
                        setPage(0);
                        setTanggalAwal(e.target.value);
                      }}
                      h="40px"
                      bg={colorMode === "dark" ? "gray.900" : "white"}
                      borderColor={
                        colorMode === "dark" ? "gray.600" : "gray.200"
                      }
                      borderRadius="lg"
                      fontSize="sm"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "primary",
                        boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="medium"
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      mb={1.5}
                    >
                      Pulang sampai
                    </FormLabel>
                    <Input
                      type="date"
                      value={tanggalAkhir}
                      onChange={(e) => {
                        setPage(0);
                        setTanggalAkhir(e.target.value);
                      }}
                      h="40px"
                      bg={colorMode === "dark" ? "gray.900" : "white"}
                      borderColor={
                        colorMode === "dark" ? "gray.600" : "gray.200"
                      }
                      borderRadius="lg"
                      fontSize="sm"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "primary",
                        boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
                      }}
                    />
                  </FormControl>
                  {adaFilter && (
                    <Button
                      leftIcon={<BsX />}
                      onClick={resetFilter}
                      variant="outline"
                      h="40px"
                      borderRadius="lg"
                      fontWeight="medium"
                    >
                      Reset
                    </Button>
                  )}
                </Grid>
              </Box>

              {tampilan === "kalender" ? (
                <KalenderPerjalanan
                  events={events}
                  colorMode={colorMode}
                  formats={formats}
                  localizer={localizer}
                />
              ) : (
                <>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    gap={3}
                    mb={3}
                    px={1}
                  >
                    <HStack spacing={4} wrap="wrap">
                      <HStack spacing={2}>
                        <Box
                          w="8px"
                          h="8px"
                          borderRadius="full"
                          bg="#9CA3AF"
                          flexShrink={0}
                        />
                        <Text
                          fontSize="xs"
                          color={colorMode === "dark" ? "gray.400" : "gray.600"}
                        >
                          Draft — SPD belum dibuat
                        </Text>
                      </HStack>
                      {Object.values(STATUS_PERSONIL).map((status) => (
                        <HStack key={status.label} spacing={2}>
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={status.dot}
                            flexShrink={0}
                          />
                          <Text
                            fontSize="xs"
                            color={
                              colorMode === "dark" ? "gray.400" : "gray.600"
                            }
                          >
                            {status.label}
                          </Text>
                        </HStack>
                      ))}
                    </HStack>
                    <Text
                      fontSize="sm"
                      color={colorMode === "dark" ? "gray.400" : "gray.500"}
                      whiteSpace="nowrap"
                    >
                      Menampilkan {dataTampil.length} dari {rows} perjalanan
                    </Text>
                  </Flex>

                  <Box
                    bg={colorMode === "dark" ? "gray.800" : "white"}
                    border="1px solid"
                    borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                    borderRadius="xl"
                    boxShadow="sm"
                    overflowX="auto"
                  >
                    <Table variant="unstyled" minW="980px">
                      <Thead>
                        <Tr>
                          {["No", "Tujuan", "Jadwal", "Personil", "Dokumen", "Aksi"].map(
                            (kolom) => (
                              <Th
                                key={kolom}
                                fontSize="sm"
                                fontWeight="medium"
                                color={
                                  colorMode === "dark" ? "gray.400" : "gray.500"
                                }
                                textTransform="none"
                                letterSpacing="normal"
                                py={4}
                                px={4}
                                borderBottom="1px solid"
                                borderColor={
                                  colorMode === "dark" ? "gray.700" : "gray.100"
                                }
                              >
                                {kolom}
                              </Th>
                            ),
                          )}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {dataTampil.length === 0 ? (
                          <Tr>
                            <Td colSpan={6} py={10}>
                              <Text
                                textAlign="center"
                                color={
                                  colorMode === "dark" ? "gray.400" : "gray.500"
                                }
                              >
                                {adaFilter
                                  ? "Tidak ada perjalanan yang cocok dengan filter."
                                  : "Belum ada perjalanan dinas."}
                              </Text>
                            </Td>
                          </Tr>
                        ) : (
                          dataTampil.map((item, index) => {
                            const tujuan = daftarTujuan(item);
                            const mulai = item?.tempats?.[0]?.tanggalBerangkat;
                            const selesai =
                              item?.tempats?.[item?.tempats?.length - 1]
                                ?.tanggalPulang;
                            const tipe = gayaTipe(item);
                            const kodeUnit =
                              item?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas
                                ?.kodeInduk;
                            const bisaHapus = !item?.personils?.some(
                              (personil) =>
                                personil?.statusId === 2 ||
                                personil?.statusId === 3,
                            );
                            const nomor =
                              kataCari || jenisFilter
                                ? index + 1
                                : index + 1 + page * limit;

                            return (
                              <Tr
                                key={item?.id || index}
                                _hover={{
                                  bg:
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50",
                                }}
                              >
                                <Td
                                  py={4}
                                  px={4}
                                  color={
                                    colorMode === "dark"
                                      ? "gray.300"
                                      : "gray.600"
                                  }
                                  borderBottom="1px solid"
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.100"
                                  }
                                  verticalAlign="top"
                                >
                                  {nomor}
                                </Td>
                                <Td
                                  py={4}
                                  px={4}
                                  borderBottom="1px solid"
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.100"
                                  }
                                  verticalAlign="top"
                                  minW="180px"
                                >
                                  <Text
                                    fontWeight="semibold"
                                    color={
                                      colorMode === "dark"
                                        ? "white"
                                        : "gray.800"
                                    }
                                  >
                                    {tujuan[0] || "-"}
                                  </Text>
                                  {tujuan.slice(1).map((nama, urutan) => (
                                    <Text
                                      key={`${nama}-${urutan}`}
                                      fontWeight="medium"
                                      fontSize="sm"
                                      color={
                                        colorMode === "dark"
                                          ? "gray.200"
                                          : "gray.700"
                                      }
                                    >
                                      {nama}
                                    </Text>
                                  ))}
                                  <HStack mt={2} spacing={2} align="center">
                                    <Tooltip
                                      label={
                                        item?.jenisPerjalanan?.jenis || tipe.label
                                      }
                                      hasArrow
                                    >
                                      <Badge
                                        bg={tipe.bg}
                                        color={tipe.color}
                                        px={2}
                                        py={0.5}
                                        borderRadius="md"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        textTransform="none"
                                      >
                                        {tipe.label}
                                      </Badge>
                                    </Tooltip>
                                  </HStack>
                                  {item?.jenisPerjalanan?.jenis &&
                                    item.jenisPerjalanan.jenis !== tipe.label && (
                                      <Text
                                        mt={1}
                                        fontSize="xs"
                                        color={
                                          colorMode === "dark"
                                            ? "gray.400"
                                            : "gray.500"
                                        }
                                      >
                                        {item.jenisPerjalanan.jenis}
                                      </Text>
                                    )}
                                </Td>
                                <Td
                                  py={4}
                                  px={4}
                                  borderBottom="1px solid"
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.100"
                                  }
                                  verticalAlign="top"
                                  whiteSpace="nowrap"
                                >
                                  <Tooltip
                                    label={`Berangkat ${
                                      mulai
                                        ? formatTanggalSingkat(mulai)
                                        : "-"
                                    } · Pulang ${
                                      selesai
                                        ? formatTanggalSingkat(selesai)
                                        : "-"
                                    }`}
                                    hasArrow
                                  >
                                    <Box>
                                      <Text
                                        fontWeight="medium"
                                        color={
                                          colorMode === "dark"
                                            ? "gray.100"
                                            : "gray.800"
                                        }
                                      >
                                        {formatJadwal(mulai, selesai)}
                                      </Text>
                                      {hitungDurasi(mulai, selesai) && (
                                        <Text
                                          fontSize="sm"
                                          color={
                                            colorMode === "dark"
                                              ? "gray.400"
                                              : "gray.500"
                                          }
                                        >
                                          {hitungDurasi(mulai, selesai)}
                                        </Text>
                                      )}
                                    </Box>
                                  </Tooltip>
                                </Td>
                                <Td
                                  py={4}
                                  px={4}
                                  borderBottom="1px solid"
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.100"
                                  }
                                  verticalAlign="top"
                                  maxW="320px"
                                >
                                  {(item?.personils || []).length === 0 ? (
                                    <Text fontSize="sm" color="gray.400">
                                      -
                                    </Text>
                                  ) : (
                                    <Flex wrap="wrap" gap={2}>
                                      {item.personils.map((personil, urutan) => {
                                        const gaya = gayaStatus(
                                          personil?.statusId,
                                        );
                                        return (
                                          <Tooltip
                                            key={
                                              personil?.id ||
                                              personil?.pegawai?.id ||
                                              urutan
                                            }
                                            label={
                                              personil?.status?.statusKuitansi ||
                                              gaya.label
                                            }
                                            hasArrow
                                            bg={gaya.dot}
                                          >
                                            <Badge
                                              bg={gaya.bg}
                                              color={gaya.color}
                                              px={2.5}
                                              py={1}
                                              borderRadius="full"
                                              fontSize="xs"
                                              fontWeight="medium"
                                              textTransform="none"
                                              cursor="help"
                                            >
                                              {personil?.pegawai?.nama || "-"}
                                            </Badge>
                                          </Tooltip>
                                        );
                                      })}
                                    </Flex>
                                  )}
                                </Td>
                                <Td
                                  py={4}
                                  px={4}
                                  borderBottom="1px solid"
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.100"
                                  }
                                  verticalAlign="top"
                                  minW="240px"
                                >
                                  <VStack align="start" spacing={1}>
                                    {item?.noSuratTugas && (
                                      <Text
                                        fontSize="xs"
                                        color={
                                          colorMode === "dark"
                                            ? "gray.400"
                                            : "gray.500"
                                        }
                                      >
                                        <Text
                                          as="span"
                                          fontWeight="semibold"
                                          color={
                                            colorMode === "dark"
                                              ? "gray.300"
                                              : "gray.600"
                                          }
                                        >
                                          ST
                                        </Text>{" "}
                                        {item.noSuratTugas}
                                      </Text>
                                    )}
                                    {item?.suratKeluar?.nomor && (
                                      <Text
                                        fontSize="xs"
                                        color={
                                          colorMode === "dark"
                                            ? "gray.400"
                                            : "gray.500"
                                        }
                                      >
                                        <Text
                                          as="span"
                                          fontWeight="semibold"
                                          color={
                                            colorMode === "dark"
                                              ? "gray.300"
                                              : "gray.600"
                                          }
                                        >
                                          {item?.isNotaDinas === 0
                                            ? "Telaahan"
                                            : "ND"}
                                        </Text>{" "}
                                        {item.suratKeluar.nomor}
                                      </Text>
                                    )}
                                    {kodeUnit && (
                                      <Text
                                        fontSize="xs"
                                        color={
                                          colorMode === "dark"
                                            ? "gray.500"
                                            : "gray.400"
                                        }
                                      >
                                        Unit kerja {kodeUnit}
                                      </Text>
                                    )}
                                    {!item?.noSuratTugas &&
                                      !item?.suratKeluar?.nomor &&
                                      !kodeUnit && (
                                        <Text fontSize="sm" color="gray.400">
                                          -
                                        </Text>
                                      )}
                                  </VStack>
                                </Td>
                                <Td
                                  py={4}
                                  px={4}
                                  borderBottom="1px solid"
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.100"
                                  }
                                  verticalAlign="top"
                                >
                                  <HStack spacing={2}>
                                    {item?.noSuratTugas && (
                                      <Button
                                        size="sm"
                                        leftIcon={<BsEyeFill />}
                                        bg="primary"
                                        color="white"
                                        borderRadius="lg"
                                        fontWeight="semibold"
                                        _hover={{ bg: "primaryGelap" }}
                                        onClick={() =>
                                          history.push(
                                            `/detail-perjalanan/${item?.id || ""}`,
                                          )
                                        }
                                      >
                                        Detail
                                      </Button>
                                    )}
                                    <Menu placement="bottom-end" strategy="fixed">
                                      <MenuButton
                                        as={Button}
                                        size="sm"
                                        variant="outline"
                                        leftIcon={<BsPrinter />}
                                        rightIcon={<BsChevronDown />}
                                        borderRadius="lg"
                                        fontWeight="medium"
                                        bg={
                                          colorMode === "dark"
                                            ? "gray.800"
                                            : "white"
                                        }
                                        borderColor={
                                          colorMode === "dark"
                                            ? "gray.600"
                                            : "gray.200"
                                        }
                                      >
                                        Cetak
                                      </MenuButton>
                                      <MenuList
                                        zIndex={9999}
                                        bg={
                                          colorMode === "dark"
                                            ? "gray.800"
                                            : "white"
                                        }
                                        borderColor={
                                          colorMode === "dark"
                                            ? "gray.700"
                                            : "gray.200"
                                        }
                                      >
                                        <MenuItem
                                          icon={<BsFileEarmarkArrowDown />}
                                          onClick={() => postSuratTugas(item)}
                                        >
                                          Cetak Surat Tugas
                                        </MenuItem>
                                        <MenuItem
                                          icon={<BsFileEarmarkArrowDown />}
                                          onClick={() =>
                                            handleBukaModalCetakSPD(item)
                                          }
                                        >
                                          Cetak Surat Perjalanan Dinas
                                        </MenuItem>
                                        <MenuItem
                                          icon={<BsFileEarmarkArrowDown />}
                                          onClick={() => postNotaDinas(item)}
                                        >
                                          Cetak Nota Dinas
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                    {bisaHapus && (
                                      <Tooltip label="Hapus" hasArrow>
                                        <IconButton
                                          aria-label="Hapus perjalanan"
                                          icon={<BsTrash />}
                                          size="sm"
                                          variant="ghost"
                                          color="gray.500"
                                          borderRadius="lg"
                                          _hover={{
                                            color: "red.500",
                                            bg: "red.50",
                                          }}
                                          onClick={() => {
                                            setSelectedPerjalanan(item?.id || 0);
                                            onOpen();
                                          }}
                                        />
                                      </Tooltip>
                                    )}
                                  </HStack>
                                </Td>
                              </Tr>
                            );
                          })
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                  <Flex justify="center" mt={6}>
                    <AppPagination
                      page={page}
                      pageCount={pages}
                      onPageChange={changePage}
                    />
                  </Flex>
                </>
              )}
            </>
          )}
            {/* Modal Konfirmasi Hapus */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
              <ModalContent
                bg={colorMode === "dark" ? "gray.800" : "white"}
                borderRadius="10px"
              >
                <ModalHeader
                  color={colorMode === "dark" ? "white" : "gray.700"}
                  borderBottom="1px solid"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  pb={4}
                >
                  Konfirmasi Hapus
                </ModalHeader>
                <ModalCloseButton
                  color={colorMode === "dark" ? "white" : "gray.700"}
                />
                <ModalBody py={6}>
                  <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                    Apakah Anda yakin ingin menghapus data perjalanan dinas ini?
                    Tindakan ini tidak dapat dibatalkan.
                  </Text>
                </ModalBody>
                <ModalFooter
                  borderTop="1px solid"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  pt={4}
                >
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Batal
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => hapusPerjalanan(selectedPerjalanan)}
                    _hover={{
                      bg: "red.600",
                    }}
                  >
                    Ya, Hapus
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Modal Pilih Jenis Kendaraan untuk Cetak SPD */}
            <Modal
              isOpen={isOpenCetakSPD}
              onClose={handleTutupModalCetakSPD}
              isCentered
            >
              <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
              <ModalContent
                bg={colorMode === "dark" ? "gray.800" : "white"}
                borderRadius="10px"
              >
                <ModalHeader
                  color={colorMode === "dark" ? "white" : "gray.700"}
                  borderBottom="1px solid"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  pb={4}
                >
                  Pilih Jenis Kendaraan
                </ModalHeader>
                <ModalCloseButton
                  color={colorMode === "dark" ? "white" : "gray.700"}
                />
                <ModalBody py={6}>
                  <VStack align="stretch" spacing={4}>
                    <Text
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      mb={2}
                    >
                      Pilih jenis kendaraan yang digunakan untuk perjalanan
                      dinas:
                    </Text>
                    <FormControl>
                      <Checkbox
                        isChecked={jenisKendaraan.darat}
                        onChange={(e) =>
                          setJenisKendaraan({
                            ...jenisKendaraan,
                            darat: e.target.checked,
                          })
                        }
                        size="lg"
                        sx={{
                          "& .chakra-checkbox__control": {
                            borderColor: "primary.500",
                            _checked: {
                              bg: "primary.500",
                              borderColor: "primary.500",
                              _hover: {
                                bg: "primary.600",
                                borderColor: "primary.600",
                              },
                            },
                            _hover: {
                              borderColor: "primary.400",
                            },
                          },
                        }}
                      >
                        <Text
                          color={colorMode === "dark" ? "white" : "gray.700"}
                          fontSize="md"
                          fontWeight="medium"
                        >
                          Kendaraan Darat
                        </Text>
                      </Checkbox>
                    </FormControl>
                    <FormControl>
                      <Checkbox
                        isChecked={jenisKendaraan.laut}
                        onChange={(e) =>
                          setJenisKendaraan({
                            ...jenisKendaraan,
                            laut: e.target.checked,
                          })
                        }
                        size="lg"
                        sx={{
                          "& .chakra-checkbox__control": {
                            borderColor: "primary.500",
                            _checked: {
                              bg: "primary.500",
                              borderColor: "primary.500",
                              _hover: {
                                bg: "primary.600",
                                borderColor: "primary.600",
                              },
                            },
                            _hover: {
                              borderColor: "primary.400",
                            },
                          },
                        }}
                      >
                        <Text
                          color={colorMode === "dark" ? "white" : "gray.700"}
                          fontSize="md"
                          fontWeight="medium"
                        >
                          Kendaraan Laut
                        </Text>
                      </Checkbox>
                    </FormControl>
                    <FormControl>
                      <Checkbox
                        isChecked={jenisKendaraan.udara}
                        onChange={(e) =>
                          setJenisKendaraan({
                            ...jenisKendaraan,
                            udara: e.target.checked,
                          })
                        }
                        size="lg"
                        sx={{
                          "& .chakra-checkbox__control": {
                            borderColor: "primary.500",
                            _checked: {
                              bg: "primary.500",
                              borderColor: "primary.500",
                              _hover: {
                                bg: "primary.600",
                                borderColor: "primary.600",
                              },
                            },
                            _hover: {
                              borderColor: "primary.400",
                            },
                          },
                        }}
                      >
                        <Text
                          color={colorMode === "dark" ? "white" : "gray.700"}
                          fontSize="md"
                          fontWeight="medium"
                        >
                          Kendaraan Udara
                        </Text>
                      </Checkbox>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter
                  borderTop="1px solid"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  pt={4}
                >
                  <Button
                    variant="ghost"
                    mr={3}
                    onClick={handleTutupModalCetakSPD}
                  >
                    Batal
                  </Button>
                  <Button
                    variant={"primary"}
                    onClick={handleCetakSPD}
                    isLoading={isLoading}
                    loadingText="Memproses..."
                  >
                    Buat
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </Box>
      </Layout>
    </>
  );
}

export default Daftar;
