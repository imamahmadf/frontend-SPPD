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
  Stack,
  Skeleton,
  SkeletonText,
  useToast,
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
  FiArrowLeft,
  FiBookOpen,
  FiHome,
  FiFlag,
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
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  
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
    setIsLoading(true);
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
        toast({
          title: "Error",
          description: "Gagal memuat data perjalanan",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
        toast({
          title: "Error",
          description: "Gagal memuat data sub kegiatan",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }

  const history = useHistory();

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchDataPerjalan(), fetchSubKegiatan()]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  const [pegawaiId, setPegawaiId] = useState(null);
  const [personilId, setPersonilId] = useState(null);
  const [pegawaiLamaId, setPegawaiLamaId] = useState(null);
  const [personilHapusId, setPersonilHapusId] = useState(null);
  const [namaPegawaiHapus, setNamaPegawaiHapus] = useState("");
  const [isEditUntukOpen, setIsEditUntukOpen] = useState(false);
  const [editUntukValue, setEditUntukValue] = useState("");
  const [editSubKegiatanId, setEditSubKegiatanId] = useState(null);

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
      fetchDataPerjalan();
      toast({
        title: "Berhasil",
        description: "Personil berhasil diperbarui",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal memperbarui personil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      fetchDataPerjalan();
      setIsLoading(false);
      toast({
        title: "Berhasil",
        description: "Personil berhasil dihapus",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Gagal menghapus personil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const statusIds = detailPerjalanan?.personils?.map((item) => item.statusId);
  const adaStatusDuaAtauTiga = statusIds?.includes(2) || statusIds?.includes(3);

  if (isLoading) return <Loading />;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("blue.600", "blue.700");
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, pink.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const shadowColor = useColorModeValue("rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)");

  return (
    <>
      <Layout>
        <Box minH="100vh" bg={bgGradient}>
          {/* Enhanced Header Section */}
          <Box
            bgGradient="linear(to-r, blue.600, purple.600, pink.600)"
            py={12}
            mb={8}
            position="relative"
            overflow="hidden"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity={0.1}
              bgImage="radial-gradient(circle, white 1px, transparent 1px)"
              bgSize="20px 20px"
            />
            
            <Container maxW="1400px" position="relative">
              <VStack spacing={6} align="stretch">
                {/* Breadcrumb */}
                <HStack spacing={2} color="whiteAlpha.800" fontSize="sm">
                  <Icon as={FiHome} />
                  <Text>Dashboard</Text>
                  <Icon as={FiArrowRight} />
                  <Text>Perjalanan Dinas</Text>
                  <Icon as={FiArrowRight} />
                  <Text color="white" fontWeight="semibold">Detail</Text>
                </HStack>

                <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Button
                        leftIcon={<FiArrowLeft />}
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "whiteAlpha.200" }}
                        onClick={() => history.goBack()}
                      >
                        Kembali
                      </Button>
                    </HStack>
                    <Heading 
                      size="2xl" 
                      color="white" 
                      display="flex" 
                      align="center" 
                      gap={4}
                      textShadow="0 2px 4px rgba(0,0,0,0.3)"
                    >
                      <Icon as={FiBookOpen} boxSize={8} />
                      Detail Perjalanan Dinas
                    </Heading>
                    <Text fontSize="xl" color="whiteAlpha.900" maxW="600px">
                      Informasi lengkap perjalanan dinas dan personil yang terlibat
                    </Text>
                  </VStack>
                  
                  {!adaStatusDuaAtauTiga && (
                    <VStack spacing={3}>
                      <Button
                        leftIcon={<FiEdit3 />}
                        size="lg"
                        colorScheme="whiteAlpha"
                        variant="solid"
                        bg="whiteAlpha.200"
                        color="white"
                        backdropFilter="blur(10px)"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        onClick={() => {
                          setEditUntukValue(detailPerjalanan.untuk || "");
                          setEditSubKegiatanId(
                            detailPerjalanan?.daftarSubKegiatan?.id || null
                          );
                          setIsEditUntukOpen(true);
                        }}
                        _hover={{
                          bg: "whiteAlpha.300",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                      >
                        Edit Perjalanan
                      </Button>
                    </VStack>
                  )}
                </Flex>
              </VStack>
            </Container>
          </Box>

          <Container maxW="1400px" px={6}>
            {/* Enhanced Information Card */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              shadow="2xl"
              borderRadius="2xl"
              mb={8}
              overflow="hidden"
              border="1px solid"
              _hover={{
                shadow: "3xl",
                transform: "translateY(-2px)",
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <CardHeader
                bgGradient="linear(to-r, blue.600, purple.600)"
                color="white"
                py={6}
              >
                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="whiteAlpha.200"
                    borderRadius="lg"
                    backdropFilter="blur(10px)"
                  >
                    <Icon as={FiFileText} boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">Informasi Perjalanan</Heading>
                    <Text fontSize="sm" opacity={0.9}>
                      Detail lengkap perjalanan dinas
                    </Text>
                  </VStack>
                </HStack>
              </CardHeader>
              
              <CardBody p={8}>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
                  {/* Enhanced Information Items */}
                  {[
                    { 
                      label: "Asal", 
                      value: detailPerjalanan.asal, 
                      icon: FiHome, 
                      color: "blue.500" 
                    },
                    { 
                      label: "Dasar", 
                      value: detailPerjalanan.dasar || "-", 
                      icon: FiFileText, 
                      color: "purple.500" 
                    },
                    { 
                      label: "Untuk", 
                      value: detailPerjalanan.untuk, 
                      icon: FiTarget, 
                      color: "green.500" 
                    },
                    { 
                      label: "No. Surat Tugas", 
                      value: detailPerjalanan.noSuratTugas, 
                      icon: FiFileText, 
                      color: "orange.500" 
                    },
                    { 
                      label: "No. Nota Dinas", 
                      value: detailPerjalanan.isNotaDinas ? detailPerjalanan.noNotaDinas : "-", 
                      icon: FiFileText, 
                      color: "teal.500" 
                    },
                    { 
                      label: "No. Telaahan Staf", 
                      value: detailPerjalanan.isNotaDinas ? "-" : detailPerjalanan.noNotaDinas, 
                      icon: FiFileText, 
                      color: "pink.500" 
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      p={6}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={useColorModeValue("gray.100", "gray.600")}
                      _hover={{
                        shadow: "md",
                        transform: "translateY(-2px)",
                        borderColor: item.color,
                      }}
                      transition="all 0.3s"
                    >
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Box
                            p={2}
                            bg={`${item.color.split('.')[0]}.100`}
                            borderRadius="lg"
                          >
                            <Icon as={item.icon} color={item.color} boxSize={5} />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.500"
                            textTransform="uppercase"
                            letterSpacing="wide"
                          >
                            {item.label}
                          </Text>
                        </HStack>
                        <Text fontSize="lg" fontWeight="semibold" lineHeight="short">
                          {item.value}
                        </Text>
                      </VStack>
                    </Box>
                  ))}

                  {/* Date Information */}
                  {[
                    {
                      label: "Tanggal Pengajuan",
                      value: new Date(detailPerjalanan.tanggalPengajuan).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                      icon: FiCalendar,
                      color: "blue.500"
                    },
                    {
                      label: "Tanggal Berangkat",
                      value: new Date(detailPerjalanan.tempats?.[0]?.tanggalBerangkat).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                      icon: FiCalendar,
                      color: "green.500"
                    },
                    {
                      label: "Tanggal Pulang",
                      value: new Date(
                        detailPerjalanan.tempats?.[detailPerjalanan.tempats?.length - 1]?.tanggalPulang
                      ).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                      icon: FiCalendar,
                      color: "red.500"
                    },
                  ].map((item, index) => (
                    <Box
                      key={`date-${index}`}
                      p={6}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={useColorModeValue("gray.100", "gray.600")}
                      _hover={{
                        shadow: "md",
                        transform: "translateY(-2px)",
                        borderColor: item.color,
                      }}
                      transition="all 0.3s"
                    >
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Box
                            p={2}
                            bg={`${item.color.split('.')[0]}.100`}
                            borderRadius="lg"
                          >
                            <Icon as={item.icon} color={item.color} boxSize={5} />
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.500"
                            textTransform="uppercase"
                            letterSpacing="wide"
                          >
                            {item.label}
                          </Text>
                        </HStack>
                        <Text fontSize="lg" fontWeight="semibold" lineHeight="short">
                          {item.value}
                        </Text>
                      </VStack>
                    </Box>
                  ))}

                  {/* Additional Information */}
                  {[
                    {
                      label: "Sumber Dana",
                      value: detailPerjalanan.bendahara?.sumberDana?.sumber,
                      icon: FiDollarSign,
                      color: "yellow.500"
                    },
                    {
                      label: "Tujuan",
                      value: daftarTempat,
                      icon: FiMapPin,
                      color: "red.500"
                    },
                    {
                      label: "Sub Kegiatan",
                      value: detailPerjalanan?.daftarSubKegiatan?.subKegiatan,
                      icon: FiTarget,
                      color: "purple.500",
                      hasEdit: true
                    },
                  ].map((item, index) => (
                    <Box
                      key={`additional-${index}`}
                      p={6}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={useColorModeValue("gray.100", "gray.600")}
                      _hover={{
                        shadow: "md",
                        transform: "translateY(-2px)",
                        borderColor: item.color,
                      }}
                      transition="all 0.3s"
                    >
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3} justify="space-between" w="full">
                          <HStack spacing={3}>
                            <Box
                              p={2}
                              bg={`${item.color.split('.')[0]}.100`}
                              borderRadius="lg"
                            >
                              <Icon as={item.icon} color={item.color} boxSize={5} />
                            </Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="gray.500"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {item.label}
                            </Text>
                          </HStack>
                          {item.hasEdit && !adaStatusDuaAtauTiga && (
                            <Button
                              size="sm"
                              leftIcon={<FiEdit3 />}
                              colorScheme="purple"
                              variant="ghost"
                              onClick={() => {
                                setEditSubKegiatanId(
                                  detailPerjalanan?.daftarSubKegiatan?.id || ""
                                );
                                setIsEditUntukOpen(true);
                              }}
                              _hover={{ 
                                transform: "translateY(-1px)",
                                bg: "purple.50"
                              }}
                              transition="all 0.2s"
                            >
                              Edit
                            </Button>
                          )}
                        </HStack>
                        <Text fontSize="lg" fontWeight="semibold" lineHeight="short">
                          {item.value}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Enhanced Personil Section */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              shadow="2xl"
              borderRadius="2xl"
              overflow="hidden"
              border="1px solid"
              _hover={{
                shadow: "3xl",
                transform: "translateY(-2px)",
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <CardHeader
                bgGradient="linear(to-r, purple.600, pink.600)"
                color="white"
                py={6}
              >
                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="whiteAlpha.200"
                    borderRadius="lg"
                    backdropFilter="blur(10px)"
                  >
                    <Icon as={FiUsers} boxSize={6} />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">
                      Daftar Personil ({detailPerjalanan?.personils?.length} orang)
                    </Heading>
                    <Text fontSize="sm" opacity={0.9}>
                      Personil yang terlibat dalam perjalanan dinas
                    </Text>
                  </VStack>
                </HStack>
              </CardHeader>
              
              <CardBody p={8}>
                <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={6}>
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

                    const getStatusIcon = (statusId) => {
                      switch (statusId) {
                        case 1:
                          return FiClock;
                        case 2:
                          return FiCheckCircle;
                        case 3:
                          return FiFlag;
                        default:
                          return FiInfo;
                      }
                    };

                    return (
                      <Card
                        key={index}
                        bg={useColorModeValue("white", "gray.700")}
                        border="2px solid"
                        borderColor={useColorModeValue("gray.100", "gray.600")}
                        borderRadius="2xl"
                        p={6}
                        shadow="lg"
                        _hover={{
                          shadow: "2xl",
                          transform: "translateY(-4px)",
                          borderColor: `${getStatusColor(item.statusId)}.300`,
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        position="relative"
                        overflow="hidden"
                      >
                        {/* Status Indicator */}
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          h="4px"
                          bg={`${getStatusColor(item.statusId)}.400`}
                        />
                        
                        <VStack spacing={5} align="stretch">
                          {/* Enhanced Header */}
                          <HStack spacing={4}>
                            <Avatar
                              name={item.pegawai.nama}
                              size="lg"
                              bg={`${getStatusColor(item.statusId)}.500`}
                              color="white"
                              border="3px solid"
                              borderColor={`${getStatusColor(item.statusId)}.200`}
                              shadow="lg"
                            />
                            <VStack align="start" spacing={2} flex={1}>
                              <Text fontSize="xl" fontWeight="bold" lineHeight="short">
                                {item.pegawai.nama}
                              </Text>
                              <HStack spacing={3} wrap="wrap">
                                <Badge
                                  colorScheme="gray"
                                  variant="subtle"
                                  borderRadius="full"
                                  px={3}
                                  py={1}
                                  fontSize="xs"
                                >
                                  SPD: {item.nomorSPD}
                                </Badge>
                                <Badge
                                  colorScheme={getStatusColor(item.statusId)}
                                  variant="solid"
                                  borderRadius="full"
                                  px={3}
                                  py={1}
                                  fontSize="xs"
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  <Icon as={getStatusIcon(item.statusId)} boxSize={3} />
                                  {item?.status?.statusKuitansi}
                                </Badge>
                              </HStack>
                            </VStack>
                          </HStack>

                          <Divider borderColor={useColorModeValue("gray.200", "gray.600")} />

                          {/* Enhanced Action Buttons */}
                          <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
                            <Button
                              leftIcon={<FiCheckCircle />}
                              colorScheme="blue"
                              variant="solid"
                              size="md"
                              flex={1}
                              onClick={() => {
                                history.push(`/rampung/${item.id}`);
                              }}
                              _hover={{
                                transform: "translateY(-2px)",
                                shadow: "lg",
                              }}
                              transition="all 0.2s"
                              borderRadius="xl"
                            >
                              Rampung
                            </Button>

                            {item.statusId !== 2 && item.statusId !== 3 && (
                              <>
                                <Button
                                  leftIcon={<FiEdit3 />}
                                  colorScheme="purple"
                                  variant="outline"
                                  size="md"
                                  flex={1}
                                  onClick={() => {
                                    setPersonilId(item.id);
                                    setPegawaiLamaId(item.pegawai.id);
                                    onEditOpen();
                                  }}
                                  _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "lg",
                                    bg: "purple.50",
                                  }}
                                  transition="all 0.2s"
                                  borderRadius="xl"
                                >
                                  Edit
                                </Button>
                                <Button
                                  leftIcon={<FiTrash2 />}
                                  colorScheme="red"
                                  variant="outline"
                                  size="md"
                                  flex={1}
                                  onClick={() => {
                                    setPersonilHapusId(item.id);
                                    setNamaPegawaiHapus(item.pegawai.nama);
                                    onHapusOpen();
                                  }}
                                  _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "lg",
                                    bg: "red.50",
                                  }}
                                  transition="all 0.2s"
                                  borderRadius="xl"
                                >
                                  Hapus
                                </Button>
                              </>
                            )}
                          </Stack>
                        </VStack>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </CardBody>
            </Card>
          </Container>
        </Box>

        {/* Enhanced Edit Modal */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isEditOpen}
          onClose={onEditClose}
          size="xl"
        >
          <ModalOverlay 
            bg="blackAlpha.600" 
            backdropFilter="blur(10px)" 
          />
          <ModalContent 
            borderRadius="2xl" 
            maxWidth="700px" 
            mx={4}
            shadow="2xl"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <ModalHeader
              bgGradient="linear(to-r, purple.600, blue.600)"
              color="white"
              borderTopRadius="2xl"
              py={6}
            >
              <HStack spacing={3}>
                <Box
                  p={2}
                  bg="whiteAlpha.200"
                  borderRadius="lg"
                  backdropFilter="blur(10px)"
                >
                  <Icon as={FiEdit3} boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="lg">Edit Personil</Heading>
                  <Text fontSize="sm" opacity={0.9}>
                    Pilih pegawai pengganti untuk personil ini
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            
            <ModalBody p={8}>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold" mb={4}>
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
                        borderRadius: "xl",
                      }),
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "white",
                        border: "2px solid",
                        borderColor: "gray.200",
                        borderRadius: "xl",
                        height: "60px",
                        _hover: { borderColor: "purple.300" },
                        _focus: {
                          borderColor: "purple.500",
                          boxShadow: "0 0 0 3px rgba(128, 90, 213, 0.1)",
                        },
                        minHeight: "60px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        bg: state.isFocused ? "purple.500" : "white",
                        color: state.isFocused ? "white" : "black",
                        _hover: { bg: "purple.500", color: "white" },
                        borderRadius: "lg",
                        margin: "4px",
                      }),
                    }}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter gap={4} p={8} bg={useColorModeValue("gray.50", "gray.800")}>
              <Button
                variant="outline"
                onClick={onEditClose}
                size="lg"
                borderRadius="xl"
                _hover={{ 
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="purple"
                leftIcon={<FiCheckCircle />}
                onClick={handleEditPegawai}
                size="lg"
                borderRadius="xl"
                _hover={{ 
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                transition="all 0.2s"
                isDisabled={!pegawaiId}
              >
                Simpan Perubahan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Enhanced Delete Modal */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isHapusOpen}
          onClose={onHapusClose}
          size="lg"
        >
          <ModalOverlay 
            bg="redAlpha.600" 
            backdropFilter="blur(10px)" 
          />
          <ModalContent 
            borderRadius="2xl" 
            maxWidth="600px" 
            mx={4}
            shadow="2xl"
            border="1px solid"
            borderColor="red.200"
          >
            <ModalHeader
              bg="red.500"
              color="white"
              borderTopRadius="2xl"
              py={6}
            >
              <HStack spacing={3}>
                <Box
                  p={2}
                  bg="whiteAlpha.200"
                  borderRadius="lg"
                  backdropFilter="blur(10px)"
                >
                  <Icon as={FiTrash2} boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="lg">Konfirmasi Hapus Personil</Heading>
                  <Text fontSize="sm" opacity={0.9}>
                    Tindakan ini tidak dapat dibatalkan
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            
            <ModalBody p={8}>
              <VStack spacing={6} align="stretch">
                <Box
                  bg="red.50"
                  p={6}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="red.200"
                  textAlign="center"
                >
                  <Icon as={FiTrash2} boxSize={12} color="red.500" mb={4} />
                  <Text fontSize="lg" mb={2}>
                    Apakah Anda yakin ingin menghapus personil
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="red.600"
                    mb={2}
                  >
                    {namaPegawaiHapus}
                  </Text>
                  <Text fontSize="lg">
                    dari perjalanan ini?
                  </Text>
                </Box>
                
                <Box
                  bg="orange.50"
                  p={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="orange.200"
                >
                  <HStack spacing={3}>
                    <Icon as={FiInfo} color="orange.500" boxSize={5} />
                    <Text fontSize="sm" color="orange.700" fontWeight="medium">
                      Data personil akan dihapus secara permanen dan tidak dapat dikembalikan.
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>
            
            <ModalFooter gap={4} p={8} bg={useColorModeValue("gray.50", "gray.800")}>
              <Button
                variant="outline"
                onClick={onHapusClose}
                size="lg"
                borderRadius="xl"
                _hover={{ 
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiTrash2 />}
                onClick={handleHapusPersonil}
                size="lg"
                borderRadius="xl"
                _hover={{ 
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                transition="all 0.2s"
              >
                Ya, Hapus Personil
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Enhanced Sub Kegiatan Modal */}
        <Modal
          isOpen={isEditUntukOpen}
          onClose={() => setIsEditUntukOpen(false)}
          size="lg"
        >
          <ModalOverlay 
            bg="blackAlpha.600" 
            backdropFilter="blur(10px)" 
          />
          <ModalContent 
            borderRadius="2xl" 
            maxWidth="600px" 
            mx={4}
            shadow="2xl"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <ModalHeader
              bgGradient="linear(to-r, blue.600, purple.600)"
              color="white"
              borderTopRadius="2xl"
              py={6}
            >
              <HStack spacing={3}>
                <Box
                  p={2}
                  bg="whiteAlpha.200"
                  borderRadius="lg"
                  backdropFilter="blur(10px)"
                >
                  <Icon as={FiEdit3} boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="lg">Edit Sub Kegiatan</Heading>
                  <Text fontSize="sm" opacity={0.9}>
                    Pilih sub kegiatan yang sesuai
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            
            <ModalBody p={8}>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="semibold" mb={4}>
                    Pilih Sub Kegiatan Baru
                  </FormLabel>
                  <Select
                    placeholder="Pilih Sub Kegiatan"
                    value={editSubKegiatanId || ""}
                    onChange={(e) => setEditSubKegiatanId(e.target.value)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    }}
                    height="60px"
                    fontSize="lg"
                  >
                    {dataSubKegiatan &&
                      dataSubKegiatan.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.subKegiatan}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter gap={4} p={8} bg={useColorModeValue("gray.50", "gray.800")}>
              <Button
                variant="outline"
                onClick={() => setIsEditUntukOpen(false)}
                size="lg"
                borderRadius="xl"
                _hover={{ 
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
                transition="all 0.2s"
              >
                Batal
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<FiCheckCircle />}
                onClick={async () => {
                  setIsLoading(true);
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
                    await fetchDataPerjalan();
                    toast({
                      title: "Berhasil",
                      description: "Sub kegiatan berhasil diperbarui",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  } catch (err) {
                    console.error(err);
                    toast({
                      title: "Error",
                      description: "Gagal memperbarui sub kegiatan",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                  setIsLoading(false);
                }}
                size="lg"
                borderRadius="xl"
                _hover={{ 
                  transform: "translateY(-2px)",
                  shadow: "lg"
                }}
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