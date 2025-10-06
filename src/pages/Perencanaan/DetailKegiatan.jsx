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
  useColorMode,
  Button,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  useToast,
  Select,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
function DetailKegiatan(props) {
  const [DataSubKegiatan, setDataSubKegiatan] = useState([]);
  const { colorMode } = useColorMode();
  const history = useHistory();
  const [bulan, setBulan] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [nilai, setNilai] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const toast = useToast();

  const {
    isOpen: isInputOpen,
    onOpen: onInputOpen,
    onClose: onInputClose,
  } = useDisclosure();
  async function fetchSuratPesanan() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perencanaan/get/detail-kegiatan/${props.match.params.id}`
      );
      setDataSubKegiatan(res.data.result || []);
      console.log(res.data.result);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleSubmit() {
    if (!selectedTarget) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/capaian/post`,
        {
          targetId: selectedTarget.id,
          nilai: parseInt(nilai),
          bulan: parseInt(bulan),
          anggaran: parseInt(anggaran),
        }
      );
      toast({
        title: "Berhasil",
        description: "Target berhasil disimpan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchSuratPesanan(); // refresh data
    } catch (err) {
      console.error(err);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const bulanList = [
    { nama: "Januari", angka: 1 },
    { nama: "Februari", angka: 2 },
    { nama: "Maret", angka: 3 },
    { nama: "April", angka: 4 },
    { nama: "Mei", angka: 5 },
    { nama: "Juni", angka: 6 },
    { nama: "Juli", angka: 7 },
    { nama: "Agustus", angka: 8 },
    { nama: "September", angka: 9 },
    { nama: "Oktober", angka: 10 },
    { nama: "November", angka: 11 },
    { nama: "Desember", angka: 12 },
  ];

  useEffect(() => {
    fetchSuratPesanan();
  }, []);

  return (
    <LayoutPerencanaan>
      <Box bg={colorMode === "dark" ? "gray.700" : "gray.100"} pb="40px" px="0">
        <Container maxW="3500px" py="8">
          KEGIATANNNNNNNNNNNNNNNNNNN
          {DataSubKegiatan && (
            <VStack align="stretch" spacing={8}>
              <Heading size="lg" mb={4}>
                {DataSubKegiatan.kode} - {DataSubKegiatan.nama}
              </Heading>

              {DataSubKegiatan.indikators?.map((indikator) => (
                <Box
                  key={indikator.id}
                  p={4}
                  bg={colorMode === "dark" ? "gray.800" : "white"}
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Heading size="md" mb={4}>
                    {indikator.indikator}
                  </Heading>

                  <Box overflowX="auto">
                    <Table variant="perencanaan" size="sm">
                      <Thead>
                        <Tr>
                          <Th rowSpan={2}>Tahun</Th>
                          <Th rowSpan={2}>Anggaran Murni</Th>
                          <Th rowSpan={2} isNumeric>
                            Anggaran Perubahan
                          </Th>
                          <Th rowSpan={2} isNumeric>
                            Target
                          </Th>
                          <Th colSpan={12} textAlign="center">
                            Bulan
                          </Th>
                          <Th rowSpan={2}>Persentase Capaian</Th>
                          <Th rowSpan={2}>Persentase Anggaran</Th>
                          <Th rowSpan={2}>Aksi</Th>
                        </Tr>
                        <Tr>
                          {[...Array(12)].map((_, i) => (
                            <Th key={i} isNumeric>
                              {i + 1}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {indikator.targets?.map((t) => {
                          const anggaranMurni = t.tahunAnggarans?.find(
                            (ta) => ta.jenisAnggaranId === 1
                          );
                          const anggaranPerubahan = t.tahunAnggarans?.find(
                            (ta) => ta.jenisAnggaranId === 2
                          );

                          // Total capaian nilai
                          const totalCapaian = t.capaians?.reduce(
                            (sum, c) => sum + (c.nilai || 0),
                            0
                          );

                          // Persentase capaian nilai
                          const persentaseCapaian =
                            t.nilai > 0
                              ? ((totalCapaian / t.nilai) * 100).toFixed(2)
                              : 0;

                          // Total capaian anggaran
                          const totalAnggaranCapaian = t.capaians?.reduce(
                            (sum, c) => sum + (c.anggaran || 0),
                            0
                          );

                          // Acuan anggaran (perubahan > murni)
                          const anggaranAcuan =
                            anggaranPerubahan?.anggaran ||
                            anggaranMurni?.anggaran ||
                            0;

                          // Persentase anggaran
                          const persentaseAnggaran =
                            anggaranAcuan > 0
                              ? (
                                  (totalAnggaranCapaian / anggaranAcuan) *
                                  100
                                ).toFixed(2)
                              : 0;

                          return (
                            <React.Fragment key={t.id}>
                              <Tr>
                                <Td rowSpan={2}>
                                  {anggaranMurni?.tahun ||
                                    anggaranPerubahan?.tahun}
                                </Td>
                                <Td rowSpan={2} isNumeric>
                                  {anggaranMurni?.anggaran?.toLocaleString() ||
                                    "-"}
                                </Td>
                                <Td rowSpan={2} isNumeric>
                                  {anggaranPerubahan?.anggaran?.toLocaleString() ||
                                    "-"}
                                </Td>
                                <Td rowSpan={2} isNumeric>
                                  {t.nilai}
                                </Td>
                                {[...Array(12)].map((_, i) => {
                                  const bulanKe = i + 1;
                                  const capaian = t.capaians?.find(
                                    (c) => c.bulan === bulanKe
                                  );
                                  return (
                                    <Td key={`nilai-${bulanKe}`} isNumeric>
                                      {capaian ? capaian.nilai : "-"}
                                    </Td>
                                  );
                                })}
                                <Td rowSpan={2} isNumeric>
                                  {persentaseCapaian}%
                                </Td>
                                <Td rowSpan={2} isNumeric>
                                  {persentaseAnggaran}%
                                </Td>
                                <Td rowSpan={2}>
                                  <Flex direction="column" gap={2}>
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      onClick={() => {
                                        setSelectedTarget(t);
                                        onOpen();
                                      }}
                                    >
                                      Input Target
                                    </Button>
                                    <Button
                                      size="sm"
                                      colorScheme="teal"
                                      onClick={() => {
                                        setSelectedTarget(t);
                                        onInputOpen();
                                      }}
                                    >
                                      Input Anggaran
                                    </Button>
                                  </Flex>
                                </Td>
                              </Tr>
                              <Tr>
                                {[...Array(12)].map((_, i) => {
                                  const bulanKe = i + 1;
                                  const capaian = t.capaians?.find(
                                    (c) => c.bulan === bulanKe
                                  );
                                  return (
                                    <Td key={`anggaran-${bulanKe}`} isNumeric>
                                      {capaian && capaian.anggaran
                                        ? capaian.anggaran.toLocaleString()
                                        : "-"}
                                    </Td>
                                  );
                                })}
                              </Tr>
                            </React.Fragment>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </Container>
      </Box>

      {/* Modal Input Target */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Input Target</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={1}>Nilai Target</Text>
                <Input
                  placeholder="Masukkan nilai target"
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                />
              </Box>
              <Box>
                <Text mb={1}>Anggaran</Text>
                <Input
                  placeholder="Masukkan anggaran"
                  value={anggaran}
                  onChange={(e) => setAnggaran(e.target.value)}
                />
              </Box>
              <Box>
                <Text mb={1}>Bulan</Text>
                <Select
                  placeholder="Pilih bulan"
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                >
                  {bulanList.map((b) => (
                    <option key={b.angka} value={b.angka}>
                      {b.nama}
                    </option>
                  ))}
                </Select>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Batal
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutPerencanaan>
  );
}

export default DetailKegiatan;
