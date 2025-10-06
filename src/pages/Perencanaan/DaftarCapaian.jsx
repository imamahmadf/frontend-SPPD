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
  useToast,
  Button,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux } from "../../Redux/Reducers/auth";
import { Link, useHistory } from "react-router-dom";
function DaftarCapaian() {
  const [dataCapaian, setDataCapaian] = useState([]);
  const { colorMode } = useColorMode();
  const history = useHistory();
  const user = useSelector(userRedux);
  const toast = useToast();
  const [loadingRowId, setLoadingRowId] = useState(null);
  async function fetchCapaian() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/capaian/get/all-capaian/${user[0]?.unitKerja_profile?.id}`
      );
      setDataCapaian(res.data.result || []);
      console.log(res.data.result);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCapaian();
  }, []);

  async function updateCapaianStatus(capaianItem, statusBaru) {
    try {
      setLoadingRowId(capaianItem?.id);
      const payload = { ...capaianItem, status: statusBaru };
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/capaian/update/${
          capaianItem?.id
        }`,
        payload
      );
      setDataCapaian((prev) =>
        prev.map((target) => ({
          ...target,
          capaians: Array.isArray(target?.capaians)
            ? target.capaians.map((c) =>
                c.id === capaianItem.id ? { ...c, status: statusBaru } : c
              )
            : target?.capaians,
        }))
      );
      toast({
        title: "Status diperbarui",
        description: `Status capaian diubah ke ${statusBaru}`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Gagal memperbarui",
        description: "Terjadi kesalahan saat mengirim ke server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingRowId(null);
    }
  }

  return (
    <LayoutPerencanaan>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          style={{ overflowX: "auto" }}
          maxW={"1280px"}
          p={"30px"}
          borderRadius={"5px"}
          bg={colorMode === "dark" ? "gray.800" : "white"}
        >
          {dataCapaian?.length === 0 ? (
            <Text>Tidak ada data capaian.</Text>
          ) : (
            <Accordion allowMultiple>
              {dataCapaian.map((item) => {
                const indikatorNama = item?.indikator?.indikator || "-";
                const capaians = Array.isArray(item?.capaians)
                  ? [...item.capaians].sort(
                      (a, b) => (a?.bulan || 0) - (b?.bulan || 0)
                    )
                  : [];
                const tahunAnggaran = item?.tahunAnggarans?.[0]?.tahun;
                const jenisAnggaran =
                  item?.tahunAnggarans?.[0]?.jenisAnggaran?.jenis;
                const hasPengajuan = capaians.some(
                  (c) => (c?.status || "").toLowerCase() === "pengajuan"
                );

                return (
                  <AccordionItem
                    key={item.id}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    mb={4}
                  >
                    <h2>
                      <AccordionButton>
                        <Flex
                          w="100%"
                          alignItems="center"
                          gap={4}
                          textAlign="left"
                        >
                          <Heading as="h3" size="sm">
                            {indikatorNama}
                          </Heading>
                          {hasPengajuan && (
                            <Badge colorScheme="orange" variant="subtle">
                              Pengajuan
                            </Badge>
                          )}
                          <Spacer />
                          <Text fontSize="sm" color="gray.500">
                            {tahunAnggaran ? `TA ${tahunAnggaran}` : ""}
                            {jenisAnggaran ? ` • ${jenisAnggaran}` : ""}
                          </Text>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack align="stretch" spacing={3}>
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Capaian per Bulan
                          </Text>
                          <Table
                            size="sm"
                            variant="striped"
                            colorScheme={
                              colorMode === "dark" ? "gray" : "blackAlpha"
                            }
                          >
                            <Thead>
                              <Tr>
                                <Th>Bulan</Th>
                                <Th isNumeric>Nilai</Th>
                                <Th isNumeric>Anggaran</Th>
                                <Th>Status</Th>
                                <Th>Bukti Dukung</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {capaians.length === 0 ? (
                                <Tr>
                                  <Td colSpan={4}>
                                    <Text fontSize="sm" color="gray.500">
                                      Belum ada capaian.
                                    </Text>
                                  </Td>
                                </Tr>
                              ) : (
                                capaians.map((c) => (
                                  <Tr key={c.id}>
                                    <Td>{c?.bulan}</Td>
                                    <Td isNumeric>{c?.nilai ?? "-"}</Td>
                                    <Td isNumeric>
                                      {c?.anggaran?.toLocaleString("id-ID") ??
                                        "-"}
                                    </Td>
                                    <Td textTransform="capitalize">
                                      {c?.status || "-"}
                                      {(c?.status || "").toLowerCase() ===
                                        "pengajuan" && (
                                        <Badge
                                          ml={2}
                                          colorScheme="orange"
                                          variant="solid"
                                        >
                                          Butuh verifikasi
                                        </Badge>
                                      )}
                                      <HStack spacing={2} mt={2}>
                                        {(c?.status || "").toLowerCase() ===
                                        "pengajuan" ? (
                                          <>
                                            <Button
                                              size="xs"
                                              colorScheme="green"
                                              isLoading={loadingRowId === c.id}
                                              onClick={() =>
                                                updateCapaianStatus(
                                                  c,
                                                  "diterima"
                                                )
                                              }
                                            >
                                              Setujui
                                            </Button>
                                            <Button
                                              size="xs"
                                              colorScheme="red"
                                              variant="outline"
                                              isLoading={loadingRowId === c.id}
                                              onClick={() =>
                                                updateCapaianStatus(
                                                  c,
                                                  "ditolak"
                                                )
                                              }
                                            >
                                              Tolak
                                            </Button>
                                          </>
                                        ) : (
                                          <Button
                                            size="xs"
                                            colorScheme="orange"
                                            variant="ghost"
                                            isLoading={loadingRowId === c.id}
                                            onClick={() =>
                                              updateCapaianStatus(
                                                c,
                                                "pengajuan"
                                              )
                                            }
                                          >
                                            Ajukan
                                          </Button>
                                        )}
                                      </HStack>
                                    </Td>{" "}
                                    <Td>{c?.bukti}</Td>
                                  </Tr>
                                ))
                              )}
                            </Tbody>
                          </Table>
                        </Box>

                        {Array.isArray(item?.targetTriwulans) &&
                          item.targetTriwulans.length > 0 && (
                            <Box>
                              <Text fontWeight="bold" mb={2}>
                                Target Triwulan
                              </Text>
                              <Flex wrap="wrap" gap={3}>
                                {item.targetTriwulans
                                  .slice()
                                  .sort((a, b) =>
                                    (a?.namaTarget?.nama || "").localeCompare(
                                      b?.namaTarget?.nama || ""
                                    )
                                  )
                                  .map((tw) => (
                                    <Box
                                      key={tw.id}
                                      borderWidth="1px"
                                      borderRadius="md"
                                      p={3}
                                      minW="140px"
                                    >
                                      <Text fontSize="sm" color="gray.600">
                                        {tw?.namaTarget?.nama?.toUpperCase()}
                                      </Text>
                                      <Text fontWeight="bold">
                                        {tw?.nilai ?? "-"}
                                      </Text>
                                    </Box>
                                  ))}
                              </Flex>
                            </Box>
                          )}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </Container>
      </Box>
    </LayoutPerencanaan>
  );
}

export default DaftarCapaian;
