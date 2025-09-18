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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux } from "../../Redux/Reducers/auth";
import { Select as Select2 } from "chakra-react-select";

function DaftarIndikator() {
  const [DataIndikator, setDataIndikator] = useState([]);
  const [DataIndikatorProgram, setDataIndikatorProgram] = useState([]);
  const [DataIndikatorKegiatan, setDataIndikatorKegiatan] = useState([]);
  const [selectedIndikator, setSelectedIndikator] = useState(null);
  const [selectedIndikatorType, setSelectedIndikatorType] = useState(null); // 'subKegiatan' | 'program' | 'kegiatan'

  // state untuk form modal
  const [newTarget, setNewTarget] = useState(null);
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
    onOpen();
  };

  const handleAddTarget = async () => {
    if (!newTarget || !newAnggaran || !newTahun || !jenisAnggaranId) {
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
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perencanaan/post/target`,
        {
          indikatorId: selectedIndikator.id,
          nilai: parseInt(newTarget),
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
      setNewTarget(null);
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

  return (
    <LayoutPerencanaan>
      <Box bg={colorMode === "dark" ? "gray.700" : "gray.100"} pb="40px" px="0">
        <Container maxW="container.lg" py={8}>
          <Heading size="lg" mb={6}>
            Daftar Indikator
          </Heading>

          {/* Filter */}
          <Flex gap={4} mb={6} wrap="wrap">
            <FormControl maxW="180px">
              <FormLabel fontSize="sm">Tahun</FormLabel>
              <Input
                placeholder="Tahun"
                type="number"
                value={filterTahun || ""}
                onChange={(e) => setFilterTahun(parseInt(e.target.value))}
                size="sm"
              />
            </FormControl>
            <FormControl maxW="220px">
              <FormLabel fontSize="sm">Jenis Anggaran</FormLabel>
              <Select2
                options={dataJenisAnggaran.map((val) => ({
                  value: val.id,
                  label: val.jenis,
                }))}
                placeholder="Pilih jenis anggaran"
                onChange={(opt) => setFilterJenisAnggaranId(opt?.value || null)}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    minWidth: "180px",
                  }),
                }}
              />
            </FormControl>
          </Flex>

          {/* List indikator Sub Kegiatan */}
          <Heading size="md" mt={8} mb={2}>
            Indikator Sub Kegiatan
          </Heading>
          <Accordion allowToggle>
            {DataIndikator.map((indikator) => (
              <AccordionItem key={indikator.id} mb={4}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{indikator.indikator}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Sub Kegiatan: {indikator.subKegPer?.nama}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                  borderRadius="md"
                >
                  <VStack align="start" spacing={4}>
                    {indikator.targets && indikator.targets.length > 0 ? (
                      indikator.targets.map((t) => (
                        <Box
                          key={t.id}
                          p={4}
                          bg={colorMode === "dark" ? "gray.900" : "white"}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          w="100%"
                          boxShadow="sm"
                        >
                          <Flex align="center" gap={2} mb={2}>
                            <Text fontSize="lg">🎯</Text>
                            <Text fontWeight="semibold">Target: {t.nilai}</Text>
                          </Flex>
                          {t.tahunAnggarans &&
                            t.tahunAnggarans.map((th) => (
                              <Box
                                key={th.id}
                                pl={4}
                                mt={2}
                                borderLeft="3px solid #3182CE"
                              >
                                <Text fontSize="sm">
                                  Tahun: <b>{th.tahun}</b>
                                </Text>
                                <Text fontSize="sm">
                                  Anggaran:{" "}
                                  <b>Rp {th.anggaran.toLocaleString()}</b>
                                </Text>
                                <Text fontSize="sm">
                                  Jenis Anggaran:{" "}
                                  <b>
                                    {
                                      dataJenisAnggaran.find(
                                        (ja) => ja.id === th.jenisAnggaranId
                                      )?.jenis
                                    }
                                  </b>
                                </Text>
                              </Box>
                            ))}
                          {/* Contoh tombol aksi, bisa diganti sesuai kebutuhan */}
                          <Flex mt={3} gap={2}>
                            <Button
                              size="xs"
                              colorScheme="teal"
                              variant="outline"
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant="outline"
                            >
                              Hapus
                            </Button>
                          </Flex>
                        </Box>
                      ))
                    ) : (
                      <Text fontSize="sm" color="gray.400">
                        Belum ada target
                      </Text>
                    )}
                  </VStack>
                  <Flex mt={4}>
                    <Spacer />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleOpenModal(indikator, "subKegiatan")}
                    >
                      + Tambah Target
                    </Button>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          {/* List indikator Program */}
          <Heading size="md" mt={8} mb={2}>
            Indikator Program
          </Heading>
          <Accordion allowToggle>
            {DataIndikatorProgram.map((indikator) => (
              <AccordionItem key={indikator.id} mb={4}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{indikator.indikator}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                  borderRadius="md"
                >
                  <Text fontSize="sm" color="gray.400">
                    Belum ada target
                  </Text>
                  <Flex mt={4}>
                    <Spacer />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleOpenModal(indikator, "program")}
                    >
                      + Tambah Target
                    </Button>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          {/* List indikator Kegiatan */}
          <Heading size="md" mt={8} mb={2}>
            Indikator Kegiatan
          </Heading>
          <Accordion allowToggle>
            {DataIndikatorKegiatan.map((indikator) => (
              <AccordionItem key={indikator.id} mb={4}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{indikator.indikator}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  pb={4}
                  bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                  borderRadius="md"
                >
                  <Text fontSize="sm" color="gray.400">
                    Belum ada target
                  </Text>
                  <Flex mt={4}>
                    <Spacer />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleOpenModal(indikator, "kegiatan")}
                    >
                      + Tambah Target
                    </Button>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Box>

      {/* Modal Tambah Target */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Target</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Indikator</FormLabel>
              <Text fontWeight="bold">
                {selectedIndikator ? selectedIndikator.indikator : ""}
              </Text>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Satuan</FormLabel>
              <Text fontWeight="bold">
                {selectedIndikator && selectedIndikator.satuanIndikator
                  ? selectedIndikator.satuanIndikator.satuan
                  : ""}
              </Text>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Target</FormLabel>
              <Input
                placeholder="Masukkan target"
                type="number"
                value={newTarget || ""}
                onChange={(e) => setNewTarget(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Anggaran</FormLabel>
              <Input
                placeholder="Masukkan anggaran"
                type="number"
                value={newAnggaran || ""}
                onChange={(e) => setNewAnggaran(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Tahun</FormLabel>
              <Input
                placeholder="Masukkan tahun"
                type="number"
                value={newTahun || ""}
                onChange={(e) => setNewTahun(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Jenis Anggaran</FormLabel>
              <Text fontWeight="bold">Murni</Text>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Batal
            </Button>
            <Button colorScheme="blue" onClick={handleAddTarget}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutPerencanaan>
  );
}

export default DaftarIndikator;
