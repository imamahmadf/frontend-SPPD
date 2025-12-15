import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Container,
  Heading,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Spinner,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../../Componets/Layout";

export default function DashboardKeuangan() {
  const [dataDashboard, setDataDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardKeuangan() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin/get/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDataDashboard(res.data.result);
      console.log(res.data.result);
    } catch (err) {
      console.error(err);
      setDataDashboard([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardKeuangan();
  }, []);

  // Fungsi untuk mendapatkan warna badge berdasarkan statusId
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "yellow";
      case 4:
        return "red";
      default:
        return "gray";
    }
  };

  // Fungsi untuk mendapatkan label status berdasarkan statusId
  const getStatusLabel = (statusId) => {
    switch (statusId) {
      case 1:
        return "Status 1";
      case 2:
        return "Status 2";
      case 3:
        return "Status 3";
      case 4:
        return "Status 4";
      default:
        return "Unknown";
    }
  };

  // Fungsi untuk memformat rupiah
  const formatRupiah = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Menghitung total keseluruhan
  const calculateTotals = () => {
    if (!dataDashboard || dataDashboard.length === 0) {
      return {
        totalUnitKerja: 0,
        totalSubKegiatan: 0,
        totalPerjalanan: 0,
        totalPersonil: 0,
        totalPersonilStatus1: 0,
        totalPersonilStatus2: 0,
        totalPersonilStatus3: 0,
        totalPersonilStatus4: 0,
      };
    }

    let totalSubKegiatan = 0;
    let totalPerjalanan = 0;
    let totalPersonil = 0;
    let totalPersonilStatus1 = 0;
    let totalPersonilStatus2 = 0;
    let totalPersonilStatus3 = 0;
    let totalPersonilStatus4 = 0;

    dataDashboard.forEach((unitKerja) => {
      totalSubKegiatan += unitKerja.daftarSubKegiatans?.length || 0;
      unitKerja.daftarSubKegiatans?.forEach((subKegiatan) => {
        totalPerjalanan += subKegiatan.perjalanans?.length || 0;
      });
      totalPersonil += unitKerja.totalPersonilUnitKerja || 0;
      totalPersonilStatus1 += unitKerja.totalPersonilStatus1 || 0;
      totalPersonilStatus2 += unitKerja.totalPersonilStatus2 || 0;
      totalPersonilStatus3 += unitKerja.totalPersonilStatus3 || 0;
      totalPersonilStatus4 += unitKerja.totalPersonilStatus4 || 0;
    });

    return {
      totalUnitKerja: dataDashboard.length,
      totalSubKegiatan,
      totalPerjalanan,
      totalPersonil,
      totalPersonilStatus1,
      totalPersonilStatus2,
      totalPersonilStatus3,
      totalPersonilStatus4,
    };
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading color={"primary"} mb={2}>
                Dashboard Keuangan
              </Heading>
              <Text color="gray.600">
                Ringkasan data personil per unit kerja dan sub kegiatan
              </Text>
            </Box>

            {loading ? (
              <Box py={20} textAlign="center">
                <Spinner size="xl" />
              </Box>
            ) : dataDashboard && dataDashboard.length > 0 ? (
              <>
                {/* Statistik Total */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Total Unit Kerja
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                          {totals.totalUnitKerja}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Total Sub Kegiatan
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="green.600"
                        >
                          {totals.totalSubKegiatan}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Total Perjalanan
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="purple.600"
                        >
                          {totals.totalPerjalanan}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Total Personil
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="orange.600"
                        >
                          {totals.totalPersonil}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Statistik Personil berdasarkan Status */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Personil Status 1
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                          {totals.totalPersonilStatus1}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Personil Status 2
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="green.600"
                        >
                          {totals.totalPersonilStatus2}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Personil Status 3
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="yellow.600"
                        >
                          {totals.totalPersonilStatus3}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <VStack align="flex-start" spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          Personil Status 4
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="red.600">
                          {totals.totalPersonilStatus4}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Data Unit Kerja */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Data Unit Kerja</Heading>
                  </CardHeader>
                  <CardBody>
                    <Accordion allowMultiple>
                      {dataDashboard.map((unitKerja, index) => (
                        <AccordionItem key={unitKerja.id || index}>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <HStack>
                                <Text fontWeight="bold">
                                  {unitKerja.unitKerja}
                                </Text>
                                <Badge colorScheme="blue">
                                  {unitKerja.daftarSubKegiatans?.length || 0}{" "}
                                  Sub Kegiatan
                                </Badge>
                                <Badge colorScheme="green">
                                  {unitKerja.totalPersonilUnitKerja || 0}{" "}
                                  Personil
                                </Badge>
                              </HStack>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack spacing={4} align="stretch">
                              {/* Statistik Unit Kerja */}
                              <SimpleGrid
                                columns={{ base: 2, md: 4 }}
                                spacing={4}
                              >
                                <Box>
                                  <Text fontSize="sm" color="gray.600">
                                    Total Personil
                                  </Text>
                                  <Text fontSize="lg" fontWeight="bold">
                                    {unitKerja.totalPersonilUnitKerja || 0}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" color="gray.600">
                                    Status 1
                                  </Text>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="blue.600"
                                  >
                                    {unitKerja.totalPersonilStatus1 || 0}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" color="gray.600">
                                    Status 2
                                  </Text>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="green.600"
                                  >
                                    {unitKerja.totalPersonilStatus2 || 0}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" color="gray.600">
                                    Status 3
                                  </Text>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="yellow.600"
                                  >
                                    {unitKerja.totalPersonilStatus3 || 0}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" color="gray.600">
                                    Status 4
                                  </Text>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="red.600"
                                  >
                                    {unitKerja.totalPersonilStatus4 || 0}
                                  </Text>
                                </Box>
                              </SimpleGrid>

                              {/* Sub Kegiatan */}
                              {unitKerja.daftarSubKegiatans &&
                                unitKerja.daftarSubKegiatans.length > 0 && (
                                  <Accordion allowMultiple>
                                    {unitKerja.daftarSubKegiatans.map(
                                      (subKegiatan, subIndex) => (
                                        <AccordionItem
                                          key={subKegiatan.id || subIndex}
                                        >
                                          <AccordionButton>
                                            <Box flex="1" textAlign="left">
                                              <HStack>
                                                <VStack
                                                  align="start"
                                                  spacing={0}
                                                >
                                                  <Text fontWeight="semibold">
                                                    {subKegiatan.subKegiatan}
                                                  </Text>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                  >
                                                    {subKegiatan.kodeRekening}
                                                  </Text>
                                                </VStack>
                                                <Badge colorScheme="purple">
                                                  {subKegiatan.perjalanans
                                                    ?.length || 0}{" "}
                                                  Perjalanan
                                                </Badge>
                                                <Badge colorScheme="orange">
                                                  {subKegiatan.totalPersonilSubKegiatan ||
                                                    0}{" "}
                                                  Personil
                                                </Badge>
                                              </HStack>
                                            </Box>
                                            <AccordionIcon />
                                          </AccordionButton>
                                          <AccordionPanel pb={4}>
                                            <VStack spacing={4} align="stretch">
                                              {/* Statistik Sub Kegiatan */}
                                              <SimpleGrid
                                                columns={{ base: 2, md: 5 }}
                                                spacing={4}
                                              >
                                                <Box>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                  >
                                                    Total Personil
                                                  </Text>
                                                  <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                  >
                                                    {subKegiatan.totalPersonilSubKegiatan ||
                                                      0}
                                                  </Text>
                                                </Box>
                                                <Box>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                  >
                                                    Status 1
                                                  </Text>
                                                  <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="blue.600"
                                                  >
                                                    {subKegiatan.totalPersonilStatus1 ||
                                                      0}
                                                  </Text>
                                                </Box>
                                                <Box>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                  >
                                                    Status 2
                                                  </Text>
                                                  <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="green.600"
                                                  >
                                                    {subKegiatan.totalPersonilStatus2 ||
                                                      0}
                                                  </Text>
                                                </Box>
                                                <Box>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                  >
                                                    Status 3
                                                  </Text>
                                                  <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="yellow.600"
                                                  >
                                                    {subKegiatan.totalPersonilStatus3 ||
                                                      0}
                                                  </Text>
                                                </Box>
                                                <Box>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                  >
                                                    Status 4
                                                  </Text>
                                                  <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="red.600"
                                                  >
                                                    {subKegiatan.totalPersonilStatus4 ||
                                                      0}
                                                  </Text>
                                                </Box>
                                              </SimpleGrid>

                                              {/* Informasi Tipe Perjalanan */}
                                              {subKegiatan.tipePerjalanan
                                                ?.length > 0 && (
                                                <Card>
                                                  <CardHeader>
                                                    <Heading size="sm">
                                                      Tipe Perjalanan
                                                    </Heading>
                                                  </CardHeader>
                                                  <CardBody>
                                                    <VStack
                                                      align="stretch"
                                                      spacing={2}
                                                    >
                                                      {subKegiatan.tipePerjalanan.map(
                                                        (tipe, idx) => (
                                                          <Badge
                                                            key={idx}
                                                            colorScheme="purple"
                                                            p={2}
                                                            fontSize="sm"
                                                          >
                                                            {tipe}
                                                          </Badge>
                                                        )
                                                      )}
                                                    </VStack>
                                                  </CardBody>
                                                </Card>
                                              )}

                                              {/* Anggaran dan Realisasi */}
                                              {subKegiatan.anggaranByTipe &&
                                                subKegiatan.anggaranByTipe
                                                  .length > 0 && (
                                                  <Card>
                                                    <CardHeader>
                                                      <Heading size="sm">
                                                        Anggaran dan Realisasi
                                                      </Heading>
                                                    </CardHeader>
                                                    <CardBody>
                                                      <Box overflowX="auto">
                                                        <Table
                                                          variant="simple"
                                                          size="sm"
                                                        >
                                                          <Thead>
                                                            <Tr>
                                                              <Th>Tahun</Th>
                                                              <Th>
                                                                Tipe Perjalanan
                                                              </Th>
                                                              <Th>Anggaran</Th>
                                                              <Th>Realisasi</Th>
                                                              <Th>Sisa</Th>
                                                              <Th>
                                                                Persentase
                                                              </Th>
                                                            </Tr>
                                                          </Thead>
                                                          <Tbody>
                                                            {subKegiatan.anggaranByTipe.map(
                                                              (
                                                                anggaran,
                                                                idx
                                                              ) => {
                                                                const sisa =
                                                                  anggaran.anggaran -
                                                                  anggaran.totalRealisasi;
                                                                const persentase =
                                                                  anggaran.anggaran >
                                                                  0
                                                                    ? (
                                                                        (anggaran.totalRealisasi /
                                                                          anggaran.anggaran) *
                                                                        100
                                                                      ).toFixed(
                                                                        2
                                                                      )
                                                                    : 0;
                                                                return (
                                                                  <Tr key={idx}>
                                                                    <Td>
                                                                      {
                                                                        anggaran.tahun
                                                                      }
                                                                    </Td>
                                                                    <Td>
                                                                      <Badge colorScheme="blue">
                                                                        {anggaran.tipePerjalanan ||
                                                                          "-"}
                                                                      </Badge>
                                                                    </Td>
                                                                    <Td>
                                                                      <Text fontWeight="semibold">
                                                                        {formatRupiah(
                                                                          anggaran.anggaran
                                                                        )}
                                                                      </Text>
                                                                    </Td>
                                                                    <Td>
                                                                      <Text
                                                                        fontWeight="semibold"
                                                                        color="green.600"
                                                                      >
                                                                        {formatRupiah(
                                                                          anggaran.totalRealisasi
                                                                        )}
                                                                      </Text>
                                                                    </Td>
                                                                    <Td>
                                                                      <Text
                                                                        fontWeight="semibold"
                                                                        color={
                                                                          sisa >=
                                                                          0
                                                                            ? "gray.600"
                                                                            : "red.600"
                                                                        }
                                                                      >
                                                                        {formatRupiah(
                                                                          sisa
                                                                        )}
                                                                      </Text>
                                                                    </Td>
                                                                    <Td>
                                                                      <Badge
                                                                        colorScheme={
                                                                          parseFloat(
                                                                            persentase
                                                                          ) <=
                                                                          100
                                                                            ? "green"
                                                                            : "red"
                                                                        }
                                                                      >
                                                                        {
                                                                          persentase
                                                                        }
                                                                        %
                                                                      </Badge>
                                                                    </Td>
                                                                  </Tr>
                                                                );
                                                              }
                                                            )}
                                                          </Tbody>
                                                        </Table>
                                                      </Box>
                                                    </CardBody>
                                                  </Card>
                                                )}

                                              <Divider />

                                              {/* Tabel Perjalanan */}
                                              {subKegiatan.perjalanans &&
                                                subKegiatan.perjalanans.length >
                                                  0 && (
                                                  <Box>
                                                    <Heading size="sm" mb={4}>
                                                      Detail Perjalanan
                                                    </Heading>
                                                    <Box overflowX="auto">
                                                      <Table
                                                        variant="simple"
                                                        size="sm"
                                                      >
                                                        <Thead>
                                                          <Tr>
                                                            <Th>
                                                              ID Perjalanan
                                                            </Th>
                                                            <Th>
                                                              Tempat Tujuan
                                                            </Th>
                                                            <Th>
                                                              Total Personil
                                                            </Th>
                                                            <Th>
                                                              SPJ sudah dibuat
                                                            </Th>
                                                            <Th>
                                                              Pengajuan SPJ
                                                            </Th>
                                                            <Th>
                                                              SPJ Terverivikasi
                                                            </Th>
                                                            <Th>SPJ ditolak</Th>
                                                          </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                          {subKegiatan.perjalanans.map(
                                                            (
                                                              perjalanan,
                                                              perjalananIndex
                                                            ) => {
                                                              // Mengambil tempat tujuan dari perjalanan.tempats
                                                              const tempatTujuan =
                                                                perjalanan.tempats
                                                                  ?.map(
                                                                    (t) =>
                                                                      t.tempat
                                                                  )
                                                                  .filter(
                                                                    (t) => t
                                                                  ) || [];

                                                              return (
                                                                <Tr
                                                                  key={
                                                                    perjalanan.id ||
                                                                    perjalananIndex
                                                                  }
                                                                >
                                                                  <Td>
                                                                    {
                                                                      perjalanan.id
                                                                    }
                                                                  </Td>
                                                                  <Td>
                                                                    {tempatTujuan.length >
                                                                    0 ? (
                                                                      <VStack
                                                                        align="start"
                                                                        spacing={
                                                                          1
                                                                        }
                                                                      >
                                                                        {tempatTujuan.map(
                                                                          (
                                                                            tempat,
                                                                            idx
                                                                          ) => (
                                                                            <Badge
                                                                              key={
                                                                                idx
                                                                              }
                                                                              colorScheme="teal"
                                                                              fontSize="xs"
                                                                            >
                                                                              {
                                                                                tempat
                                                                              }
                                                                            </Badge>
                                                                          )
                                                                        )}
                                                                      </VStack>
                                                                    ) : (
                                                                      <Text
                                                                        fontSize="sm"
                                                                        color="gray.400"
                                                                      >
                                                                        -
                                                                      </Text>
                                                                    )}
                                                                  </Td>
                                                                  <Td>
                                                                    <Badge colorScheme="blue">
                                                                      {
                                                                        perjalanan.totalPersonilPerjalanan
                                                                      }
                                                                    </Badge>
                                                                  </Td>
                                                                  <Td>
                                                                    <Badge colorScheme="blue">
                                                                      {
                                                                        perjalanan.totalPersonilStatus1
                                                                      }
                                                                    </Badge>
                                                                  </Td>
                                                                  <Td>
                                                                    <Badge colorScheme="green">
                                                                      {
                                                                        perjalanan.totalPersonilStatus2
                                                                      }
                                                                    </Badge>
                                                                  </Td>
                                                                  <Td>
                                                                    <Badge colorScheme="yellow">
                                                                      {
                                                                        perjalanan.totalPersonilStatus3
                                                                      }
                                                                    </Badge>
                                                                  </Td>
                                                                  <Td>
                                                                    <Badge colorScheme="red">
                                                                      {
                                                                        perjalanan.totalPersonilStatus4
                                                                      }
                                                                    </Badge>
                                                                  </Td>
                                                                </Tr>
                                                              );
                                                            }
                                                          )}
                                                        </Tbody>
                                                      </Table>
                                                    </Box>
                                                  </Box>
                                                )}
                                            </VStack>
                                          </AccordionPanel>
                                        </AccordionItem>
                                      )
                                    )}
                                  </Accordion>
                                )}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardBody>
                </Card>
              </>
            ) : (
              <Card>
                <CardBody>
                  <Text textAlign="center" color="gray.500">
                    Tidak ada data untuk ditampilkan
                  </Text>
                </CardBody>
              </Card>
            )}
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
