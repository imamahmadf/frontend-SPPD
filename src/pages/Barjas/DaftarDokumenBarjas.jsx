import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";
import LayoutAset from "../../Componets/Aset/LayoutAset";
import AppPagination from "../../Componets/AppPagination";
import { userRedux } from "../../Redux/Reducers/auth";

const formatTanggal = (value) => {
  if (!value) return "-";
  const tanggal = new Date(value);
  if (Number.isNaN(tanggal.getTime())) return "-";
  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function DaftarDokumenBarjas() {
  const user = useSelector(userRedux);
  const history = useHistory();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const indukUnitKerjaId =
    user?.[0]?.unitKerja_profile?.indukUnitKerja?.id || "";

  const [dataDokumen, setDataDokumen] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [nomorInput, setNomorInput] = useState("");
  const [nomor, setNomor] = useState("");
  const [nomorSPInput, setNomorSPInput] = useState("");
  const [nomorSP, setNomorSP] = useState("");
  const [jenisId, setJenisId] = useState("");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("DESC");

  const hasActiveFilter = Boolean(
    nomor || nomorSP || jenisId || tanggalAwal || tanggalAkhir,
  );

  const resetFilters = () => {
    setNomorInput("");
    setNomor("");
    setNomorSPInput("");
    setNomorSP("");
    setJenisId("");
    setTanggalAwal("");
    setTanggalAkhir("");
    setSortBy("tanggal");
    setSortOrder("DESC");
    setPage(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNomor(nomorInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [nomorInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNomorSP(nomorSPInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [nomorSPInput]);

  useEffect(() => {
    setPage(0);
  }, [jenisId, tanggalAwal, tanggalAkhir, sortBy, sortOrder, limit]);

  useEffect(() => {
    if (!indukUnitKerjaId) return;
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/jenis-dokumen/${indukUnitKerjaId}`,
      )
      .then((res) => setJenisList(res.data.result || []))
      .catch((err) => console.error(err));
  }, [indukUnitKerjaId]);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
      indukUnitKerjaId: String(indukUnitKerjaId),
    });
    if (nomor) params.set("nomor", nomor);
    if (nomorSP) params.set("nomorSP", nomorSP);
    if (jenisId) params.set("jenisDokumenBarjasId", jenisId);
    if (tanggalAwal) params.set("startDate", tanggalAwal);
    if (tanggalAkhir) params.set("endDate", tanggalAkhir);

    setIsLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/daftar-dokumen?${params.toString()}`,
      )
      .then((res) => {
        setDataDokumen(res.data.result || []);
        setPages(res.data.totalPage || 0);
        setRows(res.data.totalRows || 0);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal memuat dokumen",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [
    page,
    limit,
    nomor,
    nomorSP,
    jenisId,
    tanggalAwal,
    tanggalAkhir,
    sortBy,
    sortOrder,
    indukUnitKerjaId,
    toast,
  ]);

  return (
    <LayoutAset>
      <Box bgColor="secondary" pb="40px" px="30px" pt="30px">
        <Box
          bg={colorMode === "dark" ? "gray.800" : "white"}
          p="30px"
          borderRadius="10px"
          boxShadow="sm"
        >
          <Flex
            justify="space-between"
            align="center"
            mb="30px"
            flexWrap="wrap"
            gap={4}
          >
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="gray.700">
                Daftar Dokumen
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Total: {rows} dokumen
              </Text>
            </VStack>
          </Flex>

          <Flex justify="space-between" align="center" mb="20px" gap={3}>
            <Heading size="md" color="gray.700">
              Filter dan Urutan
            </Heading>
            {hasActiveFilter && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={resetFilters}
              >
                Reset Filter
              </Button>
            )}
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb="30px">
            <FormControl>
              <FormLabel fontSize="sm">Nomor Dokumen</FormLabel>
              <Input
                placeholder="Cari nomor dokumen"
                value={nomorInput}
                onChange={(e) => setNomorInput(e.target.value)}
                bg={colorMode === "dark" ? "gray.700" : "terang"}
                height="44px"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Nomor Surat Pesanan</FormLabel>
              <Input
                placeholder="Cari nomor surat pesanan"
                value={nomorSPInput}
                onChange={(e) => setNomorSPInput(e.target.value)}
                bg={colorMode === "dark" ? "gray.700" : "terang"}
                height="44px"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Jenis Dokumen</FormLabel>
              <Select
                value={jenisId}
                onChange={(e) => setJenisId(e.target.value)}
                height="44px"
                bg={colorMode === "dark" ? "gray.700" : "terang"}
              >
                <option value="">Semua jenis</option>
                {jenisList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.jenis}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Tanggal Awal</FormLabel>
              <Input
                type="date"
                value={tanggalAwal}
                onChange={(e) => setTanggalAwal(e.target.value)}
                bg={colorMode === "dark" ? "gray.700" : "terang"}
                height="44px"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Tanggal Akhir</FormLabel>
              <Input
                type="date"
                value={tanggalAkhir}
                min={tanggalAwal || undefined}
                onChange={(e) => setTanggalAkhir(e.target.value)}
                bg={colorMode === "dark" ? "gray.700" : "terang"}
                height="44px"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Urutkan</FormLabel>
              <Select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [nextSortBy, nextSortOrder] = e.target.value.split(":");
                  setSortBy(nextSortBy);
                  setSortOrder(nextSortOrder);
                }}
                height="44px"
                bg={colorMode === "dark" ? "gray.700" : "terang"}
              >
                <option value="tanggal:DESC">Tanggal terbaru</option>
                <option value="tanggal:ASC">Tanggal terlama</option>
                <option value="nomor:ASC">Nomor A-Z</option>
                <option value="nomor:DESC">Nomor Z-A</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Data per halaman</FormLabel>
              <Select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                height="44px"
                bg={colorMode === "dark" ? "gray.700" : "terang"}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead bg={colorMode === "dark" ? "gray.700" : "gray.50"}>
                <Tr>
                  <Th>Nomor Dokumen</Th>
                  <Th>Tanggal</Th>
                  <Th>Jenis</Th>
                  <Th>Nomor Surat Pesanan</Th>
                  <Th>Rekanan</Th>
                  <Th isNumeric>Jumlah Item</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Tr key={index}>
                      {Array.from({ length: 7 }).map((cell, cellIndex) => (
                        <Td key={cellIndex}>
                          <Skeleton height="20px" />
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : dataDokumen.length > 0 ? (
                  dataDokumen.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.nomor || "-"}</Td>
                      <Td>{formatTanggal(item.tanggal)}</Td>
                      <Td>{item.jenisDokumenBarja?.jenis || "-"}</Td>
                      <Td>{item.SP?.nomor || "-"}</Td>
                      <Td>{item.SP?.rekanan?.nama || "-"}</Td>
                      <Td isNumeric>{item.itemDokumenBarjas?.length || 0}</Td>
                      <Td>
                        <Button
                          size="sm"
                          variant="primary"
                          isDisabled={!item.SPId}
                          onClick={() =>
                            history.push(`/barjas/detail-sp/${item.SPId}`)
                          }
                        >
                          Lihat SP
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      {hasActiveFilter
                        ? "Tidak ada dokumen yang sesuai filter"
                        : "Belum ada dokumen"}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Box mt={4}>
            <Text fontSize="sm" mb={2}>
              {rows > 0
                ? `Menampilkan ${page * limit + 1}–${Math.min(
                    (page + 1) * limit,
                    rows,
                  )} dari ${rows} dokumen`
                : "Tidak ada dokumen"}
            </Text>
            <AppPagination
              page={Math.min(page, Math.max(pages - 1, 0))}
              pageCount={pages}
              onPageChange={({ selected }) =>
                setPage((current) => (current === selected ? current : selected))
              }
            />
          </Box>
        </Box>
      </Box>
    </LayoutAset>
  );
}

export default DaftarDokumenBarjas;
