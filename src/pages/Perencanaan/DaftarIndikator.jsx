import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutPerencanaan from "../../Componets/perencanaan/LayoutPerencanaan";
import {
  Box,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Spacer,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Badge,
  Divider,
  HStack,
  Icon,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";
import {
  FiTarget,
  FiCalendar,
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { userRedux } from "../../Redux/Reducers/auth";
import { Select as Select2 } from "chakra-react-select";

function DaftarIndikator() {
  const [DataIndikator, setDataIndikator] = useState([]);
  const [DataIndikatorProgram, setDataIndikatorProgram] = useState([]);
  const [DataIndikatorKegiatan, setDataIndikatorKegiatan] = useState([]);
  const [dataNamatarget, setDataNamaTarget] = useState([]);
  const [selectedIndikator, setSelectedIndikator] = useState(null);
  const [selectedIndikatorType, setSelectedIndikatorType] = useState(null); // 'subKegiatan' | 'program' | 'kegiatan'

  // state untuk form modal
  const [newTargets, setNewTargets] = useState({});
  const [newAnggaran, setNewAnggaran] = useState(null);
  const [newTahun, setNewTahun] = useState(null);
  const [jenisAnggaranId, setJenisAnggaranId] = useState(null);
  const [dataJenisAnggaran, setDataJenisAnggaran] = useState([]);

  // filter
  const [filterJenisAnggaranId, setFilterJenisAnggaranId] = useState(null);
  const [filterTahun, setFilterTahun] = useState(null);

  const { colorMode } = useColorMode();
  const user = useSelector(userRedux);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isApOpen,
    onOpen: onApOpen,
    onClose: onApClose,
  } = useDisclosure();

  async function fetchIndikator() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perencanaan/get/indikator/${user[0]?.unitKerja_profile?.id}?tahun=${
          filterTahun || ""
        }&jenisAnggaranId=${filterJenisAnggaranId || ""}`
      );
      setDataIndikator(res.data.result || []);
      setDataIndikatorProgram(res.data.resultProgram || []);
      setDataIndikatorKegiatan(res.data.resultKegiatan || []);
      setDataJenisAnggaran(res.data.resultJenisAnggaran || []);
      setDataNamaTarget(res.data.resultNamaTarget || []);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchIndikator();
  }, [filterTahun, filterJenisAnggaranId]);

  const handleOpenModal = (indikator, type) => {
    setSelectedIndikator(indikator);
    setSelectedIndikatorType(type);

    // Inisialisasi newTargets dengan struktur kosong untuk setiap namaTarget
    const initialTargets = {};
    dataNamatarget.forEach((namaTarget) => {
      initialTargets[namaTarget.id] = "";
    });
    setNewTargets(initialTargets);

    onOpen();
  };

  const handleAddTarget = async () => {
    // Validasi apakah semua target telah diisi
    const targetValues = Object.values(newTargets);
    const hasEmptyTarget = targetValues.some((value) => !value || value === "");

    if (hasEmptyTarget || !newAnggaran || !newTahun) {
      toast({
        title: "Peringatan",
        description: "Semua field wajib diisi",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Membuat array of object untuk target
      const targetData = dataNamatarget.map((namaTarget) => {
        const targetValue = newTargets[namaTarget.id];
        return {
          namaTargetId: namaTarget.id,
          nilai: parseInt(targetValue),
        };
      });

      // Mengirim single request dengan array of object
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perencanaan/post/target`,
        {
          indikatorId: selectedIndikator.id,
          targets: targetData,
          anggaran: parseInt(newAnggaran),
          tahun: parseInt(newTahun),
          jenisAnggaranId: 1,
        }
      );

      toast({
        title: "Berhasil",
        description: "Target berhasil ditambahkan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setNewTargets({});
      setNewAnggaran(null);
      setNewTahun(null);
      setJenisAnggaranId(null);

      fetchIndikator();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal menambahkan target",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTambahAnggaranPerubahan = async (targetId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perencanaan/post/anggaran-perubahan`,
        { targetId }
      );

      toast({
        title: "Berhasil",
        description: "Anggaran perubahan berhasil ditambahkan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchIndikator();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal menambahkan anggaran perubahan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [apTargetId, setApTargetId] = useState(null);
  const [apAmount, setApAmount] = useState(0);
  const [apYear, setApYear] = useState(null);

  const openApModal = (targetId, tahun) => {
    setApTargetId(targetId);
    setApAmount(0);
    setApYear(tahun || filterTahun || new Date().getFullYear());
    onApOpen();
  };

  const submitAnggaranPerubahan = async () => {
    if (!apTargetId || !apAmount || apAmount <= 0 || !apYear) {
      toast({
        title: "Peringatan",
        description: "Isi nominal anggaran dengan benar dan pilih tahun filter",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perencanaan/post/anggaran-perubahan`,
        {
          targetId: apTargetId,
          anggaran: parseInt(apAmount),
          tahun: parseInt(apYear),
        }
      );
      toast({
        title: "Berhasil",
        description: "Anggaran perubahan disimpan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onApClose();
      setApTargetId(null);
      setApAmount(0);
      setApYear(null);
      fetchIndikator();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal menyimpan anggaran perubahan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <LayoutPerencanaan>
      <Box
        bg={colorMode === "dark" ? "gray.700" : "gray.50"}
        pb="40px"
        px="0"
        minH="100vh"
      >
        <Container maxW="container.xl" py={8}>
          {/* Header Section */}
          <Box mb={8}>
            <Heading
              size="xl"
              mb={2}
              color={colorMode === "dark" ? "white" : "gray.800"}
            >
              📊 Daftar Indikator
            </Heading>
            <Text color="gray.500" fontSize="md">
              Kelola indikator kinerja untuk sub kegiatan, program, dan kegiatan
            </Text>
          </Box>

          {/* Filter Section */}
          <Card mb={8} shadow="sm">
            <CardHeader pb={4}>
              <Heading
                size="md"
                color={colorMode === "dark" ? "white" : "gray.700"}
              >
                🔍 Filter Data
              </Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Flex gap={6} wrap="wrap" align="end">
                <FormControl maxW="200px">
                  <FormLabel
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                  >
                    <Icon as={FiCalendar} mr={2} />
                    Tahun
                  </FormLabel>
                  <Input
                    placeholder="Contoh: 2024"
                    type="number"
                    value={filterTahun || ""}
                    onChange={(e) => setFilterTahun(parseInt(e.target.value))}
                    size="md"
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182CE",
                    }}
                  />
                </FormControl>
                <FormControl maxW="250px">
                  <FormLabel
                    fontSize="sm"
                    fontWeight="semibold"
                    color="gray.600"
                  >
                    <Icon as={FiDollarSign} mr={2} />
                    Jenis Anggaran
                  </FormLabel>
                  <Select2
                    options={dataJenisAnggaran.map((val) => ({
                      value: val.id,
                      label: val.jenis,
                    }))}
                    placeholder="Pilih jenis anggaran"
                    onChange={(opt) =>
                      setFilterJenisAnggaranId(opt?.value || null)
                    }
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        minWidth: "200px",
                      }),
                    }}
                  />
                </FormControl>
              </Flex>
            </CardBody>
          </Card>

          {/* List indikator Sub Kegiatan */}
          <Box mb={8}>
            <HStack mb={4}>
              <Icon as={FiTarget} color="blue.500" boxSize={6} />
              <Heading
                size="lg"
                color={colorMode === "dark" ? "white" : "gray.800"}
              >
                Indikator Sub Kegiatan
              </Heading>
              <Badge
                colorScheme="blue"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {DataIndikator.length} indikator
              </Badge>
            </HStack>

            <Accordion allowToggle>
              {DataIndikator.map((indikator) => (
                <AccordionItem
                  key={indikator.id}
                  mb={4}
                  border="none"
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="sm"
                >
                  <h2>
                    <AccordionButton
                      bg={colorMode === "dark" ? "gray.800" : "white"}
                      _hover={{
                        bg: colorMode === "dark" ? "gray.700" : "gray.50",
                      }}
                      py={6}
                      px={6}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold" fontSize="lg" mb={1}>
                          {indikator.indikator}
                        </Text>
                        <HStack>
                          <Badge
                            colorScheme="purple"
                            variant="subtle"
                            fontSize="xs"
                          >
                            Sub Kegiatan
                          </Badge>
                          <Text fontSize="sm" color="gray.500">
                            {indikator.subKegPer?.nama}
                          </Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel
                    pb={6}
                    bg={colorMode === "dark" ? "gray.900" : "gray.50"}
                    px={6}
                  >
                    <VStack align="start" spacing={4}>
                      {indikator.targets && indikator.targets.length > 0 ? (
                        indikator.targets.map((t) => (
                          <Card
                            key={t.id}
                            w="100%"
                            shadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <CardBody>
                              <HStack mb={4}>
                                <Icon
                                  as={FiTarget}
                                  color="green.500"
                                  boxSize={5}
                                />
                                <Text fontWeight="semibold" fontSize="lg">
                                  Target: {t.nilai}
                                </Text>
                                <Spacer />
                                <Badge colorScheme="green" variant="subtle">
                                  Aktif
                                </Badge>
                              </HStack>

                              {t.tahunAnggarans &&
                                t.tahunAnggarans.length > 0 && (
                                  <>
                                    <Divider mb={4} />
                                    <VStack align="start" spacing={3}>
                                      {t.tahunAnggarans.map((th) => (
                                        <Box
                                          key={th.id}
                                          p={4}
                                          bg={
                                            colorMode === "dark"
                                              ? "gray.800"
                                              : "white"
                                          }
                                          borderRadius="md"
                                          border="1px solid"
                                          borderColor="gray.200"
                                          w="100%"
                                          position="relative"
                                          _before={{
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: "4px",
                                            bg: "blue.500",
                                            borderRadius: "0 2px 2px 0",
                                          }}
                                        >
                                          <VStack align="start" spacing={2}>
                                            <HStack>
                                              <Icon
                                                as={FiCalendar}
                                                color="blue.500"
                                                boxSize={4}
                                              />
                                              <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                              >
                                                Tahun: {th.tahun}
                                              </Text>
                                            </HStack>
                                            <HStack>
                                              <Icon
                                                as={FiDollarSign}
                                                color="green.500"
                                                boxSize={4}
                                              />
                                              <Text fontSize="sm">
                                                Anggaran:{" "}
                                                <Text
                                                  as="span"
                                                  fontWeight="bold"
                                                  color="green.600"
                                                >
                                                  Rp{" "}
                                                  {th.anggaran.toLocaleString()}
                                                </Text>
                                              </Text>
                                            </HStack>
                                            <Text fontSize="sm">
                                              Jenis Anggaran:{" "}
                                              <Badge
                                                colorScheme="blue"
                                                variant="outline"
                                                fontSize="xs"
                                              >
                                                {
                                                  dataJenisAnggaran.find(
                                                    (ja) =>
                                                      ja.id ===
                                                      th.jenisAnggaranId
                                                  )?.jenis
                                                }
                                              </Badge>
                                            </Text>
                                            <Flex justify="end" w="100%" mt={2}>
                                              <Button
                                                id={String(t.id)}
                                                size="xs"
                                                colorScheme="teal"
                                                variant="outline"
                                                leftIcon={<Icon as={FiEdit} />}
                                                onClick={(e) => {
                                                  const id = parseInt(
                                                    e.currentTarget.id
                                                  );
                                                  openApModal(id, th.tahun);
                                                }}
                                              >
                                                Tambah Anggaran Perubahan (Tahun{" "}
                                                {th.tahun})
                                              </Button>
                                            </Flex>
                                          </VStack>
                                        </Box>
                                      ))}
                                    </VStack>
                                  </>
                                )}

                              {/* Target Triwulan */}
                              {t.targetTriwulans &&
                                t.targetTriwulans.length > 0 && (
                                  <>
                                    <Divider my={4} />
                                    <VStack align="start" spacing={3}>
                                      <HStack>
                                        <Icon
                                          as={FiTarget}
                                          color="orange.500"
                                          boxSize={4}
                                        />
                                        <Text
                                          fontSize="md"
                                          fontWeight="semibold"
                                          color="orange.600"
                                        >
                                          Target Triwulan
                                        </Text>
                                      </HStack>
                                      <Box
                                        w="100%"
                                        p={3}
                                        bg={
                                          colorMode === "dark"
                                            ? "gray.800"
                                            : "orange.50"
                                        }
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="orange.200"
                                      >
                                        <VStack spacing={2}>
                                          {t.targetTriwulans.map((triwulan) => (
                                            <HStack
                                              key={triwulan.id}
                                              w="100%"
                                              justify="space-between"
                                            >
                                              <Text
                                                fontSize="sm"
                                                fontWeight="medium"
                                              >
                                                {triwulan.namaTarget.nama}:
                                              </Text>
                                              <Badge
                                                colorScheme="orange"
                                                variant="solid"
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                              >
                                                {triwulan.nilai}
                                              </Badge>
                                            </HStack>
                                          ))}
                                        </VStack>
                                      </Box>
                                    </VStack>
                                  </>
                                )}

                              <Divider my={4} />
                              <Flex gap={2} justify="end">
                                <Button
                                  size="sm"
                                  colorScheme="teal"
                                  variant="outline"
                                  leftIcon={<Icon as={FiEdit} />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  leftIcon={<Icon as={FiTrash2} />}
                                >
                                  Hapus
                                </Button>{" "}
                              </Flex>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Box
                          textAlign="center"
                          py={8}
                          w="100%"
                          bg={colorMode === "dark" ? "gray.800" : "white"}
                          borderRadius="md"
                          border="2px dashed"
                          borderColor="gray.300"
                        >
                          <Icon
                            as={FiTarget}
                            boxSize={8}
                            color="gray.400"
                            mb={2}
                          />
                          <Text fontSize="sm" color="gray.400">
                            Belum ada target yang ditambahkan
                          </Text>
                        </Box>
                      )}
                    </VStack>

                    <Flex mt={6} justify="end">
                      <Button
                        size="md"
                        colorScheme="blue"
                        leftIcon={<Icon as={FiPlus} />}
                        onClick={() =>
                          handleOpenModal(indikator, "subKegiatan")
                        }
                        borderRadius="lg"
                      >
                        Tambah Target
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>

          {/* List indikator Program */}
          <Box mb={8}>
            <HStack mb={4}>
              <Icon as={FiTarget} color="purple.500" boxSize={6} />
              <Heading
                size="lg"
                color={colorMode === "dark" ? "white" : "gray.800"}
              >
                Indikator Program
              </Heading>
              <Badge
                colorScheme="purple"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {DataIndikatorProgram.length} indikator
              </Badge>
            </HStack>

            <Accordion allowToggle>
              {DataIndikatorProgram.map((indikator) => (
                <AccordionItem
                  key={indikator.id}
                  mb={4}
                  border="none"
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="sm"
                >
                  <h2>
                    <AccordionButton
                      bg={colorMode === "dark" ? "gray.800" : "white"}
                      _hover={{
                        bg: colorMode === "dark" ? "gray.700" : "gray.50",
                      }}
                      py={6}
                      px={6}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold" fontSize="lg" mb={1}>
                          {indikator.indikator}
                        </Text>
                        <HStack>
                          <Badge
                            colorScheme="purple"
                            variant="subtle"
                            fontSize="xs"
                          >
                            Program
                          </Badge>{" "}
                          <Text fontSize="sm" color="gray.500">
                            {indikator.program?.nama}
                          </Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel
                    pb={6}
                    bg={colorMode === "dark" ? "gray.900" : "gray.50"}
                    px={6}
                  >
                    <VStack align="start" spacing={4}>
                      {indikator.targets && indikator.targets.length > 0 ? (
                        indikator.targets.map((t) => (
                          <Card
                            key={t.id}
                            w="100%"
                            shadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <CardBody>
                              <HStack mb={4}>
                                <Icon
                                  as={FiTarget}
                                  color="green.500"
                                  boxSize={5}
                                />
                                <Text fontWeight="semibold" fontSize="lg">
                                  Target: {t.nilai}
                                </Text>
                                <Spacer />
                                <Badge colorScheme="green" variant="subtle">
                                  Aktif
                                </Badge>
                              </HStack>

                              {t.tahunAnggarans &&
                                t.tahunAnggarans.length > 0 && (
                                  <>
                                    <Divider mb={4} />
                                    <VStack align="start" spacing={3}>
                                      {t.tahunAnggarans.map((th) => (
                                        <Box
                                          key={th.id}
                                          p={4}
                                          bg={
                                            colorMode === "dark"
                                              ? "gray.800"
                                              : "white"
                                          }
                                          borderRadius="md"
                                          border="1px solid"
                                          borderColor="gray.200"
                                          w="100%"
                                          position="relative"
                                          _before={{
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: "4px",
                                            bg: "purple.500",
                                            borderRadius: "0 2px 2px 0",
                                          }}
                                        >
                                          <VStack align="start" spacing={2}>
                                            <HStack>
                                              <Icon
                                                as={FiCalendar}
                                                color="purple.500"
                                                boxSize={4}
                                              />
                                              <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                              >
                                                Tahun: {th.tahun}
                                              </Text>
                                            </HStack>
                                            <HStack>
                                              <Icon
                                                as={FiDollarSign}
                                                color="green.500"
                                                boxSize={4}
                                              />
                                              <Text fontSize="sm">
                                                Anggaran:{" "}
                                                <Text
                                                  as="span"
                                                  fontWeight="bold"
                                                  color="green.600"
                                                >
                                                  Rp{" "}
                                                  {th.anggaran.toLocaleString()}
                                                </Text>
                                              </Text>
                                            </HStack>
                                            <Text fontSize="sm">
                                              Jenis Anggaran:{" "}
                                              <Badge
                                                colorScheme="purple"
                                                variant="outline"
                                                fontSize="xs"
                                              >
                                                {
                                                  dataJenisAnggaran.find(
                                                    (ja) =>
                                                      ja.id ===
                                                      th.jenisAnggaranId
                                                  )?.jenis
                                                }
                                              </Badge>
                                            </Text>
                                          </VStack>
                                        </Box>
                                      ))}
                                    </VStack>
                                  </>
                                )}

                              {/* Target Triwulan */}
                              {t.targetTriwulans &&
                                t.targetTriwulans.length > 0 && (
                                  <>
                                    <Divider my={4} />
                                    <VStack align="start" spacing={3}>
                                      <HStack>
                                        <Icon
                                          as={FiTarget}
                                          color="orange.500"
                                          boxSize={4}
                                        />
                                        <Text
                                          fontSize="md"
                                          fontWeight="semibold"
                                          color="orange.600"
                                        >
                                          Target Triwulan
                                        </Text>
                                      </HStack>
                                      <Box
                                        w="100%"
                                        p={3}
                                        bg={
                                          colorMode === "dark"
                                            ? "gray.800"
                                            : "orange.50"
                                        }
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="orange.200"
                                      >
                                        <VStack spacing={2}>
                                          {t.targetTriwulans.map((triwulan) => (
                                            <HStack
                                              key={triwulan.id}
                                              w="100%"
                                              justify="space-between"
                                            >
                                              <Text
                                                fontSize="sm"
                                                fontWeight="medium"
                                              >
                                                {triwulan.namaTarget.nama}:
                                              </Text>
                                              <Badge
                                                colorScheme="orange"
                                                variant="solid"
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                              >
                                                {triwulan.nilai}
                                              </Badge>
                                            </HStack>
                                          ))}
                                        </VStack>
                                      </Box>
                                    </VStack>
                                  </>
                                )}

                              <Divider my={4} />
                              <Flex gap={2} justify="end">
                                <Button
                                  size="sm"
                                  colorScheme="teal"
                                  variant="outline"
                                  leftIcon={<Icon as={FiEdit} />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  leftIcon={<Icon as={FiTrash2} />}
                                >
                                  Hapus
                                </Button>
                              </Flex>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Box
                          textAlign="center"
                          py={8}
                          w="100%"
                          bg={colorMode === "dark" ? "gray.800" : "white"}
                          borderRadius="md"
                          border="2px dashed"
                          borderColor="gray.300"
                        >
                          <Icon
                            as={FiTarget}
                            boxSize={8}
                            color="gray.400"
                            mb={2}
                          />
                          <Text fontSize="sm" color="gray.400">
                            Belum ada target yang ditambahkan
                          </Text>
                        </Box>
                      )}
                    </VStack>

                    <Flex mt={6} justify="end">
                      <Button
                        size="md"
                        colorScheme="purple"
                        leftIcon={<Icon as={FiPlus} />}
                        onClick={() => handleOpenModal(indikator, "program")}
                        borderRadius="lg"
                      >
                        Tambah Target
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>

          {/* List indikator Kegiatan */}
          <Box mb={8}>
            <HStack mb={4}>
              <Icon as={FiTarget} color="orange.500" boxSize={6} />
              <Heading
                size="lg"
                color={colorMode === "dark" ? "white" : "gray.800"}
              >
                Indikator Kegiatan
              </Heading>
              <Badge
                colorScheme="orange"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {DataIndikatorKegiatan.length} indikator
              </Badge>
            </HStack>

            <Accordion allowToggle>
              {DataIndikatorKegiatan.map((indikator) => (
                <AccordionItem
                  key={indikator.id}
                  mb={4}
                  border="none"
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="sm"
                >
                  <h2>
                    <AccordionButton
                      bg={colorMode === "dark" ? "gray.800" : "white"}
                      _hover={{
                        bg: colorMode === "dark" ? "gray.700" : "gray.50",
                      }}
                      py={6}
                      px={6}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold" fontSize="lg" mb={1}>
                          {indikator.indikator}
                        </Text>
                        <Badge
                          colorScheme="orange"
                          variant="subtle"
                          fontSize="xs"
                        >
                          Kegiatan
                        </Badge>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel
                    pb={6}
                    bg={colorMode === "dark" ? "gray.900" : "gray.50"}
                    px={6}
                  >
                    <VStack align="start" spacing={4}>
                      {indikator.targets && indikator.targets.length > 0 ? (
                        indikator.targets.map((t) => (
                          <Card
                            key={t.id}
                            w="100%"
                            shadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <CardBody>
                              <HStack mb={4}>
                                <Icon
                                  as={FiTarget}
                                  color="green.500"
                                  boxSize={5}
                                />
                                <Text fontWeight="semibold" fontSize="lg">
                                  Target: {t.nilai}
                                </Text>
                                <Spacer />
                                <Badge colorScheme="green" variant="subtle">
                                  Aktif
                                </Badge>
                              </HStack>

                              {t.tahunAnggarans &&
                                t.tahunAnggarans.length > 0 && (
                                  <>
                                    <Divider mb={4} />
                                    <VStack align="start" spacing={3}>
                                      {t.tahunAnggarans.map((th) => (
                                        <Box
                                          key={th.id}
                                          p={4}
                                          bg={
                                            colorMode === "dark"
                                              ? "gray.800"
                                              : "white"
                                          }
                                          borderRadius="md"
                                          border="1px solid"
                                          borderColor="gray.200"
                                          w="100%"
                                          position="relative"
                                          _before={{
                                            content: '""',
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: "4px",
                                            bg: "orange.500",
                                            borderRadius: "0 2px 2px 0",
                                          }}
                                        >
                                          <VStack align="start" spacing={2}>
                                            <HStack>
                                              <Icon
                                                as={FiCalendar}
                                                color="orange.500"
                                                boxSize={4}
                                              />
                                              <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                              >
                                                Tahun: {th.tahun}
                                              </Text>
                                            </HStack>
                                            <HStack>
                                              <Icon
                                                as={FiDollarSign}
                                                color="green.500"
                                                boxSize={4}
                                              />
                                              <Text fontSize="sm">
                                                Anggaran:{" "}
                                                <Text
                                                  as="span"
                                                  fontWeight="bold"
                                                  color="green.600"
                                                >
                                                  Rp{" "}
                                                  {th.anggaran.toLocaleString()}
                                                </Text>
                                              </Text>
                                            </HStack>
                                            <Text fontSize="sm">
                                              Jenis Anggaran:{" "}
                                              <Badge
                                                colorScheme="orange"
                                                variant="outline"
                                                fontSize="xs"
                                              >
                                                {
                                                  dataJenisAnggaran.find(
                                                    (ja) =>
                                                      ja.id ===
                                                      th.jenisAnggaranId
                                                  )?.jenis
                                                }
                                              </Badge>
                                            </Text>
                                          </VStack>
                                        </Box>
                                      ))}
                                    </VStack>
                                  </>
                                )}

                              {/* Target Triwulan */}
                              {t.targetTriwulans &&
                                t.targetTriwulans.length > 0 && (
                                  <>
                                    <Divider my={4} />
                                    <VStack align="start" spacing={3}>
                                      <HStack>
                                        <Icon
                                          as={FiTarget}
                                          color="orange.500"
                                          boxSize={4}
                                        />
                                        <Text
                                          fontSize="md"
                                          fontWeight="semibold"
                                          color="orange.600"
                                        >
                                          Target Triwulan
                                        </Text>
                                      </HStack>
                                      <Box
                                        w="100%"
                                        p={3}
                                        bg={
                                          colorMode === "dark"
                                            ? "gray.800"
                                            : "orange.50"
                                        }
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="orange.200"
                                      >
                                        <VStack spacing={2}>
                                          {t.targetTriwulans.map((triwulan) => (
                                            <HStack
                                              key={triwulan.id}
                                              w="100%"
                                              justify="space-between"
                                            >
                                              <Text
                                                fontSize="sm"
                                                fontWeight="medium"
                                              >
                                                {triwulan.namaTarget.nama}:
                                              </Text>
                                              <Badge
                                                colorScheme="orange"
                                                variant="solid"
                                                fontSize="sm"
                                                px={3}
                                                py={1}
                                              >
                                                {triwulan.nilai}
                                              </Badge>
                                            </HStack>
                                          ))}
                                        </VStack>
                                      </Box>
                                    </VStack>
                                  </>
                                )}

                              <Divider my={4} />
                              <Flex gap={2} justify="end">
                                <Button
                                  size="sm"
                                  colorScheme="teal"
                                  variant="outline"
                                  leftIcon={<Icon as={FiEdit} />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  leftIcon={<Icon as={FiTrash2} />}
                                >
                                  Hapus
                                </Button>
                              </Flex>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Box
                          textAlign="center"
                          py={8}
                          w="100%"
                          bg={colorMode === "dark" ? "gray.800" : "white"}
                          borderRadius="md"
                          border="2px dashed"
                          borderColor="gray.300"
                        >
                          <Icon
                            as={FiTarget}
                            boxSize={8}
                            color="gray.400"
                            mb={2}
                          />
                          <Text fontSize="sm" color="gray.400">
                            Belum ada target yang ditambahkan
                          </Text>
                        </Box>
                      )}
                    </VStack>

                    <Flex mt={6} justify="end">
                      <Button
                        size="md"
                        colorScheme="orange"
                        leftIcon={<Icon as={FiPlus} />}
                        onClick={() => handleOpenModal(indikator, "kegiatan")}
                        borderRadius="lg"
                      >
                        Tambah Target
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Container>
      </Box>

      {/* Modal Tambah Target */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" shadow="2xl">
          <ModalHeader
            bg={colorMode === "dark" ? "gray.800" : "blue.50"}
            borderTopRadius="xl"
            py={6}
          >
            <HStack>
              <Icon as={FiPlus} color="blue.500" boxSize={6} />
              <Heading
                size="lg"
                color={colorMode === "dark" ? "white" : "gray.800"}
              >
                Tambah Target Baru
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              {/* Info Indikator */}
              <Card
                bg={colorMode === "dark" ? "gray.800" : "blue.50"}
                border="1px solid"
                borderColor="blue.200"
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Icon as={FiTarget} color="blue.500" boxSize={5} />
                      <Text fontWeight="semibold" fontSize="lg">
                        {selectedIndikator ? selectedIndikator.indikator : ""}
                      </Text>
                    </HStack>
                    <HStack>
                      <Badge colorScheme="blue" variant="subtle">
                        Satuan:{" "}
                        {selectedIndikator && selectedIndikator.satuanIndikator
                          ? selectedIndikator.satuanIndikator.satuan
                          : "Tidak ada"}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Dynamic Target Fields berdasarkan dataNamaTarget */}
              <VStack spacing={4} align="stretch">
                <Heading
                  size="md"
                  color={colorMode === "dark" ? "white" : "gray.700"}
                >
                  Target yang akan ditambahkan:
                </Heading>
                {dataNamatarget.map((namaTarget) => (
                  <FormControl key={namaTarget.id}>
                    <FormLabel fontWeight="semibold" color="gray.600">
                      Target {namaTarget.nama}
                    </FormLabel>
                    <Input
                      placeholder={`Masukkan target ${namaTarget.nama}`}
                      type="number"
                      value={newTargets[namaTarget.id] || ""}
                      onChange={(e) =>
                        setNewTargets((prev) => ({
                          ...prev,
                          [namaTarget.id]: e.target.value,
                        }))
                      }
                      size="lg"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px #3182CE",
                      }}
                    />
                  </FormControl>
                ))}
              </VStack>

              {/* Anggaran dan Tahun */}
              <HStack spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontWeight="semibold" color="gray.600">
                    <Icon as={FiDollarSign} mr={2} />
                    Anggaran (Rp)
                  </FormLabel>
                  <Input
                    placeholder="Masukkan anggaran"
                    type="number"
                    value={newAnggaran || ""}
                    onChange={(e) => setNewAnggaran(e.target.value)}
                    size="lg"
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182CE",
                    }}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel fontWeight="semibold" color="gray.600">
                    <Icon as={FiCalendar} mr={2} />
                    Tahun
                  </FormLabel>
                  <Input
                    placeholder="Masukkan tahun"
                    type="number"
                    value={newTahun || ""}
                    onChange={(e) => setNewTahun(e.target.value)}
                    size="lg"
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182CE",
                    }}
                  />
                </FormControl>
              </HStack>

              {/* Jenis Anggaran */}
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.600">
                  Jenis Anggaran
                </FormLabel>
                <Box
                  p={3}
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  borderRadius="lg"
                >
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    Murni
                  </Badge>
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter
            bg={colorMode === "dark" ? "gray.800" : "gray.50"}
            borderBottomRadius="xl"
            py={4}
          >
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={onClose}
                size="lg"
                borderRadius="lg"
              >
                Batal
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleAddTarget}
                size="lg"
                borderRadius="lg"
                leftIcon={<Icon as={FiPlus} />}
              >
                Simpan Target
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal Anggaran Perubahan */}
      <Modal isOpen={isApOpen} onClose={onApClose} size="md">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />
        <ModalContent borderRadius="xl" shadow="xl">
          <ModalHeader
            bg={colorMode === "dark" ? "gray.800" : "green.50"}
            borderTopRadius="xl"
            py={4}
          >
            <HStack>
              <Icon as={FiDollarSign} color="green.500" boxSize={6} />
              <Heading
                size="md"
                color={colorMode === "dark" ? "white" : "gray.800"}
              >
                Tambah Anggaran Perubahan
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.600">
                  Target ID
                </FormLabel>
                <Input value={apTargetId || ""} isDisabled />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.600">
                  Anggaran Perubahan (Rp)
                </FormLabel>
                <Input
                  placeholder="Masukkan nominal anggaran"
                  type="number"
                  value={apAmount || ""}
                  onChange={(e) => setApAmount(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold" color="gray.600">
                  Tahun
                </FormLabel>
                <Input
                  placeholder="Tahun anggaran"
                  type="number"
                  value={apYear || ""}
                  isDisabled
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter bg={colorMode === "dark" ? "gray.800" : "gray.50"}>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onApClose}>
                Batal
              </Button>
              <Button colorScheme="green" onClick={submitAnggaranPerubahan}>
                Simpan
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutPerencanaan>
  );
}

export default DaftarIndikator;
