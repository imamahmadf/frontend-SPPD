import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { Spacer, useDisclosure } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Container,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Select,
  Flex,
  ModalCloseButton,
  ModalBody,
  Badge,
  Icon,
  Grid,
  GridItem,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Heading,
  useColorModeValue,
  SimpleGrid,
  Avatar,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import {
  FiMapPin,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiTarget,
  FiUsers,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiInfo,
  FiUserPlus,
} from "react-icons/fi";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";
import { useToast } from "@chakra-ui/react";
import TambahBuktiKegiatan from "../Componets/TambahBuktiKegiatan";

function Detail(props) {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const toast = useToast();
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [resultUangHarian, setResultUangHarian] = useState([]); // State untuk menyimpan resultUangHarian
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);
  const [dataDalamKota, setDataDalamKota] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tambah state loading
  const [isCreatingAuto, setIsCreatingAuto] = useState(false); // State untuk loading buat otomatis
  const [isCreatingAutoBulk, setIsCreatingAutoBulk] = useState(false); // State untuk loading buat otomatis bulk
  const [randomNumber, setRandomNumber] = useState(0); // State untuk refresh data foto kegiatan
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isHapusOpen,
    onOpen: onHapusOpen,
    onClose: onHapusClose,
  } = useDisclosure();

  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );
  async function fetchDataPerjalan() {
    setIsLoading(true); // Set loading true sebelum fetch
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/detail-perjalanan/${props.match.params.id}`
      );
      setDetailPerjalanan(res.data.result);
      // Simpan resultUangHarian dari response
      setResultUangHarian(res.data.resultUangHarian || []);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false); // Set loading false setelah fetch selesai
    }
  }

  async function fetchSubKegiatan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/sub-kegiatan/get-filter/${user[0]?.unitKerja_profile?.id}`
      )
      .then((res) => {
        setDataSubKegiatan(res.data.result);
        console.log(res.data.result, "SUB KEGIATAN");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataDalamKota() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/dalam-kota/get/dalam-kota/${
          user[0]?.unitKerja_profile?.indukUnitKerja.id
        }`
      )
      .then((res) => {
        setDataDalamKota(res.data.result);
        console.log(res.data.result, "DALAM KOTA");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const history = useHistory();

  useEffect(() => {
    // Jalankan kedua fetch dan set loading false setelah keduanya selesai
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDataPerjalan(),
        fetchSubKegiatan(),
        fetchDataDalamKota(),
      ]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  // Refresh data ketika randomNumber berubah (untuk refresh foto kegiatan)
  useEffect(() => {
    if (randomNumber > 0) {
      fetchDataPerjalan();
    }
  }, [randomNumber]);

  const [pegawaiId, setPegawaiId] = useState(null); // id pegawai baru
  const [personilId, setPersonilId] = useState(null); // id personil yang diedit
  const [pegawaiLamaId, setPegawaiLamaId] = useState(null); // id pegawai lama
  const [personilHapusId, setPersonilHapusId] = useState(null); // id personil yang akan dihapus
  const [namaPegawaiHapus, setNamaPegawaiHapus] = useState(""); // nama pegawai yang akan dihapus
  const [pegawaiTambahId, setPegawaiTambahId] = useState(null); // id pegawai yang akan ditambahkan
  const [isEditUntukOpen, setIsEditUntukOpen] = useState(false); // modal edit untuk
  const [editUntukValue, setEditUntukValue] = useState(""); // nilai untuk yang diedit
  const [editSubKegiatanId, setEditSubKegiatanId] = useState(null); // nilai sub kegiatan yang diedit
  const [isEditTempatOpen, setIsEditTempatOpen] = useState(false); // modal edit tempat terpadu
  const [editTanggalBerangkat, setEditTanggalBerangkat] = useState(""); // nilai tanggal berangkat yang diedit
  const [editTanggalPulang, setEditTanggalPulang] = useState(""); // nilai tanggal pulang yang diedit
  const [editTujuan, setEditTujuan] = useState(""); // nilai tujuan yang diedit (untuk luar kota)
  const [editDalamKotaId, setEditDalamKotaId] = useState(""); // nilai dalam kota yang dipilih
  const [selectedTempatIndex, setSelectedTempatIndex] = useState(0); // index tempat yang sedang diedit
  const [selectedTempatId, setSelectedTempatId] = useState(null); // ID tempat yang sedang diedit

  // Fungsi untuk mengkonversi tanggal ke format YYYY-MM-DD untuk input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleEditPegawai = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/edit-pegawai`,
        {
          personilId,
          pegawaiBaruId: pegawaiId,
          pegawaiLamaId,
        }
      );
      onEditClose();
      await fetchDataPerjalan(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  const handleHapusPersonil = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/hapus/${personilHapusId}`
      );
      onHapusClose();
      await fetchDataPerjalan(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  const handleTambahPersonil = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/tambah`,
        {
          perjalananId: props.match.params.id,
          pegawaiId: pegawaiTambahId,
          indukUnitKerjaId: user[0].unitKerja_profile.indukUnitKerja.id,
          kode: user[0].unitKerja_profile.kode,
          tanggalPengajuan: detailPerjalanan.tanggalPengajuan,
        }
      );
      onTambahClose();
      setPegawaiTambahId(null);
      await fetchDataPerjalan(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTempat = async () => {
    try {
      const payload = {
        tempatId: selectedTempatId,
        tanggalBerangkat: editTanggalBerangkat,
        tanggalPulang: editTanggalPulang,
      };

      // Tambahkan field yang sesuai berdasarkan tipe perjalanan
      if (detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1) {
        // Perjalanan dalam kota
        payload.dalamKotaId = parseInt(editDalamKotaId);
      } else {
        // Perjalanan luar kota
        payload.tujuan = editTujuan;
      }
      console.log(payload, "cek payload");
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/edit-tempat/${props.match.params.id}`,
        payload
      );
      setIsEditTempatOpen(false);
      await fetchDataPerjalan(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  // Ambil semua statusId dari personils
  const statusIds = detailPerjalanan?.personils?.map((item) => item.statusId);

  // Cek apakah ada statusId yang 2 atau 3
  const adaStatusDuaAtauTiga = statusIds?.includes(2) || statusIds?.includes(3);

  // Fungsi untuk menghitung total durasi - sama seperti di Rampung
  const totalDurasi = detailPerjalanan?.tempats?.reduce(
    (total, tempat) => total + tempat.dalamKota.durasi, // Sama seperti di Rampung, tanpa optional chaining untuk durasi
    0 // nilai awal
  );

  // Fungsi buat otomatis untuk personil - format sama persis dengan Rampung.jsx
  const buatOtomatis = (personilId) => {
    const maxTransport = detailPerjalanan?.tempats?.reduce(
      (max, tempat) =>
        tempat.dalamKota.uangTransport > max.dalamKota.uangTransport
          ? tempat
          : max,
      detailPerjalanan.tempats[0] // nilai awal
    );

    setIsCreatingAuto(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/kwitansi-otomatis`,
        {
          personilId: personilId,
          subKegiatan:
            detailPerjalanan.daftarSubKegiatan.subKegiatan,
          // kodeRekening: `${detailPerjalanan.daftarSubKegiatan.kegiatan.kodeRekening}${detailPerjalanan.daftarSubKegiatan.kodeRekening}`,
          uangHarian: resultUangHarian?.[0]?.nilai,
          uangTransport: maxTransport.dalamKota.uangTransport,
          tempatNama: maxTransport.dalamKota.nama,
          asal: detailPerjalanan.asal,
          totalDurasi,
          pelayananKesehatan: detailPerjalanan.pelayananKesehatan,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataPerjalan();
        toast({
          title: "Berhasil!",
          description: "Rincian biaya berhasil dibuat otomatis",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsCreatingAuto(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            "Terjadi kesalahan saat membuat rincian otomatis",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsCreatingAuto(false);
      });
  };

  // Fungsi buat otomatis untuk semua personil sekaligus (bulk)
  const buatOtomatisBulk = async () => {
    // Validasi: hanya untuk perjalanan dalam kota
    if (detailPerjalanan.jenisPerjalanan?.tipePerjalananId !== 1) {
      toast({
        title: "Error",
        description: "Fitur ini hanya tersedia untuk perjalanan dalam kota",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validasi: harus ada tempats
    if (!detailPerjalanan.tempats || detailPerjalanan.tempats.length === 0) {
      toast({
        title: "Error",
        description: "Data tempat tidak ditemukan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Filter personil yang belum memiliki rincianBPDs
    const personilsWithoutRincian = detailPerjalanan.personils.filter(
      (personil) =>
        !personil.rincianBPDs || personil.rincianBPDs.length === 0
    );

    if (personilsWithoutRincian.length === 0) {
      toast({
        title: "Info",
        description: "Semua personil sudah memiliki rincian biaya perjalanan",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingAutoBulk(true);

    try {
      // Cari maxTransport dari tempats
      const maxTransport = detailPerjalanan.tempats.reduce(
        (max, tempat) =>
          tempat.dalamKota.uangTransport > max.dalamKota.uangTransport
            ? tempat
            : max,
        detailPerjalanan.tempats[0]
      );

      // Ambil uangHarian untuk setiap personil
      const personilsData = await Promise.all(
        personilsWithoutRincian.map(async (personil) => {
          // Ambil data uang harian untuk personil ini
          let uangHarian = resultUangHarian?.[0]?.nilai;

          // Jika tidak ada di resultUangHarian, fetch dari endpoint rampung
          if (!uangHarian) {
            try {
              const rampungResponse = await axios.get(
                `${
                  import.meta.env.VITE_REACT_APP_API_BASE_URL
                }/kwitansi/get/rampung/${personil.id}`,
                { params: { unitKerjaId: user[0]?.unitKerja_profile.id } }
              );
              uangHarian =
                rampungResponse.data?.resultUangHarian?.[0]?.nilai ||
                resultUangHarian?.[0]?.nilai;
            } catch (err) {
              console.error(
                `Error fetching uang harian for personil ${personil.id}:`,
                err
              );
              // Gunakan resultUangHarian default jika fetch gagal
              uangHarian = resultUangHarian?.[0]?.nilai;
            }
          }

          return {
            personilId: personil.id,
            uangHarian: uangHarian || 0,
            uangTransport: maxTransport.dalamKota.uangTransport,
            tempatNamaPersonil: maxTransport.dalamKota.nama,
            asalPersonil: detailPerjalanan.asal,
          };
        })
      );

      // Kirim request bulk
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/kwitansi-otomatis-bulk`,
        {
          id: detailPerjalanan.id,
          totalDurasi: totalDurasi,
          personils: personilsData,
          tempatNama: maxTransport.dalamKota.nama,
          asal: detailPerjalanan.asal,
          pelayananKesehatan: detailPerjalanan.pelayananKesehatan,
        }
      );

      console.log("Bulk response:", response.data);

      toast({
        title: "Berhasil!",
        description: `Rincian biaya berhasil dibuat otomatis untuk ${personilsData.length} personil`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data perjalanan
      await fetchDataPerjalan();
    } catch (err) {
      console.error("Error bulk:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "Terjadi kesalahan saat membuat rincian otomatis untuk semua personil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreatingAutoBulk(false);
    }
  };

  // Cek apakah semua personil belum memiliki rincianBPDs
  const semuaPersonilBelumAdaRincian =
    detailPerjalanan.personils &&
    detailPerjalanan.personils.length > 0 &&
    detailPerjalanan.personils.every(
      (personil) =>
        !personil.rincianBPDs || personil.rincianBPDs.length === 0
    );

  if (isLoading) return <Loading />;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("primary", "primary");

  return (
    <>
      <Layout>
        <Box minH="100vh">
          {/* Header Section */}
          <Box
            // bgGradient="linear(to-r, primary, purple.600)"
            py={{ base: 4, md: 6, lg: 8 }}
            mb={{ base: 4, md: 6, lg: 8 }}
            px={{ base: 4, md: 0 }}
          >
            <Container maxW={{ base: "100%", md: "1280px" }} px={{ base: 4, md: 6 }}>
              <Flex 
                align={{ base: "start", md: "center" }} 
                justify="space-between"
                direction={{ base: "column", md: "row" }}
                gap={4}
              >
                <VStack align="start" spacing={2} flex={1}>
                  <Heading 
                    size={{ base: "md", md: "lg" }} 
                    display="flex" 
                    align="center" 
                    gap={3}
                    flexWrap="wrap"
                  >
                    <Icon as={FiInfo} boxSize={{ base: 5, md: 6 }} />
                    Detail Perjalanan Dinas
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} opacity={0.9}>
                    Informasi lengkap perjalanan dinas dan personil
                  </Text>
                </VStack>
                {!adaStatusDuaAtauTiga && (
                  <Button
                    leftIcon={<FiEdit3 />}
                    colorScheme="whiteAlpha"
                    variant="outline"
                    size={{ base: "md", md: "lg" }}
                    onClick={() => {
                      setEditUntukValue(detailPerjalanan.untuk || "");
                      setEditSubKegiatanId(
                        detailPerjalanan?.daftarSubKegiatan?.id || null
                      );
                      setIsEditUntukOpen(true);
                    }}
                    _hover={{
                      bg: "whiteAlpha.200",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    w={{ base: "full", md: "auto" }}
                  >
                    Edit Perjalanan
                  </Button>
                )}
              </Flex>
              {JSON.stringify(user[0].unitKerja_profile.kode)}
            </Container>
          </Box>

          <Container maxW={{ base: "100%", md: "1280px", lg: "1380px" }} px={{ base: 4, md: 6 }}>
            {/* Grid untuk Informasi Perjalanan dan Bukti Kegiatan */}
            <Grid
              templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
              gap={{ base: 4, md: 6, lg: 8 }}
              mb={{ base: 6, md: 8 }}
            >
              {/* Kolom Kiri - Informasi Perjalanan */}
              <GridItem>
                <Card
                  bg={cardBg}
                  borderColor={borderColor}
                  shadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  h="100%"
                >
                  <CardHeader
                    bg={headerBg}
                    borderBottom="1px"
                    borderColor={borderColor}
                  >
                    <Heading size="md" display="flex" align="center" gap={2}>
                      <Icon as={FiFileText} color="purple.500" />
                      Informasi Perjalanan
                    </Heading>
                  </CardHeader>
                  <CardBody p={{ base: 4, md: 6, lg: 8 }}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
                  {/* Asal */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Asal
                    </Text>
                    <HStack>
                      <Icon as={FiMapPin} color="primary" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.asal}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Dasar */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Dasar
                    </Text>
                    <HStack>
                      <Icon as={FiFileText} color="purple.500" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.dasar || "-"}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Untuk */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Untuk
                    </Text>
                    <HStack>
                      <Icon as={FiTarget} color="primary" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.untuk}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* No. Surat Tugas */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      No. Surat Tugas
                    </Text>
                    <HStack>
                      <Icon as={FiFileText} color="purple.600" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.noSuratTugas}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* No. Nota Dinas */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      No. Nota Dinas
                    </Text>
                    <HStack>
                      <Icon as={FiFileText} color="primary" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.isNotaDinas
                          ? detailPerjalanan.noNotaDinas
                          : "-"}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* No. Telaahan Staf */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      No. Telaahan Staf
                    </Text>
                    <HStack>
                      <Icon as={FiFileText} color="purple.500" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.isNotaDinas
                          ? "-"
                          : detailPerjalanan.noNotaDinas}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Tanggal Pengajuan */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Tanggal Pengajuan
                    </Text>
                    <HStack>
                      <Icon as={FiCalendar} color="primary" />
                      <Text fontSize="lg" fontWeight="medium">
                        {new Date(
                          detailPerjalanan.tanggalPengajuan
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Sumber Dana */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Sumber Dana
                    </Text>
                    <HStack>
                      <Icon as={FiDollarSign} color="purple.500" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan.bendahara?.sumberDana?.sumber}
                      </Text>
                    </HStack>
                  </VStack>
                  {/* Sub Kegiatan */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Sub Kegiatan
                    </Text>
                    <HStack>
                      <Icon as={FiTarget} color="purple.500" />
                      <Text fontSize="lg" fontWeight="medium">
                        {detailPerjalanan?.daftarSubKegiatan?.subKegiatan}
                      </Text>
                      {!adaStatusDuaAtauTiga && (
                        <Button
                          size="xs"
                          leftIcon={<FiEdit3 />}
                          colorScheme="purple"
                          variant="outline"
                          ml={2}
                          onClick={() => {
                            setEditSubKegiatanId(
                              detailPerjalanan?.daftarSubKegiatan?.id || ""
                            );
                            setIsEditUntukOpen(true);
                          }}
                          _hover={{ transform: "translateY(-1px)" }}
                          transition="all 0.2s"
                        >
                          Edit
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                  {/* Tujuan */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Tujuan ({detailPerjalanan?.tempats?.length} tempat)
                    </Text>
                    <VStack
                      align="start"
                      flexDirection={"row"}
                      spacing={3}
                      w="100%"
                    >
                      {detailPerjalanan?.tempats?.map((tempat, index) => (
                        <Box
                          key={index}
                          p={3}
                          bg={useColorModeValue("gray.50", "gray.700")}
                          borderRadius="lg"
                          border="1px"
                          borderColor={borderColor}
                          w="full"
                        >
                          <VStack align="start" spacing={3}>
                            <HStack justify="space-between" w="full">
                              <HStack>
                                <Icon as={FiMapPin} color="primary" />
                                <Text fontSize="md" fontWeight="medium">
                                  {detailPerjalanan.jenisPerjalanan
                                    ?.tipePerjalananId === 1
                                    ? tempat.dalamKota?.nama
                                    : tempat.tempat}
                                </Text>
                              </HStack>
                              <Spacer />
                              {!adaStatusDuaAtauTiga && (
                                <Button
                                  size="sm"
                                  leftIcon={<FiEdit3 />}
                                  colorScheme="primary"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedTempatIndex(index); // Tetap gunakan index untuk array access
                                    setSelectedTempatId(tempat.id); // Simpan ID untuk dikirim ke API

                                    // Set nilai sesuai tipe perjalanan
                                    if (
                                      detailPerjalanan.jenisPerjalanan
                                        ?.tipePerjalananId === 1
                                    ) {
                                      // Perjalanan dalam kota
                                      setEditDalamKotaId(
                                        tempat.dalamKota?.id || ""
                                      );
                                      setEditTujuan(""); // Reset untuk luar kota
                                    } else {
                                      // Perjalanan luar kota
                                      setEditTujuan(tempat.tempat || "");
                                      setEditDalamKotaId(""); // Reset untuk dalam kota
                                    }

                                    setEditTanggalBerangkat(
                                      formatDateForInput(
                                        tempat.tanggalBerangkat
                                      )
                                    );
                                    setEditTanggalPulang(
                                      formatDateForInput(tempat.tanggalPulang)
                                    );
                                    setIsEditTempatOpen(true);
                                  }}
                                  _hover={{ transform: "translateY(-1px)" }}
                                  transition="all 0.2s"
                                >
                                  Edit Tempat
                                </Button>
                              )}
                            </HStack>
                            <HStack spacing={4} fontSize="sm" color="gray.600">
                              <HStack>
                                <Icon as={FiCalendar} color="purple.600" />
                                <Text>
                                  Berangkat:{" "}
                                  {new Date(
                                    tempat.tanggalBerangkat
                                  ).toLocaleDateString("id-ID")}
                                </Text>
                              </HStack>
                              <HStack>
                                <Icon as={FiCalendar} color="primary" />
                                <Text>
                                  Pulang:{" "}
                                  {new Date(
                                    tempat.tanggalPulang
                                  ).toLocaleDateString("id-ID")}
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </SimpleGrid>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Kolom Kanan - Bukti Kegiatan */}
              <GridItem>
                <Card
                  bg={cardBg}
                  borderColor={borderColor}
                  shadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  h="100%"
                >
                  <CardHeader
                    bg={headerBg}
                    borderBottom="1px"
                    borderColor={borderColor}
                  >
                    <Heading size="md" display="flex" align="center" gap={2}>
                      <Icon as={FiFileText} color="purple.500" />
                      Bukti Kegiatan
                    </Heading>
                  </CardHeader>
                  <CardBody p={0}>
                    <TambahBuktiKegiatan
                      fotoPerjalanan={
                        detailPerjalanan?.fotoPerjalanans || []
                      }
                      id={detailPerjalanan?.id}
                      status={detailPerjalanan?.personils?.[0]?.statusId || 1}
                      randomNumber={setRandomNumber}
                    />
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
            {/* Personil Section */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              shadow="lg"
              borderRadius="xl"
              overflow="hidden"
            >
              <CardHeader
                bg={headerBg}
                borderBottom="1px"
                borderColor={borderColor}
              >
                <Flex 
                  justify="space-between" 
                  align={{ base: "start", md: "center" }}
                  direction={{ base: "column", md: "row" }}
                  gap={4}
                >
                  <Heading
                    color={"white"}
                    size={{ base: "sm", md: "md" }}
                    display="flex"
                    align="center"
                    gap={2}
                    flexWrap="wrap"
                  >
                    <Icon as={FiUsers} color="white" />
                    Daftar Personil ({detailPerjalanan?.personils?.length}{" "}
                    orang)
                  </Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    {/* Tombol Buat Otomatis Semua */}
                    {!adaStatusDuaAtauTiga &&
                      semuaPersonilBelumAdaRincian &&
                      detailPerjalanan.jenisPerjalanan?.tipePerjalananId ===
                        1 && (
                        <Button
                          leftIcon={<FiCheckCircle />}
                          variant={"primary"}
                          onClick={buatOtomatisBulk}
                          isLoading={isCreatingAutoBulk}
                          loadingText="Membuat..."
                          size={{ base: "sm", md: "md" }}
                          transition="all 0.2s"
                        >
                          Buat Otomatis
                        </Button>
                      )}
                    {!adaStatusDuaAtauTiga &&
                      detailPerjalanan?.personils?.length < 5 && (
                        <Button
                          leftIcon={<FiUserPlus />}
                          variant={"primary"}
                          onClick={() => {
                            setPegawaiTambahId(null);
                            onTambahOpen();
                          }}
                          size={{ base: "sm", md: "md" }}
                          transition="all 0.2s"
                        >
                          Tambah Personil
                        </Button>
                      )}
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody p={{ base: 4, md: 6 }}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 6 }}>
                  {detailPerjalanan?.personils?.map((item, index) => {
                    const getStatusColor = (statusId) => {
                      switch (statusId) {
                        case 1:
                          return "yellow";
                        case 2:
                          return "green";
                        case 3:
                          return "blue";
                        default:
                          return "gray";
                      }
                    };

                    return (
                      <Card
                        key={index}
                        bg={useColorModeValue("gray.50", "gray.700")}
                        border="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        p={{ base: 3, md: 4 }}
                        transition="all 0.2s"
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-2px)",
                        }}
                      >
                        <VStack spacing={4} align="stretch">
                          {/* Header Personil */}
                          <HStack justify="space-between" align="start">
                            <HStack spacing={3}>
                              <Avatar
                                name={item.pegawai.nama}
                                size="md"
                                bg="primary"
                                color="white"
                                src={
                                  item.pegawai.profiles?.[0]?.profilePic
                                    ? `${
                                        import.meta.env
                                          .VITE_REACT_APP_API_BASE_URL
                                      }${item.pegawai.profiles[0].profilePic}`
                                    : undefined
                                }
                              />
                              <VStack align="start" spacing={1}>
                                <Text fontSize="lg" fontWeight="bold">
                                  {item.pegawai.nama}
                                </Text>
                                <HStack spacing={2}>
                                  <Text fontSize="sm" color="gray.500">
                                    SPD: {item.nomorSPD}
                                  </Text>
                                  <Badge
                                    colorScheme={getStatusColor(item.statusId)}
                                    variant="subtle"
                                    borderRadius="full"
                                  >
                                    {item?.status?.statusKuitansi}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </HStack>
                          </HStack>

                          {/* Rincian Biaya Perjalanan */}
                          {item.rincianBPDs && item.rincianBPDs.length > 0 && (
                            <>
                              <Divider />
                              <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between" align="center">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="gray.600"
                                    textTransform="uppercase"
                                  >
                                    Rincian Biaya Perjalanan
                                  </Text>
                                  <Icon as={FiDollarSign} color="green.500" />
                                </HStack>
                                <Box
                                  bg={useColorModeValue("white", "gray.600")}
                                  borderRadius="md"
                                  p={3}
                                  border="1px"
                                  borderColor={borderColor}
                                >
                                  <VStack align="stretch" spacing={2}>
                                    {item.rincianBPDs.map((rincian, idx) => {
                                      const subtotal = rincian.qty * rincian.nilai;
                                      return (
                                        <HStack
                                          key={idx}
                                          justify="space-between"
                                          align="start"
                                          pb={2}
                                          borderBottom={
                                            idx < item.rincianBPDs.length - 1
                                              ? "1px"
                                              : "none"
                                          }
                                          borderColor={borderColor}
                                        >
                                          <VStack align="start" spacing={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="medium">
                                              {rincian.item}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                              {rincian.qty} x{" "}
                                              {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                              }).format(rincian.nilai)}
                                            </Text>
                                          </VStack>
                                          <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="green.600"
                                          >
                                            {new Intl.NumberFormat("id-ID", {
                                              style: "currency",
                                              currency: "IDR",
                                              minimumFractionDigits: 0,
                                            }).format(subtotal)}
                                          </Text>
                                        </HStack>
                                      );
                                    })}
                                    <Divider />
                                    <HStack justify="space-between" align="center" pt={1}>
                                      <Text
                                        fontSize="md"
                                        fontWeight="bold"
                                        color="gray.700"
                                      >
                                        Total Biaya
                                      </Text>
                                      <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color="green.600"
                                      >
                                        {new Intl.NumberFormat("id-ID", {
                                          style: "currency",
                                          currency: "IDR",
                                          minimumFractionDigits: 0,
                                        }).format(
                                          item.rincianBPDs.reduce(
                                            (sum, rincian) =>
                                              sum + rincian.qty * rincian.nilai,
                                            0
                                          )
                                        )}
                                      </Text>
                                    </HStack>
                                  </VStack>
                                </Box>
                              </VStack>
                            </>
                          )}

                          {/* Action Buttons */}
                          <Divider />
                          <Flex gap={2} wrap="wrap">
                            <Button
                              leftIcon={<FiCheckCircle />}
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                history.push(`/rampung/${item.id}`);
                              }}
                              _hover={{
                                transform: "translateY(-1px)",
                              }}
                              transition="all 0.2s"
                            >
                              Rampung
                            </Button>

                            {/* Tombol Buat Otomatis - hanya untuk perjalanan dalam kota dan jika belum ada rincian */}
                            {/* {detailPerjalanan.jenisPerjalanan
                              ?.tipePerjalananId === 1 &&
                              (!item.rincianBPDs ||
                                item.rincianBPDs.length === 0) &&
                              item.statusId !== 2 &&
                              item.statusId !== 3 && (
                                <Button
                                  leftIcon={<FiCheckCircle />}
                                  colorScheme="green"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => buatOtomatis(item.id)}
                                  isLoading={isCreatingAuto}
                                  loadingText="Membuat..."
                                  _hover={{
                                    transform: "translateY(-1px)",
                                  }}
                                  transition="all 0.2s"
                                >
                                  Buat Otomatis
                                </Button>
                              )} */}

                            {item.statusId !== 2 && item.statusId !== 3 && (
                              <>
                                <Button
                                  leftIcon={<FiEdit3 />}
                                  colorScheme="primary"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setPersonilId(item.id);
                                    setPegawaiLamaId(item.pegawai.id);
                                    onEditOpen();
                                  }}
                                  _hover={{
                                    transform: "translateY(-1px)",
                                  }}
                                  transition="all 0.2s"
                                >
                                  Edit
                                </Button>
                                <Button
                                  leftIcon={<FiTrash2 />}
                                  colorScheme="red"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setPersonilHapusId(item.id);
                                    setNamaPegawaiHapus(item.pegawai.nama);
                                    onHapusOpen();
                                  }}
                                  _hover={{
                                    transform: "translateY(-1px)",
                                  }}
                                  transition="all 0.2s"
                                >
                                  Hapus
                                </Button>
                              </>
                            )}
                          </Flex>
                        </VStack>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </CardBody>
            </Card>
          </Container>
        </Box>

        <Modal
          closeOnOverlayClick={false}
          isOpen={isEditOpen}
          onClose={onEditClose}
          size="lg"
        >
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" maxWidth="600px" mx={4}>
            <ModalHeader
              bg={headerBg}
              borderTopRadius="xl"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiEdit3} color="purple.500" />
              Edit Personil
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={8}>
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="semibold" mb={3}>
                  Pilih Pegawai Baru
                </FormLabel>
                <AsyncSelect
                  loadOptions={async (inputValue) => {
                    if (!inputValue) return [];
                    try {
                      const res = await axios.get(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/pegawai/search?q=${inputValue}`
                      );

                      const filtered = res.data.result;

                      return filtered.map((val) => ({
                        value: val.id,
                        label: val.nama,
                      }));
                    } catch (err) {
                      console.error("Failed to load options:", err.message);
                      return [];
                    }
                  }}
                  placeholder="Ketik nama pegawai untuk mencari..."
                  onChange={(selectedOption) => {
                    setPegawaiId(selectedOption?.value || null);
                  }}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: "8px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "white",
                      border: "2px solid",
                      borderColor: "gray.200",
                      height: "50px",
                      _hover: { borderColor: "blue.300" },
                      _focus: {
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px blue.500",
                      },
                      minHeight: "50px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      bg: state.isFocused ? "purple.500" : "white",
                      color: state.isFocused ? "white" : "black",
                      _hover: { bg: "purple.500", color: "white" },
                    }),
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter gap={3} p={8}>
              <Button
                variant="outline"
                onClick={onEditClose}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="purple"
                leftIcon={<FiCheckCircle />}
                onClick={handleEditPegawai}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Tambah Personil */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isTambahOpen}
          onClose={onTambahClose}
          size="lg"
        >
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" maxWidth="600px" mx={4}>
            <ModalHeader
              bg={headerBg}
              borderTopRadius="xl"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiUserPlus} color="purple.500" />
              Tambah Personil
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={8}>
              <VStack spacing={4} align="stretch">
                {detailPerjalanan?.personils?.length >= 5 ? (
                  <Box
                    bg="orange.50"
                    p={4}
                    borderRadius="lg"
                    border="1px"
                    borderColor="orange.200"
                  >
                    <HStack spacing={2}>
                      <Icon as={FiInfo} color="orange.500" />
                      <Text
                        fontSize="md"
                        color="orange.700"
                        fontWeight="medium"
                      >
                        Maksimal personil adalah 5 orang. Tidak dapat menambah
                        personil lagi.
                      </Text>
                    </HStack>
                  </Box>
                ) : (
                  <>
                    <Box
                      bg={useColorModeValue("blue.50", "blue.900")}
                      p={3}
                      borderRadius="md"
                      border="1px"
                      borderColor="blue.200"
                    >
                      <HStack spacing={2}>
                        <Icon as={FiInfo} color="blue.500" />
                        <Text fontSize="sm" color="blue.700">
                          Personil saat ini:{" "}
                          {detailPerjalanan?.personils?.length} dari 5 orang
                        </Text>
                      </HStack>
                    </Box>
                    <FormControl>
                      <FormLabel fontSize="lg" fontWeight="semibold" mb={3}>
                        Pilih Pegawai
                      </FormLabel>
                      <AsyncSelect
                        loadOptions={async (inputValue) => {
                          if (!inputValue) return [];
                          try {
                            const res = await axios.get(
                              `${
                                import.meta.env.VITE_REACT_APP_API_BASE_URL
                              }/pegawai/search?q=${inputValue}`
                            );

                            const filtered = res.data.result;

                            // Filter out pegawai yang sudah ada di personil
                            const existingPegawaiIds =
                              detailPerjalanan?.personils?.map(
                                (p) => p.pegawai.id
                              ) || [];

                            return filtered
                              .filter(
                                (val) => !existingPegawaiIds.includes(val.id)
                              )
                              .map((val) => ({
                                value: val.id,
                                label: val.nama,
                              }));
                          } catch (err) {
                            console.error(
                              "Failed to load options:",
                              err.message
                            );
                            return [];
                          }
                        }}
                        placeholder="Ketik nama pegawai untuk mencari..."
                        onChange={(selectedOption) => {
                          setPegawaiTambahId(selectedOption?.value || null);
                        }}
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null,
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "8px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "white",
                            border: "2px solid",
                            borderColor: "gray.200",
                            height: "50px",
                            _hover: { borderColor: "blue.300" },
                            _focus: {
                              borderColor: "blue.500",
                              boxShadow: "0 0 0 1px blue.500",
                            },
                            minHeight: "50px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "purple.500" : "white",
                            color: state.isFocused ? "white" : "black",
                            _hover: { bg: "purple.500", color: "white" },
                          }),
                        }}
                      />
                    </FormControl>
                  </>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter gap={3} p={8}>
              <Button
                variant="outline"
                onClick={onTambahClose}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="purple"
                leftIcon={<FiUserPlus />}
                onClick={handleTambahPersonil}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
                isDisabled={
                  !pegawaiTambahId || detailPerjalanan?.personils?.length >= 5
                }
              >
                Tambah Personil
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Hapus Personil */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isHapusOpen}
          onClose={onHapusClose}
          size="md"
        >
          <ModalOverlay bg="redAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" maxWidth="500px" mx={4}>
            <ModalHeader
              bg="red.50"
              borderTopRadius="xl"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiTrash2} color="red.500" />
              Konfirmasi Hapus Personil
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={8}>
              <VStack spacing={4} align="stretch">
                <Box
                  bg="red.50"
                  p={4}
                  borderRadius="lg"
                  border="1px"
                  borderColor="red.200"
                >
                  <Text fontSize="lg" textAlign="center">
                    Apakah Anda yakin ingin menghapus personil
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="red.600"
                    textAlign="center"
                    mt={2}
                  >
                    {namaPegawaiHapus}
                  </Text>
                  <Text fontSize="lg" textAlign="center">
                    dari perjalanan ini?
                  </Text>
                </Box>
                <Box
                  bg="orange.50"
                  p={3}
                  borderRadius="md"
                  border="1px"
                  borderColor="orange.200"
                >
                  <HStack spacing={2}>
                    <Icon as={FiInfo} color="orange.500" />
                    <Text fontSize="sm" color="orange.700">
                      Tindakan ini tidak dapat dibatalkan.
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter gap={3} p={8}>
              <Button
                variant="outline"
                onClick={onHapusClose}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiTrash2 />}
                onClick={handleHapusPersonil}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Ya, Hapus Personil
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Edit Sub Kegiatan */}
        <Modal
          isOpen={isEditUntukOpen}
          onClose={() => setIsEditUntukOpen(false)}
          size="md"
        >
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" maxWidth="500px" mx={4}>
            <ModalHeader
              bg={headerBg}
              borderTopRadius="xl"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiEdit3} color="purple.500" />
              Edit Sub Kegiatan
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={8}>
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="semibold">
                  Pilih Sub Kegiatan Baru
                </FormLabel>
                <Select
                  placeholder="Pilih Sub Kegiatan"
                  value={editSubKegiatanId || ""}
                  onChange={(e) => setEditSubKegiatanId(e.target.value)}
                  borderRadius="lg"
                  border="2px solid"
                  borderColor="gray.200"
                  _hover={{ borderColor: "purple.300" }}
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px purple.500",
                  }}
                  height="50px"
                >
                  {dataSubKegiatan &&
                    dataSubKegiatan.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.subKegiatan}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter gap={3} p={8}>
              <Button
                variant="outline"
                onClick={() => setIsEditUntukOpen(false)}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="purple"
                leftIcon={<FiCheckCircle />}
                onClick={async () => {
                  try {
                    await axios.post(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/perjalanan/edit/${props.match.params.id}`,
                      {
                        subKegiatanId: editSubKegiatanId,
                      }
                    );
                    setIsEditUntukOpen(false);
                    await fetchDataPerjalan(); // Tunggu fetch selesai
                  } catch (err) {
                    console.error(err);
                  }
                }}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
                isDisabled={!editSubKegiatanId}
              >
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Edit Tempat Terpadu */}
        <Modal
          isOpen={isEditTempatOpen}
          onClose={() => setIsEditTempatOpen(false)}
          size="lg"
        >
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" maxWidth="600px" mx={4}>
            <ModalHeader
              bg={headerBg}
              borderTopRadius="xl"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FiEdit3} color="purple.500" />
              Edit Tempat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={8}>
              <VStack spacing={6} align="stretch">
                <Box
                  bg={useColorModeValue("gray.50", "gray.700")}
                  p={4}
                  borderRadius="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                    mb={2}
                  >
                    Tempat yang diedit:
                  </Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {detailPerjalanan?.tempats?.[selectedTempatIndex] &&
                    detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
                      ? detailPerjalanan.tempats[selectedTempatIndex].dalamKota
                          ?.nama
                      : detailPerjalanan.tempats[selectedTempatIndex].tempat}
                  </Text>
                </Box>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="md" fontWeight="semibold">
                      Tanggal Berangkat
                    </FormLabel>
                    <Input
                      type="date"
                      value={editTanggalBerangkat}
                      onChange={(e) => setEditTanggalBerangkat(e.target.value)}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: "purple.300" }}
                      _focus={{
                        borderColor: "purple.500",
                        boxShadow: "0 0 0 1px purple.500",
                      }}
                      height="45px"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="md" fontWeight="semibold">
                      Tanggal Pulang
                    </FormLabel>
                    <Input
                      type="date"
                      value={editTanggalPulang}
                      onChange={(e) => setEditTanggalPulang(e.target.value)}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: "purple.300" }}
                      _focus={{
                        borderColor: "purple.500",
                        boxShadow: "0 0 0 1px purple.500",
                      }}
                      height="45px"
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="md" fontWeight="semibold">
                    {detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
                      ? "Lokasi Dalam Kota"
                      : "Tujuan"}
                  </FormLabel>
                  {detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1 ? (
                    // Select untuk perjalanan dalam kota
                    <Select
                      placeholder="Pilih lokasi dalam kota..."
                      value={editDalamKotaId}
                      onChange={(e) => setEditDalamKotaId(e.target.value)}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: "purple.300" }}
                      _focus={{
                        borderColor: "purple.500",
                        boxShadow: "0 0 0 1px purple.500",
                      }}
                      height="45px"
                    >
                      {dataDalamKota &&
                        dataDalamKota.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nama}
                          </option>
                        ))}
                    </Select>
                  ) : (
                    // Input text untuk perjalanan luar kota
                    <Input
                      type="text"
                      value={editTujuan}
                      onChange={(e) => setEditTujuan(e.target.value)}
                      placeholder="Masukkan tujuan..."
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: "purple.300" }}
                      _focus={{
                        borderColor: "purple.500",
                        boxShadow: "0 0 0 1px purple.500",
                      }}
                      height="45px"
                    />
                  )}
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter gap={3} p={8}>
              <Button
                variant="outline"
                onClick={() => setIsEditTempatOpen(false)}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="purple"
                leftIcon={<FiCheckCircle />}
                onClick={handleEditTempat}
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
                isDisabled={
                  !editTanggalBerangkat ||
                  !editTanggalPulang ||
                  (detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
                    ? !editDalamKotaId
                    : !editTujuan)
                }
              >
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default Detail;
