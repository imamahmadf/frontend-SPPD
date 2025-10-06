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
function DetailProgram(props) {
  const [DataSubKegiatan, setDataSubKegiatan] = useState([]);
  const { colorMode } = useColorMode();
  const history = useHistory();
  const [bulan, setBulan] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [nilai, setNilai] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [bukti, setBukti] = useState("");
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
        }/perencanaan/get/detail-program/${props.match.params.id}`
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
          bukti,
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

                  <Box
                    overflowX="auto"
                    borderRadius="lg"
                    border="1px"
                    borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                    bg={colorMode === "dark" ? "gray.800" : "white"}
                    boxShadow="lg"
                  >
                    <Table
                      variant="simple"
                      size="sm"
                      colorScheme={colorMode === "dark" ? "gray" : "blue"}
                    >
                      <Thead>
                        <Tr bg={colorMode === "dark" ? "blue.800" : "blue.50"}>
                          <Th
                            rowSpan={2}
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                          >
                            Tahun
                          </Th>
                          <Th
                            rowSpan={2}
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                          >
                            Anggaran Murni
                          </Th>
                          <Th
                            rowSpan={2}
                            isNumeric
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                          >
                            Anggaran Perubahan
                          </Th>
                          <Th
                            colSpan={4}
                            textAlign="center"
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                            bg={colorMode === "dark" ? "green.700" : "green.50"}
                          >
                            Target Triwulan
                          </Th>
                          <Th
                            colSpan={12}
                            textAlign="center"
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                            bg={
                              colorMode === "dark" ? "purple.700" : "purple.50"
                            }
                          >
                            Bulan
                          </Th>
                          <Th
                            rowSpan={2}
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                          >
                            % Capaian
                          </Th>
                          <Th
                            rowSpan={2}
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                          >
                            % Anggaran
                          </Th>
                          <Th
                            rowSpan={2}
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="bold"
                          >
                            Aksi
                          </Th>
                        </Tr>
                        <Tr bg={colorMode === "dark" ? "blue.700" : "blue.100"}>
                          <Th
                            isNumeric
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="semibold"
                            bg={
                              colorMode === "dark" ? "green.600" : "green.100"
                            }
                          >
                            TW1
                          </Th>
                          <Th
                            isNumeric
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="semibold"
                            bg={
                              colorMode === "dark" ? "green.600" : "green.100"
                            }
                          >
                            TW2
                          </Th>
                          <Th
                            isNumeric
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="semibold"
                            bg={
                              colorMode === "dark" ? "green.600" : "green.100"
                            }
                          >
                            TW3
                          </Th>
                          <Th
                            isNumeric
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                            color={colorMode === "dark" ? "white" : "gray.700"}
                            fontWeight="semibold"
                            bg={
                              colorMode === "dark" ? "green.600" : "green.100"
                            }
                          >
                            TW4
                          </Th>
                          {[...Array(12)].map((_, i) => (
                            <Th
                              key={i}
                              textAlign="center"
                              borderColor={
                                colorMode === "dark" ? "gray.600" : "gray.200"
                              }
                              color={
                                colorMode === "dark" ? "white" : "gray.700"
                              }
                              fontWeight="semibold"
                              bg={
                                colorMode === "dark"
                                  ? "purple.600"
                                  : "purple.100"
                              }
                            >
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

                          // Total target triwulan
                          const totalTargetTriwulan = t.targetTriwulans?.reduce(
                            (sum, tt) => sum + (tt.nilai || 0),
                            0
                          );

                          // Total capaian nilai
                          const totalCapaian = t.capaians?.reduce(
                            (sum, c) => sum + (c.nilai || 0),
                            0
                          );

                          // Persentase capaian nilai berdasarkan total target triwulan
                          const persentaseCapaian =
                            totalTargetTriwulan > 0
                              ? (
                                  (totalCapaian / totalTargetTriwulan) *
                                  100
                                ).toFixed(2)
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
                              <Tr
                                _hover={{
                                  bg:
                                    colorMode === "dark"
                                      ? "gray.700"
                                      : "gray.50",
                                }}
                                transition="all 0.2s"
                              >
                                <Td
                                  rowSpan={2}
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  fontWeight="semibold"
                                  bg={
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50"
                                  }
                                >
                                  {anggaranMurni?.tahun ||
                                    anggaranPerubahan?.tahun}
                                </Td>
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50"
                                  }
                                >
                                  {anggaranMurni?.anggaran?.toLocaleString() ||
                                    "-"}
                                </Td>
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50"
                                  }
                                >
                                  {anggaranPerubahan?.anggaran?.toLocaleString() ||
                                    "-"}
                                </Td>
                                {/* Target Triwulan */}
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "green.800"
                                      : "green.50"
                                  }
                                  fontWeight="semibold"
                                >
                                  {t.targetTriwulans?.find(
                                    (tt) => tt.namaTarget?.nama === "tw1"
                                  )?.nilai || "-"}
                                </Td>
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "green.800"
                                      : "green.50"
                                  }
                                  fontWeight="semibold"
                                >
                                  {t.targetTriwulans?.find(
                                    (tt) => tt.namaTarget?.nama === "tw2"
                                  )?.nilai || "-"}
                                </Td>
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "green.800"
                                      : "green.50"
                                  }
                                  fontWeight="semibold"
                                >
                                  {t.targetTriwulans?.find(
                                    (tt) => tt.namaTarget?.nama === "tw3"
                                  )?.nilai || "-"}
                                </Td>
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "green.800"
                                      : "green.50"
                                  }
                                  fontWeight="semibold"
                                >
                                  {t.targetTriwulans?.find(
                                    (tt) => tt.namaTarget?.nama === "tw4"
                                  )?.nilai || "-"}
                                </Td>
                                {[...Array(12)].map((_, i) => {
                                  const bulanKe = i + 1;
                                  const capaian = t.capaians?.find(
                                    (c) => c.bulan === bulanKe
                                  );
                                  return (
                                    <Td
                                      key={`nilai-${bulanKe}`}
                                      textAlign="center"
                                      borderColor={
                                        colorMode === "dark"
                                          ? "gray.600"
                                          : "gray.200"
                                      }
                                      bg={
                                        capaian
                                          ? colorMode === "dark"
                                            ? "purple.900"
                                            : "purple.50"
                                          : colorMode === "dark"
                                          ? "gray.800"
                                          : "white"
                                      }
                                      _hover={{
                                        bg: capaian
                                          ? colorMode === "dark"
                                            ? "purple.800"
                                            : "purple.100"
                                          : colorMode === "dark"
                                          ? "gray.700"
                                          : "gray.50",
                                      }}
                                      transition="all 0.2s"
                                      p={1}
                                      minW="100px"
                                    >
                                      {capaian ? (
                                        <Box
                                          p={2}
                                          borderRadius="md"
                                          bg={
                                            colorMode === "dark"
                                              ? "gray.700"
                                              : "white"
                                          }
                                          border="1px"
                                          borderColor={
                                            colorMode === "dark"
                                              ? "gray.600"
                                              : "gray.200"
                                          }
                                          boxShadow="sm"
                                        >
                                          <VStack spacing={2} align="center">
                                            <Text
                                              fontWeight="bold"
                                              fontSize="lg"
                                              color={
                                                colorMode === "dark"
                                                  ? "white"
                                                  : "gray.800"
                                              }
                                              bg={
                                                colorMode === "dark"
                                                  ? "blue.600"
                                                  : "blue.100"
                                              }
                                              px={2}
                                              py={1}
                                              borderRadius="full"
                                              minW="30px"
                                            >
                                              {capaian.nilai}
                                            </Text>

                                            <Button
                                              size="xs"
                                              colorScheme="teal"
                                              variant="solid"
                                              onClick={() =>
                                                window.open(
                                                  capaian.bukti,
                                                  "_blank"
                                                )
                                              }
                                              isDisabled={!capaian.bukti}
                                              _hover={{
                                                transform: "scale(1.05)",
                                              }}
                                              transition="all 0.2s"
                                              width="100%"
                                              fontSize="xs"
                                            >
                                              📎 Bukti
                                            </Button>

                                            <Box
                                              px={2}
                                              py={1}
                                              borderRadius="full"
                                              bg={
                                                capaian.status === "pengajuan"
                                                  ? "orange.100"
                                                  : capaian.status ===
                                                    "disetujui"
                                                  ? "green.100"
                                                  : capaian.status === "ditolak"
                                                  ? "red.100"
                                                  : "gray.100"
                                              }
                                              border="1px"
                                              borderColor={
                                                capaian.status === "pengajuan"
                                                  ? "orange.300"
                                                  : capaian.status ===
                                                    "disetujui"
                                                  ? "green.300"
                                                  : capaian.status === "ditolak"
                                                  ? "red.300"
                                                  : "gray.300"
                                              }
                                            >
                                              <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                color={
                                                  capaian.status === "pengajuan"
                                                    ? "orange.700"
                                                    : capaian.status ===
                                                      "disetujui"
                                                    ? "green.700"
                                                    : capaian.status ===
                                                      "ditolak"
                                                    ? "red.700"
                                                    : "gray.700"
                                                }
                                                textTransform="capitalize"
                                              >
                                                {capaian.status}
                                              </Text>
                                            </Box>
                                          </VStack>
                                        </Box>
                                      ) : (
                                        <Text
                                          color={
                                            colorMode === "dark"
                                              ? "gray.400"
                                              : "gray.500"
                                          }
                                          fontSize="sm"
                                        >
                                          -
                                        </Text>
                                      )}
                                    </Td>
                                  );
                                })}
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50"
                                  }
                                  fontWeight="semibold"
                                >
                                  <Box
                                    p={2}
                                    borderRadius="md"
                                    bg={
                                      parseFloat(persentaseCapaian) >= 100
                                        ? colorMode === "dark"
                                          ? "green.800"
                                          : "green.100"
                                        : parseFloat(persentaseCapaian) >= 75
                                        ? colorMode === "dark"
                                          ? "yellow.800"
                                          : "yellow.100"
                                        : colorMode === "dark"
                                        ? "red.800"
                                        : "red.100"
                                    }
                                    border="1px"
                                    borderColor={
                                      parseFloat(persentaseCapaian) >= 100
                                        ? colorMode === "dark"
                                          ? "green.600"
                                          : "green.300"
                                        : parseFloat(persentaseCapaian) >= 75
                                        ? colorMode === "dark"
                                          ? "yellow.600"
                                          : "yellow.300"
                                        : colorMode === "dark"
                                        ? "red.600"
                                        : "red.300"
                                    }
                                  >
                                    <Text
                                      fontSize="sm"
                                      fontWeight="bold"
                                      color={
                                        parseFloat(persentaseCapaian) >= 100
                                          ? colorMode === "dark"
                                            ? "green.200"
                                            : "green.700"
                                          : parseFloat(persentaseCapaian) >= 75
                                          ? colorMode === "dark"
                                            ? "yellow.200"
                                            : "yellow.700"
                                          : colorMode === "dark"
                                          ? "red.200"
                                          : "red.700"
                                      }
                                    >
                                      {persentaseCapaian}%
                                    </Text>
                                  </Box>
                                </Td>
                                <Td
                                  rowSpan={2}
                                  isNumeric
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50"
                                  }
                                  fontWeight="semibold"
                                >
                                  <Box
                                    p={2}
                                    borderRadius="md"
                                    bg={
                                      parseFloat(persentaseAnggaran) >= 100
                                        ? colorMode === "dark"
                                          ? "green.800"
                                          : "green.100"
                                        : parseFloat(persentaseAnggaran) >= 75
                                        ? colorMode === "dark"
                                          ? "yellow.800"
                                          : "yellow.100"
                                        : colorMode === "dark"
                                        ? "red.800"
                                        : "red.100"
                                    }
                                    border="1px"
                                    borderColor={
                                      parseFloat(persentaseAnggaran) >= 100
                                        ? colorMode === "dark"
                                          ? "green.600"
                                          : "green.300"
                                        : parseFloat(persentaseAnggaran) >= 75
                                        ? colorMode === "dark"
                                          ? "yellow.600"
                                          : "yellow.300"
                                        : colorMode === "dark"
                                        ? "red.600"
                                        : "red.300"
                                    }
                                  >
                                    <Text
                                      fontSize="sm"
                                      fontWeight="bold"
                                      color={
                                        parseFloat(persentaseAnggaran) >= 100
                                          ? colorMode === "dark"
                                            ? "green.200"
                                            : "green.700"
                                          : parseFloat(persentaseAnggaran) >= 75
                                          ? colorMode === "dark"
                                            ? "yellow.200"
                                            : "yellow.700"
                                          : colorMode === "dark"
                                          ? "red.200"
                                          : "red.700"
                                      }
                                    >
                                      {persentaseAnggaran}%
                                    </Text>
                                  </Box>
                                </Td>
                                <Td
                                  rowSpan={2}
                                  borderColor={
                                    colorMode === "dark"
                                      ? "gray.600"
                                      : "gray.200"
                                  }
                                  bg={
                                    colorMode === "dark"
                                      ? "gray.750"
                                      : "gray.50"
                                  }
                                >
                                  <VStack spacing={2} align="center">
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      variant="solid"
                                      onClick={() => {
                                        setSelectedTarget(t);
                                        onOpen();
                                      }}
                                      width="100%"
                                      fontSize="xs"
                                    >
                                      📝 Input Target
                                    </Button>
                                    <Button
                                      size="sm"
                                      colorScheme="teal"
                                      variant="solid"
                                      onClick={() => {
                                        setSelectedTarget(t);
                                        onInputOpen();
                                      }}
                                      width="100%"
                                      fontSize="xs"
                                    >
                                      💰 Input Anggaran
                                    </Button>
                                  </VStack>
                                </Td>
                              </Tr>
                              <Tr>
                                {/* Target Triwulan - row kosong untuk anggaran */}

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
                <Text mb={1}>Bukti</Text>
                <Input
                  placeholder="Masukkan link"
                  onChange={(e) => setBukti(e.target.value)}
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

export default DetailProgram;
