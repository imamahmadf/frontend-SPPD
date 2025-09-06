import React, { useState, useEffect } from "react";
import axios from "axios";

import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import { BsCartDash } from "react-icons/bs";

import { BsClipboard2Data } from "react-icons/bs";
import { BsLock } from "react-icons/bs";
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
  Checkbox,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import { BsCartPlus } from "react-icons/bs";
function DetailKwitansiGlobal(props) {
  const [dataKwitGlobal, setDataKwitGlobal] = useState([]);
  const history = useHistory();
  const [isPrinting, setIsPrinting] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const [pegawaiId, setPegawaiId] = useState(0);
  const [bendaharaId, setBendaharaId] = useState(null);
  const [KPAId, setKPAId] = useState(null);
  const [jenisPerjalananId, setJenisPerjalananId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [dataBendahara, setDataBendahara] = useState(null);
  const [dataPerjalanan, setDataPerjalanan] = useState(null);
  const [selectedPerjalanan, setSelectedPerjalanan] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Sinkronkan selectedIds dengan selectedPerjalanan
  useEffect(() => {
    const ids = Object.keys(selectedPerjalanan)
      .filter((id) => !!selectedPerjalanan[id])
      .map((id) => Number(id));
    setSelectedIds(ids);
  }, [selectedPerjalanan]);
  const user = useSelector(userRedux);
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  async function fetchKwitansiGlobal() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi-global/get/detail/${props.match.params.id}`
      )
      .then((res) => {
        setDataKwitGlobal(res.data.result);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const fetchAllPerjalanan = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi-global/get/all-perjalanan/${props.match.params.id}`
      )
      .then((res) => {
        setDataPerjalanan(res.data.result);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const tambahPerjalanan = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi-global/post/add-perjalanan`,
        {
          selectedIds,
          id: props.match.params.id,
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil!",
          description: "Pengajuan berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Data Kendaraan Tidak Ditemukan",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const ajukan = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi-global/post/ajukan/${props.match.params.id}`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil!",
          description: "Pengajuan berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchKwitansiGlobal();
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Data Kendaraan Tidak Ditemukan",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const kirimDataTabel = () => {
    const kg = Array.isArray(dataKwitGlobal)
      ? dataKwitGlobal[0]
      : dataKwitGlobal;
    if (!kg) {
      toast({
        title: "Error!",
        description: "Data belum tersedia",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const perjalanans = Array.isArray(kg.perjalanans) ? kg.perjalanans : [];
    const parseNumber = (val) => {
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        const cleaned = val.replace(/[^0-9.-]/g, "");
        const num = Number(cleaned);
        return isNaN(num) ? 0 : num;
      }
      return 0;
    };

    const formatTanggalList = (tempats = []) =>
      tempats
        .map((t) => t?.tanggalBerangkat)
        .filter(Boolean)
        .map((d) => new Date(d))
        .map((d) => (isNaN(d) ? null : d))
        .filter(Boolean)
        .map((d) => d.toLocaleDateString("id-ID"))
        .join(", ");

    const formatTempatList = (tempats = []) =>
      tempats
        .map((t) => {
          const tempatStr = t?.tempat || "";
          if (tempatStr.toLowerCase() === "dalam kota") {
            return t?.dalamKota?.nama || "Dalam Kota";
          }
          return tempatStr;
        })
        .filter(Boolean)
        .join(", ");

    const dataTabel = perjalanans.flatMap((perj) => {
      const personils = Array.isArray(perj.personils) ? perj.personils : [];
      const tanggalStr = formatTanggalList(perj.tempats || []);
      const tempatStr = formatTempatList(perj.tempats || []);

      return personils.map((p, index) => {
        const subtotal = (p.rincianBPDs || []).reduce((acc, r) => {
          const nilai = parseNumber(r?.nilai);
          const qty = r?.qty == null ? 1 : parseNumber(r?.qty);
          return acc + nilai * qty;
        }, 0);

        return {
          no: 1 + index,
          nama: p.pegawai?.nama || "-",
          BPD: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(subtotal),
          subtotal: subtotal, // Simpan nilai numerik untuk perhitungan totalFE
          tujuan: tempatStr || "-",
          tanggal: tanggalStr || "-",
          noSuratTugas: perj.noSuratTugas || "-",
          kegiatan: perj.untuk || "-",
        };
      });
    });

    if (dataTabel.length === 0) {
      toast({
        title: "Error!",
        description: "Tidak ada data untuk dikirim",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    console.log(dataTabel);

    // Hitung totalFE dari semua subtotal dalam dataTabel
    const totalFE = dataTabel.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0);
    setIsPrinting(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi-global/post/cetak`,
        {
          data: dataTabel,
          kwitansiGlobalId: props.match.params.id,
          templateId: dataKwitGlobal[0]?.templateKwitGlobalId,
          subKegiatan: dataKwitGlobal[0]?.subKegiatan,
          KPAFE: dataKwitGlobal[0]?.KPA,
          bendaharaFE: dataKwitGlobal[0]?.bendahara,
          penerima: dataKwitGlobal[0]?.pegawai,
          jenisPerjalananFE: dataKwitGlobal[0]?.jenisPerjalanan,
          totalFE,
          indukUnitKerjaFE:
            user[0]?.unitKerja_profile.indukUnitKerja.indukUnitKerja,
        },
        {
          responseType: "blob", // Penting untuk file binary
          headers: {
            "Content-Type": "application/json",
            Accept:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
        }
      )
      .then((res) => {
        // Buat blob dengan MIME type yang tepat
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `kuitansi_global_${
            props.match.params.id
          }_${new Date().getTime()}.docx`
        );
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);

        toast({
          title: "Berhasil!",
          description: "File berhasil diunduh.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsPrinting(false);
      })
      .catch((err) => {
        console.error("Error mengirim data:", err);
        toast({
          title: "Error!",
          description: "Gagal mengirim data ke API",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsPrinting(false);
      });
  };

  useEffect(() => {
    fetchKwitansiGlobal();
  }, [page]);
  return (
    <>
      <Layout>
        <Box minH={"70vh"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Container
            style={{ overflowX: "auto" }}
            bgColor={"white"}
            maxW={"1280px"}
            p={"30px"}
            borderRadius={"5px"}
            bg={colorMode === "dark" ? "gray.800" : "white"}
          >
            {/* {JSON.stringify(dataKwitGlobal[0]?.perjalanans[0])} */}

            <HStack gap={5} mb={"30px"}>
              {dataKwitGlobal[0]?.status === "diterima" ? (
                <Button
                  onClick={kirimDataTabel}
                  variant={"outline"}
                  px={"30px"}
                  colorScheme="blue"
                  isLoading={isPrinting}
                  loadingText="Mengunduh..."
                  disabled={isPrinting}
                >
                  {isPrinting ? "Mengunduh..." : "Download Word"}
                </Button>
              ) : null}

              {dataKwitGlobal[0]?.status === "dibuat" ? (
                <Button onClick={onDetailOpen} variant={"outline"} px={"30px"}>
                  Detail Kwitansi
                </Button>
              ) : null}

              <Spacer />
            </HStack>
            {(() => {
              const kg = Array.isArray(dataKwitGlobal)
                ? dataKwitGlobal[0]
                : dataKwitGlobal;
              if (!kg) {
                return <Text color="gray.500">Data belum tersedia</Text>;
              }
              const perjalanans = Array.isArray(kg.perjalanans)
                ? kg.perjalanans
                : [];
              const parseNumber = (val) => {
                if (typeof val === "number") return val;
                if (typeof val === "string") {
                  const cleaned = val.replace(/[^0-9.-]/g, "");
                  const num = Number(cleaned);
                  return isNaN(num) ? 0 : num;
                }
                return 0;
              };
              const formatTanggalList = (tempats = []) =>
                tempats
                  .map((t) => t?.tanggalBerangkat)
                  .filter(Boolean)
                  .map((d) => new Date(d))
                  .map((d) => (isNaN(d) ? null : d))
                  .filter(Boolean)
                  .map((d) => d.toLocaleDateString("id-ID"))
                  .join(", ");
              const formatTempatList = (tempats = []) =>
                tempats
                  .map((t) => {
                    const tempatStr = t?.tempat || "";
                    if (tempatStr.toLowerCase() === "dalam kota") {
                      return t?.dalamKota?.nama || "Dalam Kota";
                    }
                    return tempatStr;
                  })
                  .filter(Boolean)
                  .join(", ");
              const rows = perjalanans.flatMap((perj) => {
                const personils = Array.isArray(perj.personils)
                  ? perj.personils
                  : [];
                const tanggalStr = formatTanggalList(perj.tempats || []);
                const tempatStr = formatTempatList(perj.tempats || []);
                return personils.map((p) => {
                  const subtotal = (p.rincianBPDs || []).reduce((acc, r) => {
                    const nilai = parseNumber(r?.nilai);
                    const qty = r?.qty == null ? 1 : parseNumber(r?.qty);
                    return acc + nilai * qty;
                  }, 0);
                  return {
                    noSuratTugas: perj.noSuratTugas || "-",
                    tanggalBerangkat: tanggalStr || "-",
                    tempat: tempatStr || "-",
                    total: subtotal,
                    nama: p.pegawai?.nama || "-",
                  };
                });
              });
              if (rows.length === 0) {
                return <Text color="gray.500">Tidak ada data perjalanan</Text>;
              }
              const totalAll = rows.reduce((a, r) => a + (r.total || 0), 0);
              return (
                <Table variant="primary" size="sm">
                  <Thead>
                    <Tr>
                      <Th>No Surat Tugas</Th> <Th>Nama Pegawai</Th>
                      <Th>Tanggal Berangkat</Th>
                      <Th>Tempat</Th>
                      <Th isNumeric>BPD</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {rows.map((r, idx) => (
                      <Tr key={idx}>
                        <Td>{r.noSuratTugas}</Td> <Td>{r.nama}</Td>
                        <Td>{r.tanggalBerangkat}</Td>
                        <Td>{r.tempat}</Td>
                        <Td isNumeric>Rp {r.total.toLocaleString("id-ID")}</Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td colSpan={4} fontWeight="bold">
                        TOTAL
                      </Td>
                      <Td isNumeric fontWeight="bold">
                        Rp {totalAll.toLocaleString("id-ID")}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              );
            })()}
            {dataKwitGlobal[0]?.status === "dibuat" ? (
              <Button mt={"30px"} variant={"primary"} onClick={ajukan}>
                Ajukan
              </Button>
            ) : null}
          </Container>
        </Box>

        {/* Modal Detail Kwitansi Global */}
        <Modal
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          size="6xl"
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detail Kwitansi Global</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {dataPerjalanan ? (
                <>
                  {Array.isArray(dataPerjalanan) &&
                    dataPerjalanan.length > 0 &&
                    (() => {
                      // Filter perjalanan yang tidak memiliki statusId 1 atau 4
                      const selectablePerjalanan = dataPerjalanan.filter(
                        (perjalanan) => {
                          if (
                            !perjalanan.personils ||
                            perjalanan.personils.length === 0
                          ) {
                            return true; // Jika tidak ada personil, bisa dipilih
                          }

                          const hasRestricted = perjalanan.personils.some(
                            (personil) => {
                              return (
                                personil?.statusId === 1 ||
                                personil?.statusId === 4
                              );
                            }
                          );

                          return !hasRestricted;
                        }
                      );

                      const selectableIds = selectablePerjalanan.map(
                        (p) => p.id
                      );
                      const areAllSelectableSelected =
                        selectableIds.length > 0 &&
                        selectableIds.every((id) => !!selectedPerjalanan[id]);
                      const selectedCount = selectedIds.length;
                      const isIndeterminate =
                        selectedCount > 0 && !areAllSelectableSelected;

                      return (
                        <Checkbox
                          isChecked={areAllSelectableSelected}
                          isIndeterminate={isIndeterminate}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              const next = {};
                              selectableIds.forEach((id) => (next[id] = true));
                              setSelectedPerjalanan(next);
                            } else {
                              setSelectedPerjalanan({});
                            }
                          }}
                          colorScheme="green"
                        >
                          Pilih Semua ({selectableIds.length} dari{" "}
                          {dataPerjalanan.length} perjalanan dapat dipilih)
                        </Checkbox>
                      );
                    })()}{" "}
                  {dataPerjalanan && dataPerjalanan.length > 0 && (
                    <Box mt={8}>
                      <Heading size="lg" mb={6} color="gray.700">
                        Data Perjalanan Dinas
                      </Heading>

                      {dataPerjalanan.map((perjalanan, index) => {
                        // Fungsi untuk mengecek apakah perjalanan memiliki statusId 1 atau 4
                        const hasRestrictedStatus = () => {
                          if (
                            !perjalanan.personils ||
                            perjalanan.personils.length === 0
                          ) {
                            return false;
                          }

                          const hasRestricted = perjalanan.personils.some(
                            (personil) => {
                              return (
                                personil?.statusId === 1 ||
                                personil?.statusId === 4
                              );
                            }
                          );

                          return hasRestricted;
                        };

                        const isRestricted = hasRestrictedStatus();

                        return (
                          <Box
                            key={perjalanan.id}
                            border="1px"
                            borderColor={isRestricted ? "red.200" : "gray.200"}
                            borderRadius="lg"
                            p={6}
                            mb={6}
                            bg={isRestricted ? "red.50" : "gray.50"}
                            opacity={isRestricted ? 0.7 : 1}
                          >
                            <Flex mb={3} align="center" justify="space-between">
                              <Text
                                fontWeight="bold"
                                color={isRestricted ? "red.700" : "gray.700"}
                              >
                                Perjalanan #{perjalanan.id}
                                {isRestricted && (
                                  <Text
                                    as="span"
                                    fontSize="sm"
                                    color="red.500"
                                    ml={2}
                                  >
                                    (Tidak dapat dipilih - memiliki status
                                    kuitansi terbatas)
                                  </Text>
                                )}
                              </Text>
                              <Checkbox
                                isChecked={!!selectedPerjalanan[perjalanan.id]}
                                onChange={(e) =>
                                  setSelectedPerjalanan((prev) => ({
                                    ...prev,
                                    [perjalanan.id]: e.target.checked,
                                  }))
                                }
                                colorScheme="green"
                                isDisabled={isRestricted}
                              >
                                Pilih
                              </Checkbox>
                            </Flex>
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                              mb={4}
                            ></SimpleGrid>

                            {/* Tabel Personil */}
                            {perjalanan.personils &&
                              perjalanan.personils.length > 0 && (
                                <Box mt={4}>
                                  <Table variant="simple" size="sm">
                                    <Thead>
                                      <Tr>
                                        <Th>Asal</Th>
                                        <Th>Tempat</Th>
                                        <Th>Tanggal Berangkat</Th>
                                        <Th>Nama Pegawai</Th>
                                        <Th>Total Rincian BPD</Th>
                                        <Th>Status</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {perjalanan.personils.map((personil) => {
                                        const daftarTempat = (
                                          perjalanan.tempats || []
                                        )
                                          .map((t) => {
                                            const tempatStr = t?.tempat || "";
                                            if (
                                              tempatStr.toLowerCase() ===
                                              "dalam kota"
                                            ) {
                                              return (
                                                t?.dalamKota?.nama ||
                                                "Dalam Kota"
                                              );
                                            }
                                            return tempatStr;
                                          })
                                          .filter(Boolean)
                                          .join(", ");
                                        const daftarTanggal = (
                                          perjalanan.tempats || []
                                        )
                                          .map(
                                            (t) =>
                                              t.tanggalBerangkat || t.tanggal
                                          )
                                          .filter(Boolean)
                                          .map((d) => new Date(d))
                                          .map((d) => (isNaN(d) ? null : d))
                                          .filter(Boolean)
                                          .map((d) =>
                                            d.toLocaleDateString("id-ID")
                                          )
                                          .join(", ");
                                        const parseNumber = (val) => {
                                          if (typeof val === "number")
                                            return val;
                                          if (typeof val === "string") {
                                            const cleaned = val.replace(
                                              /[^0-9.-]/g,
                                              ""
                                            );
                                            const num = Number(cleaned);
                                            return isNaN(num) ? 0 : num;
                                          }
                                          return 0;
                                        };
                                        const totalRincian =
                                          typeof personil.total === "number" &&
                                          !isNaN(personil.total)
                                            ? personil.total
                                            : (
                                                personil.rincianBPDs || []
                                              ).reduce((acc, r) => {
                                                const nilai = parseNumber(
                                                  r?.nilai
                                                );
                                                const qty =
                                                  r?.qty == null
                                                    ? 1
                                                    : parseNumber(r?.qty);
                                                return acc + nilai * qty;
                                              }, 0);

                                        return (
                                          <Tr key={personil.id}>
                                            <Td>{perjalanan.asal}</Td>
                                            <Td>{daftarTempat || "-"}</Td>
                                            <Td>{daftarTanggal || "-"}</Td>
                                            <Td>
                                              {personil.pegawai?.nama || "-"}
                                            </Td>
                                            <Td>
                                              Rp{" "}
                                              {totalRincian.toLocaleString(
                                                "id-ID"
                                              )}
                                            </Td>
                                            <Td>
                                              {personil?.status?.statusKuitansi}
                                            </Td>
                                          </Tr>
                                        );
                                      })}
                                    </Tbody>
                                  </Table>
                                  <Button
                                    onClick={() =>
                                      history.push(
                                        `/detail-perjalanan/${perjalanan.id}`
                                      )
                                    }
                                  >
                                    detail
                                  </Button>
                                </Box>
                              )}

                            {(!perjalanan.personils ||
                              perjalanan.personils.length === 0) && (
                              <Text color="gray.500" fontStyle="italic">
                                Belum ada personil yang ditambahkan
                              </Text>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                  {(!dataPerjalanan || dataPerjalanan.length === 0) && (
                    <Box textAlign="center" py={10}>
                      <Text color="gray.500">Belum ada data perjalanan</Text>
                    </Box>
                  )}
                </>
              ) : (
                <Button onClick={fetchAllPerjalanan}>tes</Button>
              )}
            </ModalBody>
            <ModalFooter>
              {" "}
              <Button
                onClick={tambahPerjalanan}
                variant={"primary"}
                px={"50px"}
              >
                Tambah +
              </Button>
              <Button onClick={onDetailClose}>Tutup</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default DetailKwitansiGlobal;
