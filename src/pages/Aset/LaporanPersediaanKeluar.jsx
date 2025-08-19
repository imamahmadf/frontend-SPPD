import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutAset from "../../Componets/Aset/LayoutAset";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import Foto from "../../assets/add_photo.png";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  ModalCloseButton,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Heading,
  SimpleGrid,
  Th,
  Td,
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function LaporanPersediaanKeluar(props) {
  const [DataPersediaan, setDataPersediaan] = useState([]);
  const [page, setPage] = useState(0);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [spesifikasi, setSpesifikasi] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [harga, setHarga] = useState(0);
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [persediaanId, setPersediaanId] = useState(0);
  const [jumlahKeluar, setJumlahKeluar] = useState(0);
  const [tujuan, setTujuan] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const {
    isOpen: isModalKeluarOpen,
    onOpen: onModalKeluarOpen,
    onClose: onModalKeluarClose,
  } = useDisclosure();
  const handleSubmitChange = (field, val) => {
    console.log(field, val);
    if (field == "spek") {
      setSpesifikasi(val);
    } else if (field == "jumlah") {
      setJumlah(parseInt(val));
    } else if (field == "harga") {
      setHarga(parseInt(val));
    } else if (field == "tanggal") {
      setTanggal(val);
    } else if (field == "keterangan") {
      setKeterangan(val);
    }
  };
  async function fetchPersediaanKeluar() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/persediaan/get/detail-keluar`,
        {
          params: {
            unitKerjaId: user[0]?.unitKerja_profile?.id,
            laporanId: props.match.params.id,
          },
        }
      );

      setDataPersediaan(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleTambahKeluar = (itemId) => {
    setSelectedItemId(itemId);
    setJumlahKeluar(0);
    setTujuan("");
    onModalKeluarOpen();
  };

  const submitPersediaanKeluar = () => {
    if (!jumlahKeluar || !tujuan) {
      toast({
        title: "Error!",
        description: "Mohon isi jumlah dan tujuan",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/persediaan/post/keluar`,
        {
          stokMasukId: selectedItemId,
          jumlah: parseInt(jumlahKeluar),
          tujuan: tujuan,
          unitKerjaId: user[0]?.unitKerja_profile?.id,
          laporanPersediaanId: props.match.params.id,
          tanggal,
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "Persediaan keluar berhasil");
        toast({
          title: "Berhasil!",
          description: "Data persediaan keluar berhasil ditambahkan.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onModalKeluarClose();
        fetchPersediaanKeluar();
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Gagal menambahkan data persediaan keluar",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    fetchPersediaanKeluar();
  }, [page]);
  // Siapkan data terkelompok per persediaan, agar Nama Persediaan tidak berulang
  const grouped = Array.isArray(DataPersediaan?.data)
    ? DataPersediaan.data.map((item) => {
        const stokKeluarList = Array.isArray(item?.stokKeluar)
          ? item.stokKeluar
          : [];
        const rows =
          stokKeluarList.length > 0
            ? stokKeluarList.map((keluar) => ({
                key: `${item?.persediaanId}-${keluar?.id}`,
                jumlahKeluar: keluar?.jumlah ?? 0,
                hargaSatuan: keluar?.hargaSatuan ?? 0,
                tanggal: keluar?.tanggal || null,
                tujuan: keluar?.tujuan || null,
                stokMasukId: keluar?.stokMasukId ?? null,
              }))
            : [
                {
                  key: `${item?.persediaanId}-empty`,
                  jumlahKeluar: 0,
                  hargaSatuan: 0,
                  tanggal: null,
                  tujuan: null,
                  stokMasukId: null,
                },
              ];
        const allPrices = rows.map((r) => Number(r.hargaSatuan) || 0);
        const isHargaSatuanUniform = new Set(allPrices).size <= 1;
        const totalKeluar = rows.reduce(
          (sum, row) => sum + (Number(row.jumlahKeluar) || 0),
          0
        );
        const stokMasukIds = rows
          .map((r) => r.stokMasukId)
          .filter((v) => v != null);
        const isStokMasukIdUniform = new Set(stokMasukIds).size <= 1;
        const groupStokMasukId = isStokMasukIdUniform
          ? stokMasukIds[0] ?? null
          : null;
        return {
          groupKey: item?.persediaanId ?? item?.kodeBarang ?? Math.random(),
          namaPersediaan: item?.namaPersediaan || "-",
          kodeBarang: item?.kodeBarang || "-",
          sisa: item?.sisa ?? 0,
          isHargaSatuanUniform,
          mergedHargaSatuan: isHargaSatuanUniform ? allPrices[0] || 0 : null,
          rows,
          totalKeluar,
          stokAwal: (Number(item?.sisa) || 0) + (Number(totalKeluar) || 0),
          isStokMasukIdUniform,
          groupStokMasukId,
        };
      })
    : [];
  let groupNumber = 0;
  return (
    <>
      <LayoutAset>
        <Container
          maxW={"3280px"}
          bgColor={"secondary"}
          pb={"40px"}
          px={"30px"}
        >
          <Box
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            p={"30px"}
            borderRadius={"5px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <Table variant={"aset"}>
              <Thead>
                <Tr>
                  <Th>No.</Th>
                  <Th maxWidth={"20px"}>Nama Persediaan</Th>
                  <Th>Kode Barang</Th>
                  <Th>Harga Satuan</Th>
                  <Th>Stok Awal</Th>
                  <Th>Tanggal</Th> <Th>Tujuan</Th>
                  <Th>Jumlah Keluar</Th>
                  <Th>Sisa</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {grouped && grouped.length > 0 ? (
                  grouped.flatMap((group) => {
                    const rowCount = group.rows.length;
                    const noCell = <Td rowSpan={rowCount}>{++groupNumber}</Td>;
                    const namaCell = (
                      <Td rowSpan={rowCount}>{group.namaPersediaan}</Td>
                    );
                    const kodeCell = (
                      <Td rowSpan={rowCount}>{group.kodeBarang}</Td>
                    );
                    const sisaCell = <Td rowSpan={rowCount}>{group.sisa}</Td>;
                    const hargaMergedCell = group.isHargaSatuanUniform ? (
                      <Td rowSpan={rowCount}>
                        Rp{" "}
                        {Number(group.mergedHargaSatuan).toLocaleString(
                          "id-ID"
                        )}
                      </Td>
                    ) : null;
                    const stokAwalCell = (
                      <Td rowSpan={rowCount}>{group.stokAwal}</Td>
                    );
                    const aksiCell = (
                      <Td rowSpan={rowCount}>
                        <Button
                          onClick={() =>
                            handleTambahKeluar(group.groupStokMasukId)
                          }
                          size="sm"
                          colorScheme="blue"
                        >
                          Tambah
                        </Button>
                      </Td>
                    );

                    return group.rows.map((row, idx) => (
                      <Tr key={row.key}>
                        {idx === 0 && noCell}
                        {idx === 0 && namaCell}
                        {idx === 0 && kodeCell}
                        {group.isHargaSatuanUniform ? (
                          idx === 0 && hargaMergedCell
                        ) : (
                          <Td>
                            Rp {Number(row.hargaSatuan).toLocaleString("id-ID")}
                          </Td>
                        )}
                        {idx === 0 && stokAwalCell}
                        <Td>
                          {row.tanggal
                            ? new Date(row.tanggal).toLocaleDateString("id-ID")
                            : "-"}
                        </Td>
                        <Td>{row.tujuan || "-"}</Td>
                        <Td>{row.jumlahKeluar}</Td>

                        {idx === 0 && sisaCell}
                        {group.isStokMasukIdUniform ? (
                          idx === 0 && aksiCell
                        ) : (
                          <Td>
                            <Button
                              onClick={() =>
                                handleTambahKeluar(row.stokMasukId)
                              }
                              size="sm"
                              colorScheme="blue"
                            >
                              Tambah
                            </Button>
                          </Td>
                        )}
                      </Tr>
                    ));
                  })
                ) : (
                  <Tr>
                    <Td colSpan={9} textAlign="center">
                      Tidak ada data persediaan keluar
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Container>

        {/* Modal Tambah Persediaan Keluar */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isModalKeluarOpen}
          onClose={onModalKeluarClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="600px">
            <ModalHeader>
              <HStack>
                <Box bgColor={"aset"} width={"30px"} height={"30px"}></Box>
                <Heading color={"aset"} fontSize="24px">
                  Tambah Persediaan Keluar
                </Heading>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Box p={"20px"}>
                <FormControl my={"20px"}>
                  <FormLabel fontSize={"18px"}>Jumlah Keluar</FormLabel>
                  <Input
                    height={"50px"}
                    bgColor={"terang"}
                    type="number"
                    value={jumlahKeluar}
                    onChange={(e) => setJumlahKeluar(e.target.value)}
                    placeholder="Masukkan jumlah yang keluar"
                  />
                </FormControl>
                <FormControl my={"20px"}>
                  <FormLabel fontSize={"18px"}>Tanggal</FormLabel>
                  <Input
                    type={"date"}
                    height={"60px"}
                    bgColor={"terang"}
                    value={tujuan}
                    onChange={(e) => setTanggal(e.target.value)}
                    placeholder="Masukkan tanggal"
                  />
                </FormControl>
                <FormControl my={"20px"}>
                  <FormLabel fontSize={"18px"}>Tujuan</FormLabel>
                  <Textarea
                    height={"80px"}
                    bgColor={"terang"}
                    value={tujuan}
                    onChange={(e) => setTujuan(e.target.value)}
                    placeholder="Masukkan tujuan pengeluaran barang"
                  />
                </FormControl>
              </Box>
            </ModalBody>

            <ModalFooter pe={"30px"} pb={"20px"}>
              <Button
                onClick={submitPersediaanKeluar}
                variant={"primary"}
                mr={3}
              >
                Simpan
              </Button>
              <Button onClick={onModalKeluarClose} variant="ghost">
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </LayoutAset>
    </>
  );
}

export default LaporanPersediaanKeluar;
