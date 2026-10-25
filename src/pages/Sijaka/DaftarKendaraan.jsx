import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import LayoutAset from "../../Componets/Aset/LayoutAset";

import "../../Style/pagination.css";
import AppPagination from "../../Componets/AppPagination";
import { Link, useHistory } from "react-router-dom";
import Foto from "../../assets/add_photo.png";
import { BsDownload } from "react-icons/bs";
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
  Textarea,
  Tooltip,
  Input,
  Select,
  Spacer,
  Progress,
  Badge,
  useToast,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";

import {
  BsThreeDotsVertical,
  BsEyeFill,
  BsFileEarmarkArrowDown,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

const gayaFilter = {
  container: (provided) => ({
    ...provided,
    borderRadius: "6px",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "terang",
    border: "0px",
    minHeight: "48px",
  }),
  option: (provided, state) => ({
    ...provided,
    bg: state.isFocused ? "aset" : "white",
    color: state.isFocused ? "white" : "black",
  }),
};

const cekMassalAwal = {
  running: false,
  total: 0,
  selesai: 0,
  berhasil: 0,
  tidakDitemukan: 0,
  gagal: 0,
  dilewati: 0,
  current: "",
  log: [],
};

function DaftarKendaraan() {
  const [DataKendaraan, setDataKendaraan] = useState([]);
  const history = useHistory();
  const [dataSeed, setDataSeed] = useState(null);
  const [page, setPage] = useState(0);
  const [daftarVersi, setDaftarVersi] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  const [unitKerjaId, setUnitKerjaId] = useState(0);
  const [pegawaiId, setPegawaiId] = useState(0);
  const [statusId, setStatusId] = useState(0);
  const [jenisId, setJenisId] = useState(0);
  const [kondisiId, setKondisiId] = useState(0);
  const [nomorMesin, setNomorMesin] = useState("");
  const [nomorRangka, setNomorRangka] = useState("");
  const [nomorKontak, setNomorKontak] = useState(0);
  const [nomor, setNomor] = useState(0);
  const [seri, setSeri] = useState("");
  const [loadingItems, setLoadingItems] = useState({});
  const [loadingSurat, setLoadingSurat] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [dataPegawai, setDataPegawai] = useState(null);
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [nomorPlat, setNomorPlat] = useState("");
  const [unitKerjaFilterId, setUnitKerjaFilterId] = useState(0);
  const [pegawaiFilterId, setPegawaiFilterId] = useState(0);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [jenisFilterId, setJenisFilterId] = useState(0);
  const [statusFilterId, setStatusFilterId] = useState(0);
  const [kondisiFilterId, setKondisiFilterId] = useState(0);
  const [merekFilter, setMerekFilter] = useState("");
  const [seriFilter, setSeriFilter] = useState("");
  const [nomorPlatInput, setNomorPlatInput] = useState("");
  const [merekInput, setMerekInput] = useState("");
  const [seriInput, setSeriInput] = useState("");
  const [sortBy, setSortBy] = useState("pajakTahunIni");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [pegawaiFilterValue, setPegawaiFilterValue] = useState(null);
  const [unitKerjaFilterValue, setUnitKerjaFilterValue] = useState(null);
  const [jenisFilterValue, setJenisFilterValue] = useState(null);
  const [statusFilterValue, setStatusFilterValue] = useState(null);
  const [kondisiFilterValue, setKondisiFilterValue] = useState(null);
  const filterTimer = useRef({});
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const {
    isOpen: isCekMassalOpen,
    onOpen: onCekMassalOpen,
    onClose: onCekMassalClose,
  } = useDisclosure();
  const {
    isOpen: isSuratOpen,
    onOpen: onSuratOpen,
    onClose: onSuratClose,
  } = useDisclosure();
  const [suratTarget, setSuratTarget] = useState(null);
  const [penandatanganValue, setPenandatanganValue] = useState(null);
  const [unitKerjaCekId, setUnitKerjaCekId] = useState(0);
  const [cekMassal, setCekMassal] = useState(cekMassalAwal);
  const batalCekRef = useRef(false);
  const abortCekRef = useRef(null);
  const cekBerjalanRef = useRef(false);

  const changePage = ({ selected }) => {
    setPage((current) => (current === selected ? current : selected));
  };
  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "nomor") {
      setNomor(parseInt(val));
    } else if (field == "seri") {
      setSeri(val);
    } else if (field == "nomorMesin") {
      setNomorMesin(val);
    } else if (field == "nomorRangka") {
      setNomorRangka(val);
    } else if (field == "nomorKontak") {
      setNomorKontak(parseInt(val));
    }
  };

  async function fetchDataPegawai() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get`)
      .then((res) => {
        console.log(res.data, "tessss");
        setDataPegawai(res.data.result.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  const cekPajak = (val) => {
    setLoadingItems((prev) => ({ ...prev, [val.id]: true }));
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/cek`, {
        id: val.id,
        nomor: val.nomor,
        seri: val.seri,
        phone: 6281350617579,
        kt: "KT",
      })
      .then((res) => {
        // Buat URL untuk file yang diunduh
        console.log(res.data);
        fetchDataKendaraan();

        toast({
          title: "Berhasil",
          description: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err); // Tangani error
        toast({
          title: "Gagal",
          description: "Gagal mengakses SIMPATOR  ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoadingItems((prev) => ({ ...prev, [val.id]: false }));
        setOpenMenuId(null);
      });
  };

  const opsiUnitCek = [
    { value: 0, label: "Semua unit kerja" },
    ...(dataSeed?.unitKerja || []).map((val) => ({
      value: val.id,
      label: val.unitKerja,
    })),
  ];

  const bukaCekMassal = () => {
    if (!cekMassal.running) {
      setUnitKerjaCekId(unitKerjaFilterId || 0);
      setCekMassal(cekMassalAwal);
    }
    onCekMassalOpen();
  };

  const batalkanCekMassal = () => {
    batalCekRef.current = true;
    abortCekRef.current?.abort();
  };

  const mulaiCekMassal = async () => {
    if (cekBerjalanRef.current) return;
    cekBerjalanRef.current = true;
    batalCekRef.current = false;
    setCekMassal({
      ...cekMassalAwal,
      running: true,
      current: "Mengambil daftar kendaraan...",
    });

    try {
      const query = unitKerjaCekId ? `?unitKerjaId=${unitKerjaCekId}` : "";
      const daftarRes = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/untuk-cek${query}`,
      );
      const daftar = daftarRes.data?.result || [];

      if (batalCekRef.current) {
        setCekMassal((prev) => ({
          ...prev,
          running: false,
          total: daftar.length,
          current: "Dibatalkan",
        }));
        setDaftarVersi((versi) => versi + 1);
        onCekMassalClose();
        return;
      }

      if (daftar.length === 0) {
        setCekMassal((prev) => ({
          ...prev,
          running: false,
          current: "Tidak ada kendaraan pada pilihan ini",
        }));
        return;
      }

      setCekMassal((prev) => ({ ...prev, total: daftar.length, current: "" }));

      for (let index = 0; index < daftar.length; index += 1) {
        if (batalCekRef.current) break;

        const item = daftar[index];
        const plat = `KT ${item.nomor || "-"} ${item.seri || ""}`.trim();
        const unit = item.kendaraanUK?.unitKerja || "-";

        if (!item.nomor || !item.seri) {
          setCekMassal((prev) => ({
            ...prev,
            selesai: prev.selesai + 1,
            dilewati: prev.dilewati + 1,
            current: plat,
            log: [
              {
                plat,
                unit,
                status: "dilewati",
                pesan: "Nomor atau seri kosong",
              },
              ...prev.log,
            ],
          }));
          continue;
        }

        setCekMassal((prev) => ({ ...prev, current: plat }));
        const controller = new AbortController();
        abortCekRef.current = controller;

        try {
          await axios.post(
            `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/cek`,
            {
              id: item.id,
              nomor: item.nomor,
              seri: item.seri,
              phone: 6281350617579,
              kt: "KT",
            },
            { timeout: 45000, signal: controller.signal },
          );
          setCekMassal((prev) => ({
            ...prev,
            selesai: prev.selesai + 1,
            berhasil: prev.berhasil + 1,
            log: [
              { plat, unit, status: "berhasil", pesan: "Diperbarui" },
              ...prev.log,
            ],
          }));
        } catch (err) {
          if (batalCekRef.current || err?.code === "ERR_CANCELED") break;
          const tidakDitemukan = err?.response?.status === 404;
          setCekMassal((prev) => ({
            ...prev,
            selesai: prev.selesai + 1,
            tidakDitemukan: prev.tidakDitemukan + (tidakDitemukan ? 1 : 0),
            gagal: prev.gagal + (tidakDitemukan ? 0 : 1),
            log: [
              {
                plat,
                unit,
                status: tidakDitemukan ? "tidak ditemukan" : "gagal",
                pesan:
                  err?.response?.data?.message || "Gagal mengakses SIMPATOR",
              },
              ...prev.log,
            ],
          }));
        }

        if (!batalCekRef.current && index < daftar.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }

      const dibatalkan = batalCekRef.current;
      setCekMassal((prev) => ({
        ...prev,
        running: false,
        current: dibatalkan ? "Dibatalkan" : "Selesai",
      }));
      setDaftarVersi((versi) => versi + 1);
      onCekMassalClose();
      toast({
        title: dibatalkan ? "Cek pajak dihentikan" : "Cek pajak selesai",
        description: dibatalkan
          ? "Sebagian data yang sudah berhasil tetap tersimpan."
          : "Data pajak kendaraan sudah diperbarui dari SIMPATOR.",
        status: dibatalkan ? "warning" : "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      setCekMassal((prev) => ({
        ...prev,
        running: false,
        current: "Gagal mengambil daftar kendaraan",
      }));
      toast({
        title: "Gagal",
        description: "Tidak dapat mengambil daftar kendaraan untuk dicek.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      cekBerjalanRef.current = false;
    }
  };
  const bukaCetakSurat = (item) => {
    setSuratTarget(item);
    setPenandatanganValue(null);
    setOpenMenuId(null);
    onSuratOpen();
  };
  const tutupCetakSurat = () => {
    if (suratTarget && loadingSurat[suratTarget.id]) return;
    setPenandatanganValue(null);
    onSuratClose();
  };
  const cektakSurat = () => {
    const val = suratTarget;
    if (!val) return;
    if (!penandatanganValue?.value) {
      toast({
        title: "Penandatangan wajib dipilih",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setLoadingSurat((prev) => ({ ...prev, [val.id]: true }));
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/surat`,
        {
          nomorRangka: val.noRangka,
          nomorMesin: val.noMesin,
          unitKerja: val.kendaraanUK.unitKerja,
          plat: `KT ${val.nomor} ${val.seri}`,
          jenisKendaraan: val.jenisKendaraan.jenis,
          userId: user[0].id,
          kendaraanId: val.id,
          penandatanganId: penandatanganValue.value,
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
        link.setAttribute("download", `surat_pengantar_KT${val.nomor}.docx`); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Tampilkan toast sukses
        toast({
          title: "Berhasil",
          description: "File surat pengantar berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setPenandatanganValue(null);
        onSuratClose();
      })
      .catch(async (err) => {
        console.error(err);
        let pesan = "Terjadi kesalahan saat mengunduh file";
        const data = err.response?.data;
        if (data instanceof Blob) {
          try {
            const json = JSON.parse(await data.text());
            pesan = json.message || json.error || pesan;
          } catch (parseError) {
            console.error(parseError);
          }
        }
        toast({
          title: "Gagal",
          description: pesan,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setLoadingSurat((prev) => ({ ...prev, [val.id]: false }));
      });
  };
  const tambahkendaraan = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/post`, {
        nomor,
        seri,
        unitKerjaId,
        pegawaiId,
        nomorMesin,
        nomorKontak,
        nomorRangka,
        kondisiId,
        statusId,
        jenisId,
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
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/seed`)
      .then((res) => {
        console.log(res.data);
        setDataSeed(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataKendaraan() {
    const params = new URLSearchParams({
      page,
      limit,
      unitKerjaId: unitKerjaFilterId || 0,
      pegawaiId: pegawaiFilterId || 0,
      nomor: nomorPlat || "",
      startDate: tanggalAwal || "",
      endDate: tanggalAkhir || "",
      jenisId: jenisFilterId || 0,
      statusId: statusFilterId || 0,
      kondisiId: kondisiFilterId || 0,
      merek: merekFilter || "",
      seri: seriFilter || "",
      sortBy,
      sortOrder,
    });
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get?${params.toString()}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      )
      .then((res) => {
        setDataKendaraan(res.data.result);
        const totalPage = res.data.totalPage || 0;
        setPages(totalPage);
        setRows(res.data.totalRows || 0);
        setPage((current) => {
          if (totalPage === 0) return 0;
          if (current > totalPage - 1) return totalPage - 1;
          return current;
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const downloadExcel = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/download`,
        {
          responseType: "blob", // agar respons dibaca sebagai file
          // headers: { Authorization: `Bearer ${token}` },
        },
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

  const setDebouncedFilter = (key, value, setter) => {
    clearTimeout(filterTimer.current[key]);
    filterTimer.current[key] = setTimeout(() => {
      setter(value);
      setPage(0);
    }, 500);
  };

  const resetFilter = () => {
    Object.values(filterTimer.current).forEach((timer) => clearTimeout(timer));
    setPegawaiFilterId(0);
    setPegawaiFilterValue(null);
    setUnitKerjaFilterId(0);
    setUnitKerjaFilterValue(null);
    setJenisFilterId(0);
    setJenisFilterValue(null);
    setStatusFilterId(0);
    setStatusFilterValue(null);
    setKondisiFilterId(0);
    setKondisiFilterValue(null);
    setNomorPlat("");
    setNomorPlatInput("");
    setMerekFilter("");
    setMerekInput("");
    setSeriFilter("");
    setSeriInput("");
    setTanggalAwal("");
    setTanggalAkhir("");
    setSortBy("pajakTahunIni");
    setSortOrder("ASC");
    setPage(0);
  };

  useEffect(() => {
    fetchSeed();
    fetchDataPegawai();
  }, []);

  useEffect(() => {
    fetchDataKendaraan();
  }, [
    page,
    limit,
    unitKerjaFilterId,
    pegawaiFilterId,
    nomorPlat,
    tanggalAkhir,
    tanggalAwal,
    jenisFilterId,
    statusFilterId,
    kondisiFilterId,
    merekFilter,
    seriFilter,
    sortBy,
    sortOrder,
    daftarVersi,
  ]);
  return (
    <>
      <LayoutAset>
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Box
            bgColor={"white"}
            p={"30px"}
            borderRadius={"5px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <HStack gap={5} mb={"30px"}>
              <Button onClick={onTambahOpen} variant={"primary"} px={"50px"}>
                Tambah +
              </Button>
              <Button onClick={bukaCekMassal} variant={"primary"} px={"30px"}>
                Cek Pajak Massal
              </Button>
              <Spacer />
              <Button
                variant={"primary"}
                fontWeight={900}
                onClick={downloadExcel}
              >
                <BsDownload />
              </Button>{" "}
            </HStack>{" "}
            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={5} mb={4}>
              <FormControl>
                <FormLabel>Nama Pegawai</FormLabel>
                <AsyncSelect
                  isClearable
                  value={pegawaiFilterValue}
                  loadOptions={async (inputValue) => {
                    if (!inputValue) return [];
                    try {
                      const res = await axios.get(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/pegawai/search?q=${inputValue}`,
                      );
                      return (res.data.result || []).map((val) => ({
                        value: val.id,
                        label: val.nama,
                      }));
                    } catch (err) {
                      console.error("Failed to load options:", err.message);
                      return [];
                    }
                  }}
                  placeholder="Ketik nama pegawai"
                  onChange={(selectedOption) => {
                    setPegawaiFilterValue(selectedOption);
                    setPegawaiFilterId(selectedOption?.value || 0);
                    setPage(0);
                  }}
                  chakraStyles={gayaFilter}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Unit Kerja</FormLabel>
                <Select2
                  isClearable
                  value={unitKerjaFilterValue}
                  options={dataSeed?.unitKerja?.map((val) => ({
                    value: val.id,
                    label: val.unitKerja,
                  }))}
                  placeholder="Semua unit kerja"
                  onChange={(selectedOption) => {
                    setUnitKerjaFilterValue(selectedOption);
                    setUnitKerjaFilterId(selectedOption?.value || 0);
                    setPage(0);
                  }}
                  chakraStyles={gayaFilter}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Jenis Kendaraan</FormLabel>
                <Select2
                  isClearable
                  value={jenisFilterValue}
                  options={dataSeed?.jenis?.map((val) => ({
                    value: val.id,
                    label: val.jenis,
                  }))}
                  placeholder="Semua jenis"
                  onChange={(selectedOption) => {
                    setJenisFilterValue(selectedOption);
                    setJenisFilterId(selectedOption?.value || 0);
                    setPage(0);
                  }}
                  chakraStyles={gayaFilter}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status Pajak</FormLabel>
                <Select2
                  isClearable
                  value={statusFilterValue}
                  options={dataSeed?.status?.map((val) => ({
                    value: val.id,
                    label: val.status,
                  }))}
                  placeholder="Semua status"
                  onChange={(selectedOption) => {
                    setStatusFilterValue(selectedOption);
                    setStatusFilterId(selectedOption?.value || 0);
                    setPage(0);
                  }}
                  chakraStyles={gayaFilter}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Kondisi</FormLabel>
                <Select2
                  isClearable
                  value={kondisiFilterValue}
                  options={dataSeed?.kondisi?.map((val) => ({
                    value: val.id,
                    label: val.nama,
                  }))}
                  placeholder="Semua kondisi"
                  onChange={(selectedOption) => {
                    setKondisiFilterValue(selectedOption);
                    setKondisiFilterId(selectedOption?.value || 0);
                    setPage(0);
                  }}
                  chakraStyles={gayaFilter}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nomor Plat</FormLabel>
                <Input
                  height="48px"
                  bgColor="terang"
                  value={nomorPlatInput}
                  onChange={(e) => {
                    setNomorPlatInput(e.target.value);
                    setDebouncedFilter("nomor", e.target.value, setNomorPlat);
                  }}
                  placeholder="Contoh: 3321"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Seri</FormLabel>
                <Input
                  height="48px"
                  bgColor="terang"
                  value={seriInput}
                  onChange={(e) => {
                    setSeriInput(e.target.value);
                    setDebouncedFilter("seri", e.target.value, setSeriFilter);
                  }}
                  placeholder="Contoh: E"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Merek</FormLabel>
                <Input
                  height="48px"
                  bgColor="terang"
                  value={merekInput}
                  onChange={(e) => {
                    setMerekInput(e.target.value);
                    setDebouncedFilter("merek", e.target.value, setMerekFilter);
                  }}
                  placeholder="Contoh: Honda"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Pajak dari</FormLabel>
                <Input
                  bgColor="terang"
                  height="48px"
                  type="date"
                  value={tanggalAwal}
                  onChange={(e) => {
                    setTanggalAwal(e.target.value);
                    setPage(0);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Pajak sampai</FormLabel>
                <Input
                  type="date"
                  bgColor="terang"
                  height="48px"
                  value={tanggalAkhir}
                  onChange={(e) => {
                    setTanggalAkhir(e.target.value);
                    setPage(0);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Urutkan</FormLabel>
                <Select
                  height="48px"
                  bgColor="terang"
                  value={`${sortBy}:${sortOrder}`}
                  onChange={(e) => {
                    const [nextSortBy, nextSortOrder] =
                      e.target.value.split(":");
                    setSortBy(nextSortBy);
                    setSortOrder(nextSortOrder);
                    setPage(0);
                  }}
                >
                  <option value="pajakTahunIni:ASC">
                    Pajak tahun ini dulu
                  </option>
                  <option value="tgl_pkb:ASC">Tanggal pajak terdekat</option>
                  <option value="tgl_pkb:DESC">Tanggal pajak terjauh</option>
                  <option value="tg_stnk:ASC">Tanggal STNK terdekat</option>
                  <option value="tg_stnk:DESC">Tanggal STNK terjauh</option>
                  <option value="nomor:ASC">Nomor plat terkecil</option>
                  <option value="nomor:DESC">Nomor plat terbesar</option>
                  <option value="total:ASC">Nominal pajak terkecil</option>
                  <option value="total:DESC">Nominal pajak terbesar</option>
                  <option value="nilaiPerolehan:ASC">
                    Nilai perolehan terkecil
                  </option>
                  <option value="nilaiPerolehan:DESC">
                    Nilai perolehan terbesar
                  </option>
                  <option value="tanggalPerolehan:DESC">
                    Perolehan terbaru
                  </option>
                  <option value="tanggalPerolehan:ASC">
                    Perolehan terlama
                  </option>
                  <option value="merek:ASC">Merek A-Z</option>
                  <option value="unitKerja:ASC">Unit kerja A-Z</option>
                  <option value="pemilik:ASC">Nama pemilik A-Z</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Data per halaman</FormLabel>
                <Select
                  height="48px"
                  bgColor="terang"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={1000}>1000</option>
                </Select>
              </FormControl>
            </SimpleGrid>
            <HStack mb="30px" justify="space-between">
              <Text>{rows || 0} kendaraan</Text>
              <Button variant="outline" onClick={resetFilter}>
                Reset filter
              </Button>
            </HStack>
            <Box overflowX="auto">
            <Table variant={"aset"}>
              <Thead>
                <Tr>
                  <Th>Foto</Th>
                  <Th>Nomor Plat</Th>
                  <Th>Jenis Kendaraan</Th>
                  <Th>Merek</Th>
                  <Th>Warna</Th>
                  <Th>tanggal Pajak</Th>
                  <Th>tanggal STNK</Th> <Th maxWidth={"20px"}>Unit Kerja</Th>
                  <Th>Nama Pemilik</Th>
                  <Th>nominal Pajak</Th>
                  <Th>status</Th>
                  <Th>kondisi</Th>
                  <Th>Nilai Perolehan</Th>
                  <Th>tanggal Perolehan</Th>
                  <Th>kontak</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {DataKendaraan?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>
                      <Image
                        borderRadius={"5px"}
                        alt="foto obat"
                        width="80px"
                        height="100px"
                        overflow="hiden"
                        objectFit="cover"
                        src={
                          item?.foto
                            ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                              item?.foto
                            : Foto
                        }
                      />
                    </Td>
                    <Td>{`KT ${item?.nomor} ${item?.seri}`}</Td>
                    <Td>{item?.jenisKendaraan?.jenis}</Td>
                    <Td>{item?.merek}</Td>
                    <Td>{item?.warna}</Td>
                    <Td>
                      {item?.tgl_pkb
                        ? new Date(item?.tgl_pkb).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </Td>
                    <Td>
                      {item?.tg_stnk
                        ? new Date(item?.tg_stnk).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </Td>{" "}
                    <Td>{item?.kendaraanUK?.unitKerja}</Td>
                    <Td>{item?.pegawai?.nama}</Td>
                    <Td>
                      {" "}
                      Rp
                      {Number(item?.total).toLocaleString("id-ID")}
                    </Td>
                    <Td>{item?.statusKendaraan?.status}</Td>
                    <Td>{item?.kondisi?.nama}</Td>
                    <Td>
                      {" "}
                      Rp
                      {Number(item?.nilaiPerolehan).toLocaleString("id-ID")}
                    </Td>{" "}
                    <Td>
                      {" "}
                      {item?.tanggalPerolehan
                        ? new Date(item?.tanggalPerolehan).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </Td>
                    <Td>{item?.noKontak}</Td>
                    <Td>
                      <Menu
                        closeOnSelect={false}
                        isOpen={openMenuId === item.id}
                        onClose={() => setOpenMenuId(null)}
                      >
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<BsThreeDotsVertical />}
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === item.id ? null : item.id,
                            )
                          }
                        />
                        <MenuList>
                          <MenuItem
                            onClick={() => cekPajak(item)}
                            isDisabled={loadingItems[item.id]}
                          >
                            {loadingItems[item.id]
                              ? "Mengecek..."
                              : "Cek Pajak"}
                          </MenuItem>

                          {item.id && (
                            <MenuItem
                              onClick={() =>
                                history.push(
                                  `/sijaka/detail-kendaraan/${item.id}`,
                                )
                              }
                              icon={<BsEyeFill />}
                            >
                              Lihat Detail
                            </MenuItem>
                          )}

                          <MenuItem
                            onClick={() => bukaCetakSurat(item)}
                            isDisabled={loadingSurat[item.id]}
                            icon={<BsFileEarmarkArrowDown />}
                          >
                            {loadingSurat[item.id]
                              ? "Mencetak..."
                              : "Cetak Surat"}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            </Box>
            <Box mt={4}>
              <Text fontSize="sm" mb={2}>
                {rows > 0
                  ? `Menampilkan ${page * limit + 1}–${Math.min(
                      (page + 1) * limit,
                      rows
                    )} dari ${rows} kendaraan`
                  : "Tidak ada kendaraan"}
              </Text>
              {pages > 1 && (
                <AppPagination
                  page={Math.min(page, pages - 1)}
                  pageCount={pages}
                  onPageChange={changePage}
                />
              )}
            </Box>
          </Box>

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
                    <Box
                      bgColor={"primary"}
                      width={"30px"}
                      height={"30px"}
                    ></Box>
                    <Heading color={"primary"}>Tambah Pegawai</Heading>
                  </HStack>

                  <SimpleGrid columns={2} spacing={10} p={"30px"}>
                    <FormControl
                      my={"30px"}
                      border={0}
                      bgColor={"white"}
                      flex="1"
                    >
                      <FormLabel fontSize={"24px"}>Unit Kerja</FormLabel>
                      <Select2
                        options={dataSeed?.unitKerja?.map((val) => ({
                          value: val.id,
                          label: `${val.unitKerja}`,
                        }))}
                        placeholder="Contoh: Laboratorium kesehatan daerah"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setUnitKerjaId(selectedOption.value);
                          fetchDataPegawai(selectedOption.value);
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
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>

                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
                      <AsyncSelect
                        loadOptions={async (inputValue) => {
                          if (!inputValue) return [];
                          try {
                            const res = await axios.get(
                              `${
                                import.meta.env.VITE_REACT_APP_API_BASE_URL
                              }/pegawai/search?q=${inputValue}`,
                            );

                            const filtered = res.data.result;

                            return filtered.map((val) => ({
                              value: val.id,
                              label: val.nama,
                            }));
                          } catch (err) {
                            console.error(
                              "Failed to load options:",
                              err.message,
                            );
                            return [];
                          }
                        }}
                        placeholder="Ketik Nama Pegawai"
                        onChange={(selectedOption) => {
                          setPegawaiId(selectedOption.value);
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
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Nomor Kendaraan</FormLabel>
                      <Input
                        height={"60px"}
                        bgColor={"terang"}
                        onChange={(e) =>
                          handleSubmitChange("nomor", e.target.value)
                        }
                        placeholder="Contoh:1405"
                      />
                    </FormControl>
                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Seri</FormLabel>
                      <Input
                        height={"60px"}
                        bgColor={"terang"}
                        onChange={(e) =>
                          handleSubmitChange("seri", e.target.value)
                        }
                        placeholder="Contoh: E"
                      />
                    </FormControl>

                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Nomor Mesin</FormLabel>
                      <Input
                        height={"60px"}
                        bgColor={"terang"}
                        onChange={(e) =>
                          handleSubmitChange("nomorMesin", e.target.value)
                        }
                        placeholder="Contoh: E109-ID-733219"
                      />
                    </FormControl>
                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Nomor Rangka</FormLabel>
                      <Input
                        height={"60px"}
                        bgColor={"terang"}
                        onChange={(e) =>
                          handleSubmitChange("nomorRangka", e.target.value)
                        }
                        placeholder="Contoh: MH8FD110XIJ-728523"
                      />
                    </FormControl>
                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Nomor Kontak</FormLabel>
                      <Input
                        height={"60px"}
                        bgColor={"terang"}
                        onChange={(e) =>
                          handleSubmitChange("nomorKontak", e.target.value)
                        }
                        placeholder="Contoh: 628123040323321"
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
                        options={dataSeed?.jenis?.map((val) => ({
                          value: val.id,
                          label: `${val.jenis}`,
                        }))}
                        placeholder="Contoh: Roda Dua"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setJenisId(selectedOption.value);
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
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>

                    <FormControl
                      my={"30px"}
                      border={0}
                      bgColor={"white"}
                      flex="1"
                    >
                      <FormLabel fontSize={"24px"}>Kondisi Kendaraan</FormLabel>
                      <Select2
                        options={dataSeed?.kondisi?.map((val) => ({
                          value: val.id,
                          label: `${val.nama}`,
                        }))}
                        placeholder="Contoh: Baik"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setKondisiId(selectedOption.value);
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
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormControl
                      my={"30px"}
                      border={0}
                      bgColor={"white"}
                      flex="1"
                    >
                      <FormLabel fontSize={"24px"}>Status Kendaraan</FormLabel>
                      <Select2
                        options={dataSeed?.status?.map((val) => ({
                          value: val.id,
                          label: `${val.status}`,
                        }))}
                        placeholder="Contoh: Lunas"
                        focusBorderColor="red"
                        onChange={(selectedOption) => {
                          setStatusId(selectedOption.value);
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
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </ModalBody>

              <ModalFooter pe={"60px"} pb={"30px"}>
                <Button onClick={tambahkendaraan} variant={"primary"}>
                  Tambah Kendaraan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            closeOnOverlayClick={!cekMassal.running}
            closeOnEsc={!cekMassal.running}
            isOpen={isCekMassalOpen}
            onClose={() => {
              if (cekMassal.running) return;
              onCekMassalClose();
            }}
          >
            <ModalOverlay />
            <ModalContent borderRadius={0} maxWidth="720px">
              <ModalHeader>Cek Pajak Massal</ModalHeader>
              <ModalCloseButton isDisabled={cekMassal.running} />
              <ModalBody>
                <Text mb={4}>
                  Data pajak diambil dari SIMPATOR lalu disimpan ke setiap
                  kendaraan. Pengecekan berjalan satu per satu supaya akses
                  SIMPATOR tetap stabil. Pilih satu unit kerja, atau semua unit
                  kerja sekaligus.
                </Text>
                <FormControl mb={4}>
                  <FormLabel>Unit Kerja</FormLabel>
                  <Select2
                    options={opsiUnitCek}
                    value={
                      opsiUnitCek.find(
                        (item) => item.value === unitKerjaCekId,
                      ) || opsiUnitCek[0]
                    }
                    isDisabled={cekMassal.running}
                    onChange={(selectedOption) => {
                      setUnitKerjaCekId(selectedOption?.value || 0);
                    }}
                    chakraStyles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "terang",
                        border: "0px",
                        minHeight: "48px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        bg: state.isFocused ? "aset" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>

                {cekMassal.total > 0 && (
                  <Box mb={4}>
                    <Progress
                      value={(cekMassal.selesai / cekMassal.total) * 100}
                      colorScheme="green"
                      borderRadius="md"
                      hasStripe
                      isAnimated={cekMassal.running}
                      mb={2}
                    />
                    <Text fontSize="sm" mb={2}>
                      {cekMassal.selesai} dari {cekMassal.total}
                      {cekMassal.current ? ` · ${cekMassal.current}` : ""}
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      <Badge colorScheme="green">
                        Berhasil {cekMassal.berhasil}
                      </Badge>
                      <Badge colorScheme="orange">
                        Tidak ditemukan {cekMassal.tidakDitemukan}
                      </Badge>
                      <Badge colorScheme="red">Gagal {cekMassal.gagal}</Badge>
                      <Badge colorScheme="gray">
                        Dilewati {cekMassal.dilewati}
                      </Badge>
                    </HStack>
                  </Box>
                )}

                {cekMassal.current && cekMassal.total === 0 && (
                  <Text mb={4}>{cekMassal.current}</Text>
                )}

                {cekMassal.log.length > 0 && (
                  <Box
                    maxH="220px"
                    overflowY="auto"
                    borderWidth="1px"
                    borderRadius="md"
                    p={3}
                  >
                    {cekMassal.log.map((item, index) => (
                      <Text key={`${item.plat}-${index}`} fontSize="sm" mb={1}>
                        {item.plat} ({item.unit}) — {item.status}
                        {item.pesan ? `: ${item.pesan}` : ""}
                      </Text>
                    ))}
                  </Box>
                )}
              </ModalBody>
              <ModalFooter>
                {cekMassal.running ? (
                  <Button colorScheme="red" onClick={batalkanCekMassal}>
                    Hentikan
                  </Button>
                ) : (
                  <Button variant="primary" onClick={mulaiCekMassal}>
                    Mulai Cek
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            closeOnOverlayClick={false}
            isOpen={isSuratOpen}
            onClose={tutupCetakSurat}
          >
            <ModalOverlay />
            <ModalContent borderRadius={0} maxWidth="560px">
              <ModalHeader>Cetak Surat Pengantar</ModalHeader>
              <ModalCloseButton
                isDisabled={suratTarget && loadingSurat[suratTarget.id]}
              />
              <ModalBody>
                <Text mb={4}>
                  {suratTarget
                    ? `Plat KT ${suratTarget.nomor} ${suratTarget.seri || ""}`
                    : ""}
                </Text>
                <FormControl>
                  <FormLabel>Penandatangan</FormLabel>
                  <AsyncSelect
                    value={penandatanganValue}
                    loadOptions={async (inputValue) => {
                      if (!inputValue) return [];
                      try {
                        const res = await axios.get(
                          `${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/pegawai/search?q=${inputValue}`
                        );
                        return res.data.result.map((val) => ({
                          value: val.id,
                          label: val.nip ? `${val.nama} — ${val.nip}` : val.nama,
                        }));
                      } catch (err) {
                        console.error(err.message);
                        return [];
                      }
                    }}
                    placeholder="Ketik nama pegawai"
                    onChange={(selectedOption) =>
                      setPenandatanganValue(selectedOption)
                    }
                    chakraStyles={gayaFilter}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="primary"
                  onClick={cektakSurat}
                  isLoading={suratTarget && loadingSurat[suratTarget.id]}
                  isDisabled={!penandatanganValue}
                >
                  Cetak
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </LayoutAset>
    </>
  );
}

export default DaftarKendaraan;
