import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Tooltip,
  Badge,
  Heading,
  VStack,
  Grid,
  Skeleton,
  useColorMode,
} from "@chakra-ui/react";
import { AsyncSelect, Select as Select2 } from "chakra-react-select";
import { BsEyeFill, BsX } from "react-icons/bs";
import "../../Style/pagination.css";
import AppPagination from "../../Componets/AppPagination";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Layout from "../../Componets/Layout";

const STATUS_PERSONIL = {
  1: {
    label: "SPD & Surat Tugas dibuat",
    dot: "#3B82F6",
    bg: "#EFF6FF",
    color: "#1D4ED8",
  },
  2: {
    label: "Pengajuan kuitansi",
    dot: "#F59E0B",
    bg: "#FFF7ED",
    color: "#C2410C",
  },
  3: {
    label: "Kuitansi tervierifikasi",
    dot: "#16A34A",
    bg: "#F0FDF4",
    color: "#15803D",
  },
  4: {
    label: "Kuitansi ditolak",
    dot: "#EF4444",
    bg: "#FEF2F2",
    color: "#B91C1C",
  },
};

function gayaStatus(statusId) {
  return (
    STATUS_PERSONIL[statusId] || {
      label: "Draft — SPD belum dibuat",
      dot: "#9CA3AF",
      bg: "#F3F4F6",
      color: "#4B5563",
    }
  );
}

function gayaTipe(item) {
  const tipeId = item?.jenisPerjalanan?.tipePerjalanan?.id;
  const label =
    item?.jenisPerjalanan?.tipePerjalanan?.tipe ||
    item?.jenisPerjalanan?.jenis ||
    "-";
  if (tipeId === 1) {
    return { label, bg: "#ECFDF3", color: "#067647" };
  }
  if (tipeId === 2) {
    return { label, bg: "#EFF8FF", color: "#175CD3" };
  }
  return { label, bg: "#F2F4F7", color: "#344054" };
}

function daftarTujuan(item) {
  const dalamDaerah = item?.jenisPerjalanan?.tipePerjalanan?.id === 1;
  return (item?.tempats || [])
    .map((tempat) => (dalamDaerah ? tempat?.dalamKota?.nama : tempat?.tempat))
    .filter(Boolean);
}

