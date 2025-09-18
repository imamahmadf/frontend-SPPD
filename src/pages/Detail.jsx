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

function Detail(props) {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tambah state loading
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
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/detail-perjalanan/${props.match.params.id}`
      )
      .then((res) => {
        setDetailPerjalanan(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
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

  const history = useHistory();

  useEffect(() => {
    // Jalankan kedua fetch dan set loading false setelah keduanya selesai
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchDataPerjalan(), fetchSubKegiatan()]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  const [pegawaiId, setPegawaiId] = useState(null); // id pegawai baru
  const [personilId, setPersonilId] = useState(null); // id personil yang diedit
  const [pegawaiLamaId, setPegawaiLamaId] = useState(null); // id pegawai lama
  const [personilHapusId, setPersonilHapusId] = useState(null); // id personil yang akan dihapus
  const [namaPegawaiHapus, setNamaPegawaiHapus] = useState(""); // nama pegawai yang akan dihapus
  const [isEditUntukOpen, setIsEditUntukOpen] = useState(false); // modal edit untuk
  const [editUntukValue, setEditUntukValue] = useState(""); // nilai untuk yang diedit
  const [editSubKegiatanId, setEditSubKegiatanId] = useState(null); // nilai sub kegiatan yang diedit

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
      fetchDataPerjalan(); // refresh data
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
      fetchDataPerjalan(); // refresh data
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  // Ambil semua statusId dari personils
  const statusIds = detailPerjalanan?.personils?.map((item) => item.statusId);

  // Cek apakah ada statusId yang 2 atau 3
  const adaStatusDuaAtauTiga = statusIds?.includes(2) || statusIds?.includes(3);

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

            py={8}
            mb={8}
          >
            <Container maxW="1280px">
              <Flex align="center" justify="space-between">
                <VStack align="start" spacing={2}>
                  <Heading size="lg" display="flex" align="center" gap={3}>
                    <Icon as={FiInfo} boxSize={6} />
                    Detail Perjalanan Dinas
                  </Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    Informasi lengkap perjalanan dinas dan personil
                  </Text>
                </VStack>
                {!adaStatusDuaAtauTiga && (
                  <Button
                    leftIcon={<FiEdit3 />}
                    colorScheme="whiteAlpha"
                    variant="outline"
                    size="lg"
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
                  >
                    Edit Perjalanan
                  </Button>
                )}
              </Flex>
            </Container>
          </Box>

          <Container maxW="1380px" px={6}>
            {/* Informasi Perjalanan Card */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              shadow="lg"
              borderRadius="xl"
              mb={8}
              overflow="hidden"
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
              <CardBody p={8}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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

                  {/* Tanggal Berangkat */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Tanggal Berangkat
                    </Text>
                    <HStack>
                      <Icon as={FiCalendar} color="purple.600" />
                      <Text fontSize="lg" fontWeight="medium">
                        {new Date(
                          detailPerjalanan.tempats?.[0]?.tanggalBerangkat
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Tanggal Pulang */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Tanggal Pulang
                    </Text>
                    <HStack>
                      <Icon as={FiCalendar} color="primary" />
                      <Text fontSize="lg" fontWeight="medium">
                        {new Date(
                          detailPerjalanan.tempats?.[
                            detailPerjalanan.tempats?.length - 1
                          ]?.tanggalPulang
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

                  {/* Tujuan */}
                  <VStack align="start" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.500"
                      textTransform="uppercase"
                    >
                      Tujuan
                    </Text>
                    <HStack>
                      <Icon as={FiMapPin} color="primary" />
                      <Text fontSize="lg" fontWeight="medium">
                        {daftarTempat}
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
                </SimpleGrid>
              </CardBody>
            </Card>
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
                <Heading
                  color={"white"}
                  size="md"
                  display="flex"
                  align="center"
                  gap={2}
                >
                  <Icon as={FiUsers} color="white" />
                  Daftar Personil ({detailPerjalanan?.personils?.length} orang)
                </Heading>
              </CardHeader>
              <CardBody p={6}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
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
                        p={4}
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
                    setPegawaiId(selectedOption.value);
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
                  setIsLoading(true); // Mulai loading
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
                  setIsLoading(false); // Pastikan loading di-set false
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
      </Layout>
    </>
  );
}

export default Detail;
