import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useDisclosure } from "@chakra-ui/react";
import Foto from "../../assets/add_photo.png";
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Center,
  Td,
  Flex,
  Textarea,
  Input,
  Spacer,
  useToast,
  FormControl,
  FormLabel,
  Select,
  HStack,
  VStack,
  Heading,
  Badge,
  Divider,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import Loading from "../../Componets/Loading";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../../Redux/Reducers/auth";

function RampungAdmin(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState("");
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [isModalBatalOpen, setIsModalBatalOpen] = useState(false);
  const [alasanBatal, setAlasanBatal] = useState("");
  const [dataTemplate, setDataTemplate] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const user = useSelector(userRedux);
  const [templateId, setTemplateId] = useState(null);

  // Debug modal state
  useEffect(() => {
    console.log("Modal state:", { isOpen, selectedImage });
  }, [isOpen, selectedImage]);

  // Test modal function
  const testModal = () => {
    console.log("Testing modal...");
    setSelectedImage(Foto);
    console.log("Selected image set to:", Foto);
    onOpen();
    console.log("Modal opened");
  };

  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/template/download-undangan`,
        {
          params: { fileName },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mengunduh file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const terimaVerifikasi = (personilId) => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/verifikasi/terima`,
        { personilId }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataPerjalanan();
        toast({
          title: "Berhasil!",
          description: "Verifikasi berhasil diterima",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal menerima verifikasi",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const batalkanVerifikasi = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/verifikasi/tolak`,
        { personilId: selectedItemId, catatan: alasanBatal }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataPerjalanan();
        setIsModalBatalOpen(false);
        setAlasanBatal("");
        setSelectedItemId(null);
        toast({
          title: "Berhasil!",
          description: "Verifikasi berhasil dibatalkan",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal membatalkan verifikasi",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/get/detail-perjalanan/${props.match.params.id}`
      )
      .then((res) => {
        setDetailPerjalanan(res.data.result);
        setDataTemplate(res.data.template);
        if (res.data.result?.template?.[0]?.id) {
          setTemplateId(res.data.result.template[0].id);
        } else if (res.data.template?.[0]?.id) {
          setTemplateId(res.data.template[0].id);
        }
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal mengambil data perjalanan",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }

  const totalDurasi =
    detailPerjalanan?.tempats?.reduce(
      (total, tempat) => total + (tempat?.dalamKota?.durasi || 0),
      0
    ) || 0;

  const cetak = (val) => {
    if (!templateId) {
      toast({
        title: "Error!",
        description:
          "Template belum dipilih. Silakan pilih template terlebih dahulu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsPrinting(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/cetak-kwitansi`,
        {
          indukUnitKerja:
            user[0]?.unitKerja_profile?.indukUnitKerja?.indukUnitKerja,
          nomorSPD: val?.nomorSPD,
          nomorST: detailPerjalanan?.noSuratTugas,
          pegawaiNama: val?.pegawai?.nama,
          pegawaiNip: val?.pegawai?.nip,
          pegawaiJabatan: val?.pegawai?.jabatan,
          untuk: detailPerjalanan?.untuk,
          PPTKNama: detailPerjalanan?.PPTK?.pegawai_PPTK?.nama,
          PPTKNip: detailPerjalanan?.PPTK?.pegawai_PPTK?.nip,
          KPANama: detailPerjalanan?.KPA?.pegawai_KPA?.nama,
          KPANip: detailPerjalanan?.KPA?.pegawai_KPA?.nip,
          KPAJabatan: detailPerjalanan?.KPA?.jabatan,
          templateId,
          subKegiatan: detailPerjalanan?.daftarSubKegiatan?.subKegiatan,
          kodeRekening: `${
            detailPerjalanan?.daftarSubKegiatan?.kodeRekening || ""
          }${detailPerjalanan?.jenisPerjalanan?.kodeRekening || ""}`,
          rincianBPD: val?.rincianBPDs,
          tanggalPengajuan: detailPerjalanan?.tanggalPengajuan,
          totalDurasi,
          jenis: detailPerjalanan?.jenisId,
          tempat: detailPerjalanan?.tempats,
          jenisPerjalanan: detailPerjalanan?.jenisPerjalanan?.jenis,
          dataBendahara: detailPerjalanan?.bendahara,
          tahun: detailPerjalanan?.tanggalPengajuan
            ? new Date(detailPerjalanan.tanggalPengajuan).getFullYear()
            : new Date().getFullYear(),
        },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `kuitansi_${val?.pegawai?.nama}${props.match.params.id}.docx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast({
          title: "Berhasil!",
          description: "File berhasil diunduh.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal mengunduh file.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsPrinting(false);
      });
  };

  function renderTemplate() {
    return dataTemplate?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "gray";
      case 2:
        return "blue";
      case 3:
        return "purple";
      case 4:
        return "orange";
      case 5:
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusText = (statusId) => {
    switch (statusId) {
      case 1:
        return "Pending";
      case 2:
        return "Menunggu Verifikasi";
      case 3:
        return "Diverifikasi";
      case 4:
        return "Diproses";
      case 5:
        return "Selesai";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    fetchDataPerjalanan();
  }, []);

  if (!detailPerjalanan || Object.keys(detailPerjalanan).length === 0) {
    return (
      <Layout>
        <Box p={8}>
          <Center>
            <Loading />
          </Center>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {isPrinting && <Loading />}
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="1400px" px={4}>
          {/* Header Section */}
          <Box mb={8}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="lg" color="gray.800" mb={2}>
                  Detail Perjalanan Dinas
                </Heading>
              </Box>
            </Flex>
          </Box>

          {/* Main Content Grid */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 400px" }}
            gap={8}
            mb={8}
          >
            {/* Left Column - Image and Details */}
            <GridItem>
              <Card shadow="lg" borderRadius="xl" overflow="hidden">
                <CardHeader bg="primary" color="white" py={6}>
                  <Heading size="md">Foto Bukti Kegiatan</Heading>
                </CardHeader>
                <CardBody p={0}>
                  <Image
                    src={
                      detailPerjalanan?.pic
                        ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                          detailPerjalanan?.pic
                        : Foto
                    }
                    alt="Bukti Kegiatan"
                    w="100%"
                    h="1000px"
                    objectFit="cover"
                    cursor="pointer"
                    onClick={() => {
                      if (detailPerjalanan?.pic) {
                        setSelectedImage(
                          import.meta.env.VITE_REACT_APP_API_BASE_URL +
                            detailPerjalanan?.pic
                        );
                        onOpen();
                      }
                    }}
                    _hover={{ opacity: 0.9 }}
                    transition="opacity 0.2s"
                  />
                </CardBody>
              </Card>
            </GridItem>

            {/* Right Column - Information */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Basic Info Card */}
                <Card shadow="md" borderRadius="lg">
                  <CardHeader bg="gray.50" py={4}>
                    <Heading size="sm" color="gray.700">
                      Informasi Dasar
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Asal
                        </Text>
                        <Text fontSize="md">
                          {detailPerjalanan.asal || "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Dasar
                        </Text>
                        <Text fontSize="md">
                          {detailPerjalanan.dasar || "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          No. Surat Tugas
                        </Text>
                        <Text fontSize="md" fontFamily="mono">
                          {detailPerjalanan.noSuratTugas || "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          No. Nota Dinas
                        </Text>
                        <Text fontSize="md" fontFamily="mono">
                          {detailPerjalanan.isNotaDinas
                            ? detailPerjalanan.noNotaDinas
                            : "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          No. Telaahan Staf
                        </Text>
                        <Text fontSize="md" fontFamily="mono">
                          {detailPerjalanan.isNotaDinas
                            ? "-"
                            : detailPerjalanan.noNotaDinas || "-"}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Date Info Card */}
                <Card shadow="md" borderRadius="lg">
                  <CardHeader bg="green.50" py={4}>
                    <Heading size="sm" color="green.700">
                      Informasi Tanggal
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Tanggal Pengajuan
                        </Text>
                        <Text fontSize="md">
                          {detailPerjalanan.tanggalPengajuan
                            ? new Date(
                                detailPerjalanan.tanggalPengajuan
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Tanggal Berangkat
                        </Text>
                        <Text fontSize="md">
                          {detailPerjalanan.tempats?.[0]?.tanggalBerangkat
                            ? new Date(
                                detailPerjalanan.tempats[0].tanggalBerangkat
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Tanggal Pulang
                        </Text>
                        <Text fontSize="md">
                          {detailPerjalanan.tempats?.[
                            detailPerjalanan.tempats?.length - 1
                          ]?.tanggalPulang
                            ? new Date(
                                detailPerjalanan.tempats[
                                  detailPerjalanan.tempats.length - 1
                                ].tanggalPulang
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Financial Info Card */}
                <Card shadow="md" borderRadius="lg">
                  <CardHeader bg="purple.50" py={4}>
                    <Heading size="sm" color="purple.700">
                      Informasi Keuangan
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Sumber Dana
                        </Text>
                        <Text fontSize="md">
                          {detailPerjalanan?.bendahara?.sumberDana?.sumber ||
                            "-"}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Tujuan
                        </Text>
                        <Text fontSize="md">{daftarTempat || "-"}</Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="semibold"
                          color="gray.600"
                          fontSize="sm"
                        >
                          Kode Rekening
                        </Text>
                        <Text fontSize="md" fontFamily="mono">
                          {`${
                            detailPerjalanan?.daftarSubKegiatan?.kodeRekening ||
                            ""
                          }${
                            detailPerjalanan?.jenisPerjalanan?.kodeRekening ||
                            ""
                          }`}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Template Selection */}
                <Card shadow="md" borderRadius="lg">
                  <CardHeader bg="orange.50" py={4}>
                    <Heading size="sm" color="orange.700">
                      Pilih Template
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <FormControl>
                      <Select
                        size="lg"
                        bg="white"
                        borderRadius="md"
                        borderColor="gray.300"
                        value={templateId || ""}
                        onChange={(e) => setTemplateId(e.target.value)}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "outline",
                        }}
                      >
                        <option value="">Pilih Template</option>
                        {renderTemplate()}
                      </Select>
                    </FormControl>
                  </CardBody>
                </Card>

                {/* Undangan Download */}
                {detailPerjalanan?.undangan && (
                  <Card shadow="md" borderRadius="lg">
                    <CardHeader bg="teal.50" py={4}>
                      <Heading size="sm" color="teal.700">
                        File Undangan
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <Button
                        colorScheme="teal"
                        size="md"
                        w="100%"
                        onClick={() =>
                          handleDownload(detailPerjalanan?.undangan)
                        }
                        leftIcon={<Box as="span">📄</Box>}
                      >
                        Download Undangan
                      </Button>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </GridItem>
          </Grid>

          {/* Personnel List Section */}
          <Box mb={8}>
            <Heading size="lg" color="gray.800" mb={6}>
              Daftar Personil
            </Heading>
            {detailPerjalanan?.personils?.map((item, index) => (
              <Card
                key={index}
                shadow="lg"
                borderRadius="xl"
                mb={6}
                overflow="hidden"
              >
                <CardHeader bg="gray.50" py={4}>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Heading size="md" color="gray.800">
                        {item?.pegawai?.nama}
                      </Heading>
                      <Text color="gray.600" fontSize="sm">
                        NIP: {item?.pegawai?.nip}
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        Nomor SPD: {item?.nomorSPD}
                      </Text>
                    </Box>
                    <Badge
                      colorScheme={getStatusColor(item.statusId)}
                      size="lg"
                      px={4}
                      py={2}
                      borderRadius="full"
                    >
                      {getStatusText(item.statusId)}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  {/* Rincian BPD Table */}
                  <Box mb={6}>
                    <Heading size="sm" color="gray.700" mb={4}>
                      Rincian Biaya Perjalanan Dinas
                    </Heading>
                    <Box overflowX="auto">
                      <Table variant="simple" size="sm">
                        <Thead bg="green.50">
                          <Tr>
                            <Th>Jenis</Th>
                            <Th>Item</Th>
                            <Th isNumeric>Nilai</Th>
                            <Th isNumeric>Qty</Th>
                            <Th>Satuan</Th>
                            <Th isNumeric>Total</Th>
                            <Th>Bukti</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {item.rincianBPDs?.map((val, idx) => (
                            <React.Fragment key={idx}>
                              <Tr>
                                <Td fontWeight="medium">
                                  {val.jenisRincianBPD?.jenis}
                                </Td>
                                <Td>{val.item}</Td>
                                <Td isNumeric fontFamily="mono">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(val.nilai)}
                                </Td>
                                <Td isNumeric>{val.qty}</Td>
                                <Td>{val.satuan}</Td>
                                <Td fontFamily="mono" isNumeric>
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(val.nilai * val.qty)}
                                </Td>
                                <Td>
                                  <Image
                                    src={
                                      val.bukti
                                        ? import.meta.env
                                            .VITE_REACT_APP_API_BASE_URL +
                                          val.bukti
                                        : Foto
                                    }
                                    alt="Bukti"
                                    w="80px"
                                    h="60px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    cursor="pointer"
                                    onClick={() => {
                                      console.log(
                                        "Foto bukti diklik:",
                                        val.bukti
                                      );
                                      if (val.bukti) {
                                        const imageUrl =
                                          import.meta.env
                                            .VITE_REACT_APP_API_BASE_URL +
                                          val.bukti;
                                        console.log("URL gambar:", imageUrl);
                                        setSelectedImage(imageUrl);
                                        onOpen();
                                      } else {
                                        console.log("Tidak ada bukti");
                                        toast({
                                          title: "Info",
                                          description:
                                            "Tidak ada bukti untuk ditampilkan",
                                          status: "info",
                                          duration: 2000,
                                          isClosable: true,
                                        });
                                      }
                                    }}
                                    _hover={{ opacity: 0.8 }}
                                    transition="opacity 0.2s"
                                  />
                                </Td>
                              </Tr>
                              {val.rills?.length > 0 && (
                                <Tr>
                                  <Td colSpan={7}>
                                    <Box bg="gray.50" p={3} borderRadius="md">
                                      <Text
                                        fontWeight="semibold"
                                        mb={2}
                                        color="gray.700"
                                      >
                                        Detail Rincian:
                                      </Text>
                                      <Table size="sm" variant="unstyled">
                                        <Thead>
                                          <Tr>
                                            <Th>Item</Th>
                                            <Th isNumeric>Nilai</Th>
                                          </Tr>
                                        </Thead>
                                        <Tbody>
                                          {val.rills.map((rill, rillIndex) => (
                                            <Tr key={rillIndex}>
                                              <Td pl={6}>{rill.item}</Td>
                                              <Td isNumeric fontFamily="mono">
                                                {new Intl.NumberFormat(
                                                  "id-ID",
                                                  {
                                                    style: "currency",
                                                    currency: "IDR",
                                                  }
                                                ).format(rill.nilai)}
                                              </Td>
                                            </Tr>
                                          ))}
                                        </Tbody>
                                      </Table>
                                    </Box>
                                  </Td>
                                </Tr>
                              )}
                            </React.Fragment>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>

                  {/* Total Per Personil */}
                  <Box
                    bg="green.50"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="green.200"
                    mb={4}
                  >
                    <Stat>
                      <StatLabel color="green.700" fontWeight="semibold">
                        Total Uang Perjalanan {item?.pegawai?.nama}
                      </StatLabel>
                      <StatNumber color="green.800" fontSize="xl">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(
                          item.rincianBPDs?.reduce((total, val) => {
                            const rincianTotal = val.nilai * val.qty;
                            const rillTotal =
                              val.rills?.reduce(
                                (rillSum, rill) => rillSum + rill.nilai,
                                0
                              ) || 0;
                            return total + rincianTotal;
                          }, 0) || 0
                        )}
                      </StatNumber>
                    </Stat>
                  </Box>

                  {/* Action Buttons */}
                  <Flex gap={3} flexWrap="wrap">
                    {item.statusId === 2 && (
                      <>
                        <Button
                          colorScheme="green"
                          size="md"
                          onClick={() => terimaVerifikasi(item.id)}
                          leftIcon={<Box as="span">✅</Box>}
                        >
                          Verifikasi
                        </Button>
                        <Button
                          colorScheme="red"
                          size="md"
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setIsModalBatalOpen(true);
                          }}
                          leftIcon={<Box as="span">❌</Box>}
                        >
                          Batalkan
                        </Button>
                      </>
                    )}
                    <Button
                      colorScheme="blue"
                      size="md"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setSelectedData(item);
                        cetak(item);
                      }}
                      leftIcon={<Box as="span">🖨️</Box>}
                      isDisabled={!templateId}
                    >
                      Cetak Kwitansi
                    </Button>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Box>

          {/* Total Summary */}
          <Card
            shadow="xl"
            borderRadius="xl"
            bg="gradient-to-r"
            bgGradient="linear(to-r, green.400, blue.500)"
          >
            <CardBody p={8}>
              <Stat textAlign="center">
                <StatLabel color="white" fontSize="lg" fontWeight="semibold">
                  Total Uang Perjalanan Semua Pegawai
                </StatLabel>
                <StatNumber color="white" fontSize="3xl" fontWeight="bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(
                    detailPerjalanan?.personils?.reduce(
                      (totalPersonil, item) => {
                        const personilTotal =
                          item.rincianBPDs?.reduce((total, val) => {
                            const rincianTotal = val.nilai * val.qty;

                            return total + rincianTotal;
                          }, 0) || 0;
                        return totalPersonil + personilTotal;
                      },
                      0
                    ) || 0
                  )}
                </StatNumber>
                <StatHelpText color="white" fontSize="md">
                  Total keseluruhan biaya perjalanan dinas
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Container>

        {/* Image Modal - Simplified Version */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalHeader>Preview Gambar</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box textAlign="center" p={4}>
                <Image
                  src={selectedImage || Foto}
                  alt="Preview"
                  maxW="100%"
                  maxH="70vh"
                  objectFit="contain"
                  fallbackSrc={Foto}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Box
            position="fixed"
            bottom={4}
            right={4}
            bg="black"
            color="white"
            p={2}
            borderRadius="md"
            fontSize="xs"
          >
            <Text>Modal State: {isOpen ? "Open" : "Closed"}</Text>
            <Text>Selected Image: {selectedImage ? "Yes" : "No"}</Text>
          </Box>
        )}

        {/* Cancel Modal */}
        <Modal
          isOpen={isModalBatalOpen}
          onClose={() => setIsModalBatalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alasan Pembatalan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Masukkan alasan pembatalan:</FormLabel>
                <Textarea
                  value={alasanBatal}
                  onChange={(e) => setAlasanBatal(e.target.value)}
                  placeholder="Tuliskan alasan pembatalan verifikasi..."
                  rows={4}
                  resize="vertical"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                colorScheme="red"
                onClick={() => batalkanVerifikasi(selectedItemId)}
                isDisabled={!alasanBatal.trim()}
              >
                Batalkan Verifikasi
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsModalBatalOpen(false)}
              >
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export default RampungAdmin;