function formatTanggalSingkat(nilai) {
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "-";
  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTanggalLengkap(nilai) {
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "-";
  return tanggal.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatJadwal(mulai, selesai) {
  if (!mulai) return "-";
  const awal = new Date(mulai);
  const akhir = selesai ? new Date(selesai) : null;
  if (Number.isNaN(awal.getTime())) return "-";
  if (
    !akhir ||
    Number.isNaN(akhir.getTime()) ||
    awal.toDateString() === akhir.toDateString()
  ) {
    return formatTanggalSingkat(awal);
  }

  const bulanAwal = awal.toLocaleDateString("id-ID", { month: "short" });
  const bulanAkhir = akhir.toLocaleDateString("id-ID", { month: "short" });
  if (
    awal.getFullYear() === akhir.getFullYear() &&
    awal.getMonth() === akhir.getMonth()
  ) {
    return `${awal.getDate()}–${akhir.getDate()} ${bulanAwal} ${awal.getFullYear()}`;
  }
  if (awal.getFullYear() === akhir.getFullYear()) {
    return `${awal.getDate()} ${bulanAwal} – ${akhir.getDate()} ${bulanAkhir} ${awal.getFullYear()}`;
  }
  return `${formatTanggalSingkat(awal)} – ${formatTanggalSingkat(akhir)}`;
}

function hitungDurasi(mulai, selesai) {
  if (!mulai) return null;
  const awal = new Date(mulai);
  const akhir = selesai ? new Date(selesai) : new Date(mulai);
  if (Number.isNaN(awal.getTime()) || Number.isNaN(akhir.getTime()))
    return null;
  const hari =
    Math.round(
      (new Date(akhir).setHours(0, 0, 0, 0) -
        new Date(awal).setHours(0, 0, 0, 0)) /
        86400000,
    ) + 1;
  if (!Number.isFinite(hari) || hari < 1) return null;
  return `${hari} hari`;
}

function gayaSelect(colorMode) {
  const gelap = colorMode === "dark";
  return {
    container: (provided) => ({
      ...provided,
      borderRadius: "8px",
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: gelap ? "gray.900" : "white",
      border: "1px solid",
      borderColor: gelap ? "gray.600" : "gray.200",
      borderRadius: "8px",
      minHeight: "40px",
      height: "40px",
      fontSize: "14px",
      boxShadow: "none",
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: "12px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#98A2B3",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: gelap ? "white" : "#1D2939",
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(55, 176, 134, 1)"
        : gelap
          ? "#1A202C"
          : "white",
      color: state.isFocused ? "white" : gelap ? "white" : "#1D2939",
      fontSize: "14px",
    }),
  };
}

function DaftarAdmin() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit] = useState(30);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataUnitKerja, setDataUnitKerja] = useState([]);
  const [dataSumberDana, setDataSumberDana] = useState([]);
  const [filterUnitKerjaId, setFilterUnitKerjaId] = useState(0);
  const [filterSumberDanaId, setFilterSumberDanaId] = useState(0);
  const [pegawaiId, setPegawaiId] = useState(0);
  const [pegawaiTerpilih, setPegawaiTerpilih] = useState(null);
  const [unitTerpilih, setUnitTerpilih] = useState(null);
  const [sumberTerpilih, setSumberTerpilih] = useState(null);
  const { colorMode } = useColorMode();

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const adaFilter = Boolean(
    pegawaiId || filterUnitKerjaId || filterSumberDanaId,
  );

  const resetFilter = () => {
    setPegawaiId(0);
    setFilterUnitKerjaId(0);
    setFilterSumberDanaId(0);
    setPegawaiTerpilih(null);
    setUnitTerpilih(null);
    setSumberTerpilih(null);
    setPage(0);
  };

  async function fetchUnitkerja() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin/get/unit-kerja`,
      );
      setDataUnitKerja(res.data.result || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSumberDana() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin/get/sumber-dana`,
      );
      setDataSumberDana(res.data.result || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDataPerjalanan() {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/get/keuangan/daftar-perjalanan?&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${filterUnitKerjaId}&pegawaiId=${pegawaiId}&sumberDanaId=${filterSumberDanaId}`,
      );
      setDataPerjalanan(res.data.result || []);
      setPage(res.data.page || 0);
      setPages(res.data.totalPage || 0);
      setRows(res.data.totalRows || 0);
    } catch (err) {
      console.error(err.message);
      setDataPerjalanan([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUnitkerja();
    fetchSumberDana();
  }, []);

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page, filterUnitKerjaId, pegawaiId, filterSumberDanaId]);

  const labelWarna = colorMode === "dark" ? "gray.300" : "gray.600";
  const kartuBg = colorMode === "dark" ? "gray.800" : "white";
  const garis = colorMode === "dark" ? "gray.700" : "gray.200";
  const garisBaris = colorMode === "dark" ? "gray.700" : "gray.100";
  const selectStyles = gayaSelect(colorMode);

  return (
    <Layout>
      <Box
        bg={colorMode === "dark" ? "gray.900" : "#F5F7FB"}
        pb={{ base: "30px", md: "40px" }}
        px={{ base: "16px", md: "28px" }}
        pt={{ base: "20px", md: "28px" }}
        minH="100vh"
      >
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "stretch", lg: "flex-start" }}
          gap={4}
          mb={5}
        >
          <Box>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color={colorMode === "dark" ? "white" : "gray.900"}
              letterSpacing="-0.02em"
            >
              Daftar Perjalanan Dinas
            </Heading>
            <Text
              mt={1}
              fontSize="sm"
              color={colorMode === "dark" ? "gray.400" : "gray.500"}
            >
              {rows} perjalanan tercatat. Pilih salah satu untuk melihat detail,
              personil, dan biaya.
            </Text>
          </Box>
        </Flex>

        <Box
          bg={kartuBg}
          border="1px solid"
          borderColor={garis}
          borderRadius="xl"
          boxShadow="sm"
          p={{ base: 4, md: 5 }}
          mb={4}
        >
          <Grid
            templateColumns={{
              base: "1fr",
              lg: adaFilter
                ? "minmax(200px, 1.2fr) minmax(180px, 1fr) minmax(180px, 1fr) auto"
                : "minmax(200px, 1.2fr) minmax(180px, 1fr) minmax(180px, 1fr)",
            }}
            gap={4}
            alignItems="end"
          >
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color={labelWarna} mb={1.5}>
                Nama pegawai
              </FormLabel>
              <AsyncSelect
                value={pegawaiTerpilih}
                isClearable
                loadOptions={async (inputValue) => {
                  if (!inputValue) return [];
                  try {
                    const res = await axios.get(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/pegawai/search?q=${inputValue}`,
                    );
                    return (res.data.result || []).map((val) => ({
                      value: val,
                      label: val.nama,
                    }));
                  } catch (err) {
                    console.error("Failed to load options:", err.message);
                    return [];
                  }
                }}
                placeholder="Ketik nama pegawai"
                onChange={(selectedOption) => {
                  setPegawaiTerpilih(selectedOption);
                  setPage(0);
                  setPegawaiId(selectedOption?.value?.id || 0);
                }}
                chakraStyles={selectStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color={labelWarna} mb={1.5}>
                Unit kerja
              </FormLabel>
              <Select2
                value={unitTerpilih}
                isClearable
                options={(dataUnitKerja || []).map((val) => ({
                  value: val.id,
                  label: val.unitKerja,
                }))}
                placeholder="Semua unit kerja"
                onChange={(selectedOption) => {
                  setUnitTerpilih(selectedOption);
                  setPage(0);
                  setFilterUnitKerjaId(selectedOption?.value || 0);
                }}
                chakraStyles={selectStyles}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color={labelWarna} mb={1.5}>
                Sumber dana
              </FormLabel>
              <Select2
                value={sumberTerpilih}
                isClearable
                options={(dataSumberDana || []).map((val) => ({
                  value: val.id,
                  label: val.sumber,
                }))}
                placeholder="Semua sumber dana"
                onChange={(selectedOption) => {
                  setSumberTerpilih(selectedOption);
                  setPage(0);
                  setFilterSumberDanaId(selectedOption?.value || 0);
                }}
                chakraStyles={selectStyles}
              />
            </FormControl>
            {adaFilter && (
              <Button
                leftIcon={<BsX />}
                onClick={resetFilter}
                variant="outline"
                h="40px"
                borderRadius="lg"
                fontWeight="medium"
              >
                Reset
              </Button>
            )}
          </Grid>
        </Box>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          mb={3}
          px={1}
        >
          <HStack spacing={4} wrap="wrap">
            <HStack spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg="#9CA3AF" flexShrink={0} />
              <Text fontSize="xs" color={labelWarna}>
                Draft — SPD belum dibuat
              </Text>
            </HStack>
            {Object.values(STATUS_PERSONIL).map((status) => (
              <HStack key={status.label} spacing={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={status.dot}
                  flexShrink={0}
                />
                <Text fontSize="xs" color={labelWarna}>
                  {status.label}
                </Text>
              </HStack>
            ))}
          </HStack>
          <Text
            fontSize="sm"
            color={colorMode === "dark" ? "gray.400" : "gray.500"}
            whiteSpace="nowrap"
          >
            Menampilkan {isLoading ? "..." : dataPerjalanan.length} dari {rows}{" "}
            perjalanan
          </Text>
        </Flex>

        <Box
          bg={kartuBg}
          border="1px solid"
          borderColor={garis}
          borderRadius="xl"
          boxShadow="sm"
          overflowX="auto"
        >
          {isLoading ? (
            <Box p={4}>
              <Skeleton height="44px" mb={3} />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="72px" mb={2} />
              ))}
            </Box>
          ) : (
            <Table variant="unstyled" minW="1080px">
              <Thead>
                <Tr>
                  {[
                    "No",
                    "Tujuan",
                    "Jadwal",
                    "Personil",
                    "Dokumen",
                    "Sumber",
                    "Aksi",
                  ].map((kolom) => (
                    <Th
                      key={kolom}
                      fontSize="sm"
                      fontWeight="medium"
                      color={colorMode === "dark" ? "gray.400" : "gray.500"}
                      textTransform="none"
                      letterSpacing="normal"
                      py={4}
                      px={4}
                      borderBottom="1px solid"
                      borderColor={garisBaris}
                    >
                      {kolom}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {dataPerjalanan.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} py={10}>
                      <Text
                        textAlign="center"
                        color={colorMode === "dark" ? "gray.400" : "gray.500"}
                      >
                        {adaFilter
                          ? "Tidak ada perjalanan yang cocok dengan filter."
                          : "Belum ada perjalanan dinas."}
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  dataPerjalanan.map((item, index) => {
                    const tujuan = daftarTujuan(item);
                    const mulai = item?.tempats?.[0]?.tanggalBerangkat;
                    const selesai = item?.tempats?.[0]?.tanggalPulang;
                    const tipe = gayaTipe(item);
                    const kodeUnit =
                      item?.ttdSuratTuga?.indukUnitKerja_ttdSuratTugas
                        ?.kodeInduk;
                    const jenis = item?.jenisPerjalanan?.jenis;
                    const judul = tujuan[0] || jenis || "-";

                    return (
                      <Tr
                        key={item?.id || index}
                        _hover={{
                          bg: colorMode === "dark" ? "gray.750" : "gray.50",
                        }}
                      >
                        <Td
                          py={4}
                          px={4}
                          color={colorMode === "dark" ? "gray.300" : "gray.600"}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                        >
                          {page * limit + index + 1}
                        </Td>
                        <Td
                          py={4}
                          px={4}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                          minW="190px"
                        >
                          <Text
                            fontWeight="semibold"
                            color={colorMode === "dark" ? "white" : "gray.800"}
                          >
                            {judul}
                          </Text>
                          {tujuan.slice(1).map((nama, urutan) => (
                            <Text
                              key={`${nama}-${urutan}`}
                              fontWeight="medium"
                              fontSize="sm"
                              color={
                                colorMode === "dark" ? "gray.200" : "gray.700"
                              }
                            >
                              {nama}
                            </Text>
                          ))}
                          <Badge
                            mt={2}
                            bg={tipe.bg}
                            color={tipe.color}
                            px={2}
                            py={0.5}
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight="semibold"
                            textTransform="none"
                          >
                            {tipe.label}
                          </Badge>
                          {jenis && jenis !== judul && jenis !== tipe.label && (
                            <Text
                              mt={1}
                              fontSize="xs"
                              color={
                                colorMode === "dark" ? "gray.400" : "gray.500"
                              }
                            >
                              {jenis}
                            </Text>
                          )}
                        </Td>
                        <Td
                          py={4}
                          px={4}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                          whiteSpace="nowrap"
                        >
                          <Tooltip
                            label={`Berangkat ${formatTanggalLengkap(
                              mulai,
                            )} · Pulang ${formatTanggalLengkap(selesai)}`}
                            hasArrow
                          >
                            <Box>
                              <Text
                                fontWeight="medium"
                                color={
                                  colorMode === "dark" ? "gray.100" : "gray.800"
                                }
                              >
                                {formatJadwal(mulai, selesai)}
                              </Text>
                              {hitungDurasi(mulai, selesai) && (
                                <Text
                                  fontSize="sm"
                                  color={
                                    colorMode === "dark"
                                      ? "gray.400"
                                      : "gray.500"
                                  }
                                >
                                  {hitungDurasi(mulai, selesai)}
                                </Text>
                              )}
                            </Box>
                          </Tooltip>
                        </Td>
                        <Td
                          py={4}
                          px={4}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                          maxW="340px"
                        >
                          {(item?.personils || []).length === 0 ? (
                            <Text fontSize="sm" color="gray.400">
                              -
                            </Text>
                          ) : (
                            <Flex wrap="wrap" gap={2}>
                              {item.personils.map((personil, urutan) => {
                                const gaya = gayaStatus(personil?.statusId);
                                return (
                                  <Tooltip
                                    key={
                                      personil?.id ||
                                      personil?.pegawai?.id ||
                                      urutan
                                    }
                                    label={
                                      personil?.status?.statusKuitansi ||
                                      gaya.label
                                    }
                                    hasArrow
                                    bg={gaya.dot}
                                  >
                                    <Badge
                                      bg={gaya.bg}
                                      color={gaya.color}
                                      px={2.5}
                                      py={1}
                                      borderRadius="full"
                                      fontSize="xs"
                                      fontWeight="medium"
                                      textTransform="none"
                                      cursor="help"
                                    >
                                      {personil?.pegawai?.nama || "-"}
                                    </Badge>
                                  </Tooltip>
                                );
                              })}
                            </Flex>
                          )}
                        </Td>
                        <Td
                          py={4}
                          px={4}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                          minW="220px"
                        >
                          <VStack align="start" spacing={1}>
                            <Text
                              fontSize="xs"
                              color={
                                colorMode === "dark" ? "gray.400" : "gray.500"
                              }
                            >
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color={
                                  colorMode === "dark" ? "gray.300" : "gray.600"
                                }
                              >
                                ST
                              </Text>{" "}
                              {item?.noSuratTugas || "-"}
                            </Text>
                            {kodeUnit && (
                              <Text
                                fontSize="xs"
                                color={
                                  colorMode === "dark" ? "gray.500" : "gray.400"
                                }
                              >
                                Unit kerja {kodeUnit}
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td
                          py={4}
                          px={4}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                          color={colorMode === "dark" ? "gray.200" : "gray.700"}
                          fontSize="sm"
                        >
                          {item?.bendahara?.sumberDana?.sumber || "-"}
                        </Td>
                        <Td
                          py={4}
                          px={4}
                          borderBottom="1px solid"
                          borderColor={garisBaris}
                          verticalAlign="top"
                        >
                          <Button
                            size="sm"
                            leftIcon={<BsEyeFill />}
                            bg="primary"
                            color="white"
                            borderRadius="lg"
                            fontWeight="semibold"
                            _hover={{ bg: "primaryGelap" }}
                            onClick={() =>
                              history.push(`/admin/rampung/${item?.id || ""}`)
                            }
                          >
                            Detail
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          )}
        </Box>

        <Flex justify="center" mt={6}>
          <AppPagination
            page={page}
            pageCount={pages}
            onPageChange={changePage}
          />
        </Flex>
      </Box>
    </Layout>
  );
}

export default DaftarAdmin;
