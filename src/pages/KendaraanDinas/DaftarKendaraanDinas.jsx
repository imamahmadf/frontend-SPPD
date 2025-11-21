import React, { useState, useEffect } from "react";
import axios from "axios";

import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";

import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import Foto from "../../assets/add_photo.png";
import { BsDownload } from "react-icons/bs";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";

import {
  BsThreeDotsVertical,
  BsEyeFill,
  BsFileEarmarkArrowDown,
  BsTrash,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function DaftarKendaraanDinas() {
  const [DataKendaraan, setDataKendaraan] = useState([]);
  const [DataKendaraanDinas, setDataKendaraanDinas] = useState([]);
  const history = useHistory();
  const [dataSeed, setDataSeed] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [dataUnitKerja, setDataUnitKerja] = useState(null);
  const [unitKerjaId, setUnitKerjaId] = useState(0);
  const [pegawaiId, setPegawaiId] = useState(0);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [nomorPlat, setNomorPlat] = useState("");
  const [unitKerjaFilterId, setUnitKerjaFilterId] = useState(0);
  const [pegawaiFilterId, setPegawaiFilterId] = useState(0);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [kendaraanId, setKendaraanId] = useState(0);
  const [kendaraanTerpilih, setKendaraanTerpilih] = useState(null);
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [tujuan, setTujuan] = useState("");
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();

  // State untuk modal hapus
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [kendaraanToDelete, setKendaraanToDelete] = useState(null);
  const [perjalananToDelete, setPerjalananToDelete] = useState(null);

  // State untuk modal detail foto

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  async function fetchDataKendaraanDinas() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan-dinas/get`)
      .then((res) => {
        setDataKendaraanDinas(res.data.result);
        setDataUnitKerja(res.data.resultUnitKerja);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataKendaraan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kendaraan/get/induk-unit-kerja/${
          user[0]?.unitKerja_profile.indukUnitKerja.id
        }`
      )
      .then((res) => {
        setDataKendaraan(res.data.result);

        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Fungsi untuk menghapus kendaraan dinas
  const handleDeleteKendaraan = async () => {
    if (!kendaraanToDelete || !perjalananToDelete) return;

    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kendaraan-dinas/delete/${kendaraanToDelete}`,
        {
          perjalananId: perjalananToDelete,
        }
      );

      toast({
        title: "Berhasil",
        description: "Data kendaraan dinas berhasil dihapus",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data setelah berhasil hapus
      fetchDataKendaraanDinas();
      onDeleteClose();
      setKendaraanToDelete(null);
      setPerjalananToDelete(null);
    } catch (error) {
      console.error("Error deleting kendaraan dinas:", error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus data kendaraan dinas",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fungsi untuk membuka modal hapus
  const openDeleteModal = (kendaraanId, perjalananId) => {
    setKendaraanToDelete(kendaraanId);
    setPerjalananToDelete(perjalananId);
    onDeleteOpen();
  };

  useEffect(() => {
    fetchDataKendaraanDinas();
    fetchDataKendaraan();
  }, [
    page,
    // unitKerjaFilterId,
    // pegawaiFilterId,
    // nomorPlat,
    // tanggalAkhir,
    // tanggalAwal,
  ]);
  return (
    <>
      <Layout>
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Box
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            p={"30px"}
            borderRadius={"5px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            <HStack gap={5} mb={"30px"}>
              <Spacer />
            </HStack>{" "}
            <Flex
              borderRadius={"5px"}
              bg={colorMode === "dark" ? "gray.800" : "white"}
              mb={"30px"}
              gap={5}
            >
              <FormControl>
                <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
                <AsyncSelect
                  loadOptions={async (inputValue) => {
                    if (!inputValue) return [];
                    try {
                      const res = await axios.get(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/pegawai/search?q=${inputValue}`
                      );

                      const filtered = res.data.result;

                      return filtered.map((val) => ({
                        value: val.id,
                        label: val.nama,
                      }));
                    } catch (err) {
                      console.error("Failed to load options:", err.message);
                      return [];
                    }
                  }}
                  placeholder="Ketik Nama Pegawai"
                  onChange={(selectedOption) => {
                    setPegawaiFilterId(selectedOption.value);
                  }}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: "6px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "terang",
                      border: "0px",
                      height: "60px",
                      _hover: { borderColor: "yellow.700" },
                      minHeight: "40px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      bg: state.isFocused ? "primary" : "white",
                      color: state.isFocused ? "white" : "black",
                    }),
                  }}
                />
              </FormControl>
              <FormControl border={0}>
                <FormLabel fontSize={"24px"}>Unit Kerja</FormLabel>
                <Select2
                  options={dataSeed?.unitKerja?.map((val) => ({
                    value: val.id,
                    label: `${val.unitKerja}`,
                  }))}
                  placeholder="Contoh: Laboratorium kesehatan daerah"
                  focusBorderColor="red"
                  onChange={(selectedOption) => {
                    setUnitKerjaFilterId(selectedOption.value);
                  }}
                  components={{
                    DropdownIndicator: () => null, // Hilangkan tombol panah
                    IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
                  }}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: "6px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "terang",
                      border: "0px",
                      height: "60px",
                      _hover: {
                        borderColor: "yellow.700",
                      },
                      minHeight: "40px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      bg: state.isFocused ? "primary" : "white",
                      color: state.isFocused ? "white" : "black",
                    }),
                  }}
                />
              </FormControl>{" "}
              <FormControl>
                <FormLabel fontSize={"24px"}>Awal</FormLabel>
                <Input
                  minWidth={"200px"}
                  bgColor={"terang"}
                  height={"60px"}
                  type="date"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={"24px"}> Akhir</FormLabel>
                <Input
                  type="date"
                  minWidth={"200px"}
                  bgColor={"terang"}
                  height={"60px"}
                  value={tanggalAkhir}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                />
              </FormControl>
            </Flex>
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>Kendaraan</Th>
                  <Th>Nomor Plat</Th>
                  <Th>Perjalanan</Th>
                  <Th>Personil</Th>
                  <Th>Tujuan</Th>
                  <Th>Tanggal</Th>
                  <Th>Bukti</Th>
                  <Th>Status</Th>
                  <Th>Jarak</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {DataKendaraanDinas?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>
                      <Image
                        borderRadius={"5px"}
                        alt="foto kendaraan"
                        width="80px"
                        height="100px"
                        overflow="hiden"
                        objectFit="cover"
                        src={
                          item?.kendaraan?.foto
                            ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                              item?.kendaraan?.foto
                            : Foto
                        }
                      />
                    </Td>
                    <Td>{`KT ${item?.kendaraan?.nomor} ${
                      item?.kendaraan?.seri || ""
                    }`}</Td>
                    <Td>
                      <Box>
                        <Text fontSize="14px" fontWeight="bold" color="primary">
                          Total: {item?.perjalanans?.length || 0} perjalanan
                        </Text>
                        {item?.perjalanans?.map((perjalanan, idx) => (
                          <Box key={perjalanan.id} mb={2}>
                            <Text fontSize="12px">
                              Perjalanan {idx + 1}: ID {perjalanan.id}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    </Td>
                    <Td>
                      <Box>
                        {item?.perjalanans?.map((perjalanan, idx) => (
                          <Box key={perjalanan.id} mb={2}>
                            {perjalanan?.personils?.map((personil, pIdx) => (
                              <Text key={personil.id} fontSize="12px">
                                {personil?.pegawai?.nama || "N/A"}
                              </Text>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    </Td>
                    <Td>
                      <Box>
                        {item?.perjalanans?.map((perjalanan, idx) => (
                          <Box key={perjalanan.id} mb={2}>
                            {perjalanan?.tempats?.map((tempat, tIdx) => (
                              <Box key={tIdx}>
                                <Text fontSize="12px" fontWeight="bold">
                                  {tempat?.tempat || "N/A"}
                                </Text>
                                {tempat?.dalamKota && (
                                  <Text fontSize="10px" color="gray.600">
                                    {tempat.dalamKota.nama}
                                  </Text>
                                )}
                              </Box>
                            ))}
                          </Box>
                        ))}
                      </Box>
                    </Td>
                    <Td>
                      <Box>
                        {item?.perjalanans && item?.perjalanans.length > 0 && (
                          <>
                            <Text fontSize="12px" fontWeight="bold">
                              Berangkat:{" "}
                              {(() => {
                                const firstPerjalanan = item.perjalanans?.[0];
                                const firstTempat =
                                  firstPerjalanan?.tempats?.[0];
                                const tanggalBerangkat =
                                  firstTempat?.tanggalBerangkat;

                                if (!tanggalBerangkat) return "-";

                                const date = new Date(tanggalBerangkat);

                                const optionsDate = {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                };

                                const optionsTime = {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                };

                                const tanggalFormatted =
                                  date.toLocaleDateString("id-ID", optionsDate);
                                const jamFormatted = date.toLocaleTimeString(
                                  "id-ID",
                                  optionsTime
                                );

                                return `${tanggalFormatted} pukul ${jamFormatted} WITA`;
                              })()}
                            </Text>

                            <Text fontSize="12px" fontWeight="bold">
                              Pulang:{" "}
                              {(() => {
                                const lastPerjalanan =
                                  item.perjalanans?.[
                                    item.perjalanans.length - 1
                                  ];
                                const lastTempat =
                                  lastPerjalanan?.tempats?.[
                                    lastPerjalanan.tempats.length - 1
                                  ];
                                const tanggalPulang = lastTempat?.tanggalPulang;

                                if (!tanggalPulang) return "-";

                                const date = new Date(tanggalPulang);

                                const optionsDate = {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                };

                                const optionsTime = {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                };

                                const tanggalFormatted =
                                  date.toLocaleDateString("id-ID", optionsDate);
                                const jamFormatted = date.toLocaleTimeString(
                                  "id-ID",
                                  optionsTime
                                );

                                return `${tanggalFormatted}, Pukul ${jamFormatted} WITA`;
                              })()}
                            </Text>

                            {item.perjalanans.length > 1 && (
                              <Text fontSize="10px" color="gray.500" mt={1}>
                                Detail per perjalanan:
                              </Text>
                            )}
                            {item.perjalanans.map((perjalanan, idx) => (
                              <Box key={perjalanan.id} mb={1}>
                                <Text fontSize="10px" color="gray.500">
                                  Perjalanan {idx + 1}:{" "}
                                  {new Date(
                                    perjalanan?.tanggalBerangkat
                                  ).toLocaleDateString("id-ID")}{" "}
                                  -{" "}
                                  {new Date(
                                    perjalanan?.tanggalPulang
                                  ).toLocaleDateString("id-ID")}
                                </Text>
                              </Box>
                            ))}
                          </>
                        )}
                      </Box>
                    </Td>
                    <Td>
                      <Flex gap={2} direction="column">
                        <Text fontSize="12px" fontWeight="bold" color="primary">
                          KM Akhir:
                        </Text>
                        <Image
                          borderRadius={"5px"}
                          alt="foto km akhir"
                          width="80px"
                          height="60px"
                          overflow="hiden"
                          objectFit="cover"
                          src={
                            item?.kmAkhir
                              ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                                item?.kmAkhir
                              : Foto
                          }
                        />
                        <Text fontSize="12px" fontWeight="bold" color="primary">
                          Kondisi Akhir:
                        </Text>
                        <Image
                          borderRadius={"5px"}
                          alt="foto kondisi akhir"
                          width="80px"
                          height="60px"
                          overflow="hiden"
                          objectFit="cover"
                          src={
                            item?.kondisiAkhir
                              ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                                item?.kondisiAkhir
                              : Foto
                          }
                        />
                      </Flex>
                    </Td>
                    <Td>
                      <Text
                        fontSize="12px"
                        fontWeight="bold"
                        color={
                          item?.status === "dipinjam" ? "red.500" : "green.500"
                        }
                      >
                        {item?.status || "N/A"}
                      </Text>
                    </Td>
                    <Td>{`${item?.jarak} Km` || "N/A"}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          onClick={() =>
                            history.push(
                              `/perjalanan/detail-kendaraan-dinas/${item?.kendaraan?.id}`
                            )
                          }
                          size="sm"
                          variant="outline"
                        >
                          Detail
                        </Button>
                        {item?.status === "dipinjam" && (
                          <Button
                            onClick={() =>
                              openDeleteModal(
                                item?.id,
                                item?.perjalanans?.[0]?.id
                              )
                            }
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<BsTrash />}
                          >
                            Hapus
                          </Button>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                boxSizing: "border-box",
                width: "100%",
                height: "100%",
              }}
            >
              <ReactPaginate
                previousLabel={"+"}
                nextLabel={"-"}
                pageCount={pages}
                onPageChange={changePage}
                activeClassName={"item active "}
                breakClassName={"item break-me "}
                breakLabel={"..."}
                containerClassName={"pagination"}
                disabledClassName={"disabled-page"}
                marginPagesDisplayed={1}
                nextClassName={"item next "}
                pageClassName={"item pagination-page "}
                pageRangeDisplayed={2}
                previousClassName={"item previous"}
              />
            </div>
          </Box>
        </Box>

        {/* Modal Konfirmasi Hapus */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Konfirmasi Hapus</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Apakah Anda yakin ingin menghapus data kendaraan dinas ini?
                Tindakan ini tidak dapat dibatalkan.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteClose}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteKendaraan}
                leftIcon={<BsTrash />}
              >
                Hapus
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default DaftarKendaraanDinas;
