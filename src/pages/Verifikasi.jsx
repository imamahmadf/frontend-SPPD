import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Button,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Collapse,
  IconButton,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux } from "../Redux/Reducers/auth";
import {
  BsFileEarmarkArrowDown,
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import { BsClipboard2Data } from "react-icons/bs";

// ======================= Komponen TablePerjalanan =======================
function TablePerjalanan({ dataKwitGlobal }) {
  const [expanded, setExpanded] = useState({});
  const { colorMode } = useColorMode();

  const parseNumber = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const cleaned = val.replace(/[^0-9.-]/g, "");
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Normalisasi array
  const perjalananList = (
    Array.isArray(dataKwitGlobal) ? dataKwitGlobal : [dataKwitGlobal]
  )
    .filter(Boolean)
    .flatMap((kg) => kg.perjalanans || []);

  // Hitung total BPD keseluruhan
  const grandTotal = perjalananList.reduce((acc, perj) => {
    const totalPerjalanan = perj.personils?.reduce((acc, p) => {
      return (
        acc +
        (p.rincianBPDs || []).reduce((a, r) => {
          const nilai = parseNumber(r.nilai);
          const qty = r?.qty == null ? 1 : parseNumber(r.qty);
          return a + nilai * qty;
        }, 0)
      );
    }, 0);
    return acc + totalPerjalanan;
  }, 0);

  if (perjalananList.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <BsClipboard2Data size={48} color="#CBD5E0" />
        <Text color="gray.500" mt={4} fontSize="lg">
          Tidak ada data perjalanan
        </Text>
        <Text color="gray.400" fontSize="sm">
          Data perjalanan akan muncul setelah ditambahkan
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading
        size="md"
        mb={6}
        color={colorMode === "dark" ? "gray.100" : "gray.700"}
        fontWeight="semibold"
        borderBottom="2px solid"
        borderColor="blue.200"
        pb={2}
      >
        Data Perjalanan Dinas
      </Heading>

      {/* Container untuk responsive table */}
      <Box
        overflowX="auto"
        borderRadius="lg"
        border="1px solid"
        borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
        boxShadow="sm"
      >
        <Table variant="simple" size="md" minW="800px">
          <Thead
            bg={colorMode === "dark" ? "gray.700" : "blue.50"}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Tr>
              <Th
                w="60px"
                textAlign="center"
                color={colorMode === "dark" ? "gray.100" : "gray.700"}
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Aksi
              </Th>
              <Th
                color={colorMode === "dark" ? "gray.100" : "gray.700"}
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                minW="200px"
              >
                No Surat Tugas
              </Th>
              <Th
                color={colorMode === "dark" ? "gray.100" : "gray.700"}
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                minW="250px"
              >
                Tempat
              </Th>
              <Th
                color={colorMode === "dark" ? "gray.100" : "gray.700"}
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                minW="150px"
              >
                Tanggal
              </Th>
              <Th
                isNumeric
                color={colorMode === "dark" ? "gray.100" : "gray.700"}
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
                minW="180px"
              >
                Total BPD
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {perjalananList.map((perj, index) => {
              const tempat = perj.tempats
                ?.map((t) => t.tempat)
                .filter(Boolean)
                .join(", ");
              const tanggal = perj.tempats
                ?.map((t) =>
                  new Date(t.tanggalBerangkat).toLocaleDateString("id-ID")
                )
                .join(", ");

              const totalPerjalanan = perj.personils?.reduce((acc, p) => {
                return (
                  acc +
                  (p.rincianBPDs || []).reduce((a, r) => {
                    const nilai = parseNumber(r.nilai);
                    const qty = r?.qty == null ? 1 : parseNumber(r.qty);
                    return a + nilai * qty;
                  }, 0)
                );
              }, 0);

              return (
                <React.Fragment key={perj.id}>
                  {/* Row Perjalanan */}
                  <Tr
                    _hover={{
                      bg: colorMode === "dark" ? "gray.700" : "blue.50",
                      cursor: "pointer",
                      transform: "translateY(-1px)",
                      boxShadow: "md",
                    }}
                    onClick={() => toggleExpand(perj.id)}
                    bg={
                      index % 2 === 0
                        ? colorMode === "dark"
                          ? "gray.800"
                          : "white"
                        : colorMode === "dark"
                        ? "gray.750"
                        : "gray.25"
                    }
                    transition="all 0.2s"
                    borderBottom="1px solid"
                    borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                  >
                    <Td textAlign="center">
                      <IconButton
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        icon={
                          expanded[perj.id] ? (
                            <BsChevronDown />
                          ) : (
                            <BsChevronRight />
                          )
                        }
                        aria-label="expand"
                        _hover={{ bg: "blue.100" }}
                      />
                    </Td>
                    <Td
                      fontWeight="semibold"
                      color={colorMode === "dark" ? "gray.100" : "gray.700"}
                      fontSize="sm"
                    >
                      {perj.noSuratTugas}
                    </Td>
                    <Td
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      fontSize="sm"
                    >
                      {tempat}
                    </Td>
                    <Td
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      fontSize="sm"
                    >
                      {tanggal}
                    </Td>
                    <Td
                      isNumeric
                      fontWeight="bold"
                      color="green.600"
                      fontSize="sm"
                      bg={colorMode === "dark" ? "green.900" : "green.50"}
                      borderRadius="md"
                    >
                      Rp {totalPerjalanan.toLocaleString("id-ID")}
                    </Td>
                  </Tr>

                  {/* Detail Personil */}
                  <Tr>
                    <Td colSpan={5} p={0} border="none">
                      <Collapse in={expanded[perj.id]} animateOpacity>
                        <Box
                          bg={colorMode === "dark" ? "gray.700" : "gray.50"}
                          p={6}
                          borderLeft="4px solid"
                          borderLeftColor="blue.400"
                          m={2}
                          borderRadius="md"
                        >
                          <Heading
                            size="sm"
                            mb={4}
                            color={
                              colorMode === "dark" ? "gray.100" : "gray.700"
                            }
                            fontWeight="semibold"
                            display="flex"
                            alignItems="center"
                            gap={2}
                          >
                            <Box
                              w={2}
                              h={2}
                              bg="blue.400"
                              borderRadius="full"
                            />
                            Daftar Personil
                          </Heading>

                          <Box
                            overflowX="auto"
                            borderRadius="md"
                            border="1px solid"
                            borderColor={
                              colorMode === "dark" ? "gray.600" : "gray.200"
                            }
                          >
                            <Table size="sm" variant="simple" minW="600px">
                              <Thead
                                bg={
                                  colorMode === "dark" ? "gray.600" : "gray.100"
                                }
                              >
                                <Tr>
                                  <Th
                                    color={
                                      colorMode === "dark"
                                        ? "gray.100"
                                        : "gray.700"
                                    }
                                    fontWeight="bold"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                  >
                                    Nama Pegawai
                                  </Th>
                                  <Th
                                    color={
                                      colorMode === "dark"
                                        ? "gray.100"
                                        : "gray.700"
                                    }
                                    fontWeight="bold"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                  >
                                    Jabatan
                                  </Th>
                                  <Th
                                    isNumeric
                                    color={
                                      colorMode === "dark"
                                        ? "gray.100"
                                        : "gray.700"
                                    }
                                    fontWeight="bold"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                  >
                                    Total
                                  </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {perj.personils?.map((p, pIndex) => {
                                  const totalP = (p.rincianBPDs || []).reduce(
                                    (a, r) =>
                                      a +
                                      parseNumber(r.nilai) *
                                        (r.qty ? parseNumber(r.qty) : 1),
                                    0
                                  );
                                  return (
                                    <React.Fragment key={p.id}>
                                      <Tr
                                        bg={
                                          pIndex % 2 === 0
                                            ? colorMode === "dark"
                                              ? "gray.800"
                                              : "white"
                                            : colorMode === "dark"
                                            ? "gray.750"
                                            : "gray.25"
                                        }
                                        _hover={{
                                          bg:
                                            colorMode === "dark"
                                              ? "gray.700"
                                              : "blue.50",
                                        }}
                                      >
                                        <Td
                                          fontWeight="medium"
                                          color={
                                            colorMode === "dark"
                                              ? "gray.100"
                                              : "gray.700"
                                          }
                                          fontSize="sm"
                                        >
                                          {p.pegawai?.nama}
                                        </Td>
                                        <Td
                                          color={
                                            colorMode === "dark"
                                              ? "gray.300"
                                              : "gray.600"
                                          }
                                          fontSize="sm"
                                        >
                                          {p.pegawai?.jabatan}
                                        </Td>
                                        <Td
                                          isNumeric
                                          color="blue.600"
                                          fontWeight="semibold"
                                          fontSize="sm"
                                          bg={
                                            colorMode === "dark"
                                              ? "blue.900"
                                              : "blue.50"
                                          }
                                          borderRadius="md"
                                        >
                                          Rp {totalP.toLocaleString("id-ID")}
                                        </Td>
                                      </Tr>

                                      {/* Rincian BPD */}
                                      <Tr>
                                        <Td colSpan={3} p={0} border="none">
                                          <Box pl={8} py={3} pr={4}>
                                            <Box
                                              bg={
                                                colorMode === "dark"
                                                  ? "gray.800"
                                                  : "white"
                                              }
                                              borderRadius="md"
                                              border="1px solid"
                                              borderColor={
                                                colorMode === "dark"
                                                  ? "gray.600"
                                                  : "gray.200"
                                              }
                                              overflow="hidden"
                                            >
                                              <Table size="xs" variant="simple">
                                                <Thead
                                                  bg={
                                                    colorMode === "dark"
                                                      ? "gray.600"
                                                      : "gray.100"
                                                  }
                                                >
                                                  <Tr>
                                                    <Th
                                                      color={
                                                        colorMode === "dark"
                                                          ? "gray.100"
                                                          : "gray.700"
                                                      }
                                                      fontWeight="bold"
                                                      fontSize="xs"
                                                      textTransform="uppercase"
                                                      letterSpacing="wide"
                                                      py={2}
                                                    >
                                                      Item
                                                    </Th>
                                                    <Th
                                                      isNumeric
                                                      color={
                                                        colorMode === "dark"
                                                          ? "gray.100"
                                                          : "gray.700"
                                                      }
                                                      fontWeight="bold"
                                                      fontSize="xs"
                                                      textTransform="uppercase"
                                                      letterSpacing="wide"
                                                      py={2}
                                                    >
                                                      Nilai
                                                    </Th>
                                                    <Th
                                                      isNumeric
                                                      color={
                                                        colorMode === "dark"
                                                          ? "gray.100"
                                                          : "gray.700"
                                                      }
                                                      fontWeight="bold"
                                                      fontSize="xs"
                                                      textTransform="uppercase"
                                                      letterSpacing="wide"
                                                      py={2}
                                                    >
                                                      Qty
                                                    </Th>
                                                    <Th
                                                      isNumeric
                                                      color={
                                                        colorMode === "dark"
                                                          ? "gray.100"
                                                          : "gray.700"
                                                      }
                                                      fontWeight="bold"
                                                      fontSize="xs"
                                                      textTransform="uppercase"
                                                      letterSpacing="wide"
                                                      py={2}
                                                    >
                                                      Subtotal
                                                    </Th>
                                                  </Tr>
                                                </Thead>
                                                <Tbody>
                                                  {p.rincianBPDs?.map(
                                                    (r, rIndex) => {
                                                      const sub =
                                                        parseNumber(r.nilai) *
                                                        (r.qty
                                                          ? parseNumber(r.qty)
                                                          : 1);
                                                      return (
                                                        <Tr
                                                          key={r.id}
                                                          bg={
                                                            rIndex % 2 === 0
                                                              ? colorMode ===
                                                                "dark"
                                                                ? "gray.800"
                                                                : "white"
                                                              : colorMode ===
                                                                "dark"
                                                              ? "gray.750"
                                                              : "gray.25"
                                                          }
                                                          _hover={{
                                                            bg:
                                                              colorMode ===
                                                              "dark"
                                                                ? "gray.700"
                                                                : "blue.50",
                                                          }}
                                                        >
                                                          <Td
                                                            color={
                                                              colorMode ===
                                                              "dark"
                                                                ? "gray.300"
                                                                : "gray.600"
                                                            }
                                                            fontSize="xs"
                                                            py={2}
                                                          >
                                                            {r.item}
                                                          </Td>
                                                          <Td
                                                            isNumeric
                                                            color={
                                                              colorMode ===
                                                              "dark"
                                                                ? "gray.300"
                                                                : "gray.600"
                                                            }
                                                            fontSize="xs"
                                                            py={2}
                                                          >
                                                            Rp{" "}
                                                            {parseNumber(
                                                              r.nilai
                                                            ).toLocaleString(
                                                              "id-ID"
                                                            )}
                                                          </Td>
                                                          <Td
                                                            isNumeric
                                                            color={
                                                              colorMode ===
                                                              "dark"
                                                                ? "gray.300"
                                                                : "gray.600"
                                                            }
                                                            fontSize="xs"
                                                            py={2}
                                                          >
                                                            {r.qty}
                                                          </Td>
                                                          <Td
                                                            isNumeric
                                                            color="green.600"
                                                            fontWeight="semibold"
                                                            fontSize="xs"
                                                            py={2}
                                                            bg={
                                                              colorMode ===
                                                              "dark"
                                                                ? "green.900"
                                                                : "green.50"
                                                            }
                                                            borderRadius="md"
                                                          >
                                                            Rp{" "}
                                                            {sub.toLocaleString(
                                                              "id-ID"
                                                            )}
                                                          </Td>
                                                        </Tr>
                                                      );
                                                    }
                                                  )}
                                                </Tbody>
                                              </Table>
                                            </Box>
                                          </Box>
                                        </Td>
                                      </Tr>
                                    </React.Fragment>
                                  );
                                })}
                              </Tbody>
                            </Table>
                          </Box>
                        </Box>
                      </Collapse>
                    </Td>
                  </Tr>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Grand Total Section */}
      {perjalananList.length > 0 && (
        <Box
          mt={6}
          p={4}
          bg={colorMode === "dark" ? "gray.700" : "blue.50"}
          borderRadius="lg"
          border="2px solid"
          borderColor={colorMode === "dark" ? "blue.400" : "blue.200"}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={4}
          >
            <Box>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={colorMode === "dark" ? "gray.100" : "gray.700"}
                mb={1}
              >
                Total BPD Keseluruhan
              </Text>
              <Text
                fontSize="sm"
                color={colorMode === "dark" ? "gray.300" : "gray.600"}
              >
                Jumlah total dari semua perjalanan dinas
              </Text>
            </Box>
            <Box
              bg={colorMode === "dark" ? "green.800" : "green.100"}
              px={6}
              py={3}
              borderRadius="xl"
              border="2px solid"
              borderColor={colorMode === "dark" ? "green.400" : "green.300"}
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="green.600"
                textAlign="center"
              >
                Rp {grandTotal.toLocaleString("id-ID")}
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ======================= Komponen Utama Verifikasi =======================
function Verifikasi(props) {
  const [dataKwitGlobal, setDataKwitGlobal] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const { colorMode } = useColorMode();
  const user = useSelector(userRedux);

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  async function fetchKwitansiGlobal() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/verifikasi/get/${
          props.match.params.id
        }`
      );
      setDataKwitGlobal(res.data.result);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchKwitansiGlobal();
  }, []);

  return (
    <Center minH={"70vh"} pb={"40px"} px={{ base: "20px", md: "30px" }}>
      <Container
        style={{ overflowX: "auto" }}
        bgColor={"white"}
        maxW={"1280px"}
        p={{ base: "20px", md: "30px" }}
        borderRadius={"12px"}
        boxShadow={
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }
        bg={colorMode === "dark" ? "gray.800" : "white"}
      >
        {/* Header Section */}
        <Box mb={"30px"}>
          <Heading size="lg" color="gray.700" mb={4}>
            Detail Kwitansi Global
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Kelola dan lihat detail kwitansi global perjalanan dinas
          </Text>
        </Box>

        {/* Tabel Perjalanan */}
        <TablePerjalanan
          dataKwitGlobal={
            Array.isArray(dataKwitGlobal) ? dataKwitGlobal : [dataKwitGlobal]
          }
        />
      </Container>
    </Center>
  );
}

export default Verifikasi;
