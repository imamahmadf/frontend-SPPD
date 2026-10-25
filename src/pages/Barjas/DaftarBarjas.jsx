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

const formatRupiah = (value) => {
  const angka = Number(value);
  if (!Number.isFinite(angka)) return "-";
  return `Rp ${angka.toLocaleString("id-ID")}`;
};

function DaftarBarjas() {
  const user = useSelector(userRedux);
  const history = useHistory();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const indukUnitKerjaId =
    user?.[0]?.unitKerja_profile?.indukUnitKerja?.id || "";

  const [dataBarjas, setDataBarjas] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(25);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [namaInput, setNamaInput] = useState("");
  const [nama, setNama] = useState("");
  const [nomorSPInput, setNomorSPInput] = useState("");
  const [nomorSP, setNomorSP] = useState("");
  const [jenisId, setJenisId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");

  const hasActiveFilter = Boolean(nama || nomorSP || jenisId);

  const resetFilters = () => {
    setNamaInput("");
    setNama("");
    setNomorSPInput("");
    setNomorSP("");
    setJenisId("");
    setSortBy("createdAt");
    setSortOrder("DESC");
    setPage(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNama(namaInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [namaInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNomorSP(nomorSPInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [nomorSPInput]);

  useEffect(() => {
    setPage(0);
  }, [jenisId, sortBy, sortOrder, limit]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/seed-detail`)
      .then((res) => setJenisList(res.data.resultJenisBarjas || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
      indukUnitKerjaId: String(indukUnitKerjaId),
    });
    if (nama) params.set("nama", nama);
    if (nomorSP) params.set("nomorSP", nomorSP);
    if (jenisId) params.set("jenisBarjasId", jenisId);

    setIsLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/daftar-barjas?${params.toString()}`,
      )
      .then((res) => {
        setDataBarjas(res.data.result || []);
        setPages(res.data.totalPage || 0);
        setRows(res.data.totalRows || 0);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal memuat barang dan jasa",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [
    page,
    limit,
    nama,
    nomorSP,
    jenisId,
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
          <VStack align="start" spacing={1} mb="30px">
            <Heading size="lg" color="gray.700">
              Daftar Barjas
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Total: {rows} barang dan jasa
            </Text>
          </VStack>

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
              <FormLabel fontSize="sm">Nama</FormLabel>
              <Input
                placeholder="Cari nama barang atau jasa"
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
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
              <FormLabel fontSize="sm">Jenis</FormLabel>
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
                <option value="createdAt:DESC">Baru diinput</option>
                <option value="nama:ASC">Nama A-Z</option>
                <option value="nama:DESC">Nama Z-A</option>
                <option value="harga:DESC">Harga tertinggi</option>
                <option value="harga:ASC">Harga terendah</option>
                <option value="jumlah:DESC">Jumlah terbanyak</option>
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
                  <Th>Nama</Th>
                  <Th>Jenis</Th>
                  <Th isNumeric>Jumlah</Th>
                  <Th isNumeric>Harga Satuan</Th>
                  <Th isNumeric>Nominal</Th>
                  <Th>Nomor Surat Pesanan</Th>
                  <Th>Rekanan</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <Tr key={index}>
                      {Array.from({ length: 8 }).map((cell, cellIndex) => (
                        <Td key={cellIndex}>
                          <Skeleton height="20px" />
                        </Td>
                      ))}
                    </Tr>
                  ))
                ) : dataBarjas.length > 0 ? (
                  dataBarjas.map((item) => {
                    const nominal =
                      Number(item.jumlah || 0) * Number(item.harga || 0);
                    return (
                      <Tr key={item.id}>
                        <Td>{item.nama || "-"}</Td>
                        <Td>{item.jenisBarja?.jenis || "-"}</Td>
                        <Td isNumeric>
                          {Number(item.jumlah || 0).toLocaleString("id-ID")}
                        </Td>
                        <Td isNumeric>{formatRupiah(item.harga)}</Td>
                        <Td isNumeric>{formatRupiah(nominal)}</Td>
                        <Td>{item.SP?.nomor || "-"}</Td>
                        <Td>{item.SP?.rekanan?.nama || "-"}</Td>
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
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={8}>
                      {hasActiveFilter
                        ? "Tidak ada barang dan jasa yang sesuai filter"
                        : "Belum ada barang dan jasa"}
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
                  )} dari ${rows} barang dan jasa`
                : "Tidak ada barang dan jasa"}
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

export default DaftarBarjas;
