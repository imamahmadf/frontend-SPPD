import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
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
  Th,
  Td,
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";
import DataKosong from "../Componets/DataKosong";
function Daftar() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [selectedPerjalanan, setSelectedPerjalanan] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const postNotaDinas = (val) => {
    console.log(val);
    setIsLoading(true);

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/daftar/nota-dinas`,
        {
          indukUnitKerjaId: user[0]?.unitKerja_profile.indukUnitKerja.id,
          pegawai: val.personils,
          dataTtdSurTug: val.ttdSuratTuga,
          dataTtdNotaDinas: val.ttdNotaDina,

          tanggalPengajuan: val.tanggalPengajuan,
          noSurTug: val.noSuratTugas,
          noNotDis: val.noNotaDinas,

          subKegiatan: val.daftarSubKegiatan.subKegiatan,
          untuk: val.untuk,
          dasar: val.dasar,
          asal: val.asal,
          kodeRekeningFE: `${val.daftarSubKegiatan.kodeRekening}${val.jenisPerjalanan.kodeRekening}`,
          tempat: val.tempats,
          // sumber: dataKegiatan.value.sumber,
          jenis: val.jenisPerjalanan.id,
          jenisPerjalanan: val.jenisPerjalanan.jenis,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        console.log(res.data); // Log respons dari backend

        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "nota_dinas.docx"); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Tampilkan toast sukses
        toast({
          title: "Berhasil",
          description: "File nota dinas berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        // Redirect setelah download selesai
        history.push(`/daftar`);
      })
      .catch((err) => {
        console.error(err); // Tangani error
        setIsLoading(false);

        // Tampilkan toast error
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat mengunduh file",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });
  };
  const hapusPerjalanan = (e) => {
    console.log(e);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perjalanan/delete/${e}`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        fetchDataPerjalanan();
        onClose();
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const postSuratTugas = (val) => {
    setIsLoading(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/surat-tugas`,
        {
          asal: val.asal,
          jenis: val.jenisPerjalanan.id,
          kode: `${val.daftarSubKegiatan.kodeRekening}.${val.jenisPerjalanan.kodeRekening}`,
          personilFE: val.personils,
          ttdSurTug: val.ttdSuratTuga,
          id: val.id,
          tanggalPengajuan: val.tanggalPengajuan,
          tempat: val.tempats,
          untuk: val.untuk,
          dasar: val.dasar,
          ttdSurTugJabatan: val.ttdSuratTuga.jabatan,
          ttdSurTugNama: val.ttdSuratTuga.pegawai.nama,
          ttdSurTugNip: val.ttdSuratTuga.pegawai.nip,
          ttdSurTugPangkat: val.ttdSuratTuga.pegawai.daftarPangkat.pangkat,
          ttdSurTugGolongan: val.ttdSuratTuga.pegawai.daftarGolongan.golongan,
          ttdSurTugUnitKerja: val.ttdSuratTuga.indukUnitKerjaId,
          ttdSurtTugKode:
            val.ttdSuratTuga.indukUnitKerja_ttdSuratTugas.kodeInduk,
          KPANama: val.KPA.pegawai_KPA.nama,
          KPANip: val.KPA.pegawai_KPA.nip,
          KPAPangkat: val.KPA.pegawai_KPA.daftarPangkat.pangkat,
          KPAGolongan: val.KPA.pegawai_KPA.daftarGolongan.golongan,
          KPAJabatan: val.KPA.jabatan,
          noNotaDinas: val.suratKeluar.nomor,
          noSuratTugas: val.noSuratTugas,
          unitKerja: user[0]?.unitKerja_profile,
          indukUnitKerjaFE: user[0]?.unitKerja_profile,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Surat_Tugas_${user[0]?.unitKerja_profile?.kode}_${Date.now()}.docx`
        ); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();
        fetchDataPerjalanan();

        toast({
          title: "Berhasil",
          description: "File surat tugas berhasil diunduh",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err); // Tangani error
        toast({
          title: "Gagal",
          description: "Gagal mengunduh file surat tugas",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/all-perjalanan?&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id
        }&tanggalBerangkat=${tanggalAwal}&tanggalPulang=${tanggalAkhir}`
      )
      .then((res) => {
        setDataPerjalanan(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page, tanggalAkhir, tanggalAwal]);
  return (
    <>
      {isLoading && <Loading />}
      <Layout>
        {dataPerjalanan[0] ? (
          <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
            <Box
              style={{ overflowX: "auto" }}
              bgColor={"white"}
              p={"30px"}
              borderRadius={"5px"}
              bg={colorMode === "dark" ? "gray.800" : "white"}
            >
              <Flex gap={4} mb={4}>
                <FormControl>
                  <FormLabel>Tanggal Berangkat (Awal)</FormLabel>
                  <Input
                    type="date"
                    value={tanggalAwal}
                    onChange={(e) => setTanggalAwal(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tanggal Pulang (Akhir)</FormLabel>
                  <Input
                    type="date"
                    value={tanggalAkhir}
                    onChange={(e) => setTanggalAkhir(e.target.value)}
                  />
                </FormControl>
              </Flex>
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th>no.</Th>
                    <Th maxWidth={"20px"}>jenis Perjalanan</Th>

                    <Th>Unit Kerja Surat Tugas</Th>
                    <Th>No Surat Tugas</Th>
                    <Th>No Nota Dinas</Th>
                    <Th>No Telaahan Staf</Th>
                    <Th>Tanggal Berangkat</Th>
                    <Th>tanggal Pulang</Th>
                    <Th>Tujuan</Th>
                    <Th>Personil 1</Th>
                    <Th>Personil 2</Th>
                    <Th>Personil 3</Th>
                    <Th>Personil 4</Th>
                    <Th>Personil 5</Th>

                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataPerjalanan?.map((item, index) => (
                    <Tr key={item.id}>
                      <Td maxWidth={"20px"}>{index + 1}</Td>
                      <Td>{item.jenisPerjalanan.jenis}</Td>
                      <Td>
                        {
                          item.ttdSuratTuga.indukUnitKerja_ttdSuratTugas
                            .kodeInduk
                        }
                      </Td>
                      <Td>{item.noSuratTugas ? item.noSuratTugas : "-"}</Td>
                      <Td>
                        {/* Kolom 1: jika nomor ada dan isNotaDinas 1 atau null */}
                        {item.suratKeluar.nomor &&
                        (item.isNotaDinas === 1 || item.isNotaDinas == null)
                          ? item.suratKeluar.nomor
                          : "-"}
                      </Td>
                      <Td>
                        {/* Kolom 2: jika nomor ada dan isNotaDinas === 0 */}
                        {item.suratKeluar.nomor && item.isNotaDinas === 0
                          ? item.suratKeluar.nomor
                          : "-"}
                      </Td>
                      <Td>
                        {item.tempats?.[0]?.tanggalBerangkat
                          ? new Date(
                              item.tempats[0].tanggalBerangkat
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </Td>
                      <Td>
                        {item.tempats?.[item.tempats.length - 1]?.tanggalPulang
                          ? new Date(
                              item.tempats[
                                item.tempats.length - 1
                              ].tanggalPulang
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </Td>
                      <Td>
                        {item.jenisPerjalanan.tipePerjalanan.id === 1
                          ? item.tempats.map((val) => (
                              <Text key={val.id}>{val.dalamKota.nama}</Text>
                            ))
                          : item.tempats.map((val) => (
                              <Text key={val.id}>{val.tempat}</Text>
                            ))}
                      </Td>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Td key={i}>
                          <Tooltip
                            label={item.personils?.[i]?.status?.statusKuitansi}
                            aria-label="A tooltip"
                            bgColor={
                              item.personils?.[i]?.statusId === 1
                                ? "gelap"
                                : item.personils?.[i]?.statusId === 2
                                ? "ungu"
                                : item.personils?.[i]?.statusId === 3
                                ? "primary"
                                : item.personils?.[i]?.statusId === 4
                                ? "danger"
                                : null
                            }
                          >
                            <Flex>
                              <Center
                                borderRadius={"2px"}
                                width={"5px"}
                                maxH={"20px"}
                                me={"3px"}
                                bgColor={
                                  item.personils?.[i]?.statusId === 1
                                    ? "gelap"
                                    : item.personils?.[i]?.statusId === 2
                                    ? "ungu"
                                    : item.personils?.[i]?.statusId === 3
                                    ? "primary"
                                    : item.personils?.[i]?.statusId === 4
                                    ? "danger"
                                    : null
                                }
                              ></Center>
                              <Text>
                                {item.personils?.[i]?.pegawai?.nama || "-"}
                              </Text>
                            </Flex>
                          </Tooltip>
                        </Td>
                      ))}
                      <Td>
                        <Flex gap={"10px"}>
                          {item.noSuratTugas && (
                            <Button
                              variant={"primary"}
                              w="30px"
                              h="30px"
                              p="0"
                              fontSize="12px"
                              onClick={() =>
                                history.push(`/detail-perjalanan/${item.id}`)
                              }
                            >
                              <BsEyeFill />
                            </Button>
                          )}

                          <Tooltip
                            label={"cetak Surat Tugas"}
                            aria-label="A tooltip"
                            bgColor={"primary"}
                          >
                            <Button
                              variant={"secondary"}
                              p={"0px"}
                              fontSize={"10px"}
                              height={"30px"}
                              width={"30px"}
                              onClick={() => postSuratTugas(item)}
                            >
                              <BsFileEarmarkArrowDown />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            label={"cetak Nota Dinas"}
                            aria-label="A tooltip"
                            bgColor={"primary"}
                          >
                            <Button
                              variant={"secondary"}
                              p={"0px"}
                              fontSize={"10px"}
                              height={"30px"}
                              width={"30px"}
                              onClick={() => postNotaDinas(item)}
                            >
                              <BsFileEarmarkArrowDown />
                            </Button>
                          </Tooltip>
                          {!item.personils?.some(
                            (p) => p?.statusId === 2 || p?.statusId === 3
                          ) && (
                            <Button
                              variant={"cancle"}
                              p={"0px"}
                              fontSize={"10px"}
                              height={"30px"}
                              width={"30px"}
                              onClick={() => {
                                setSelectedPerjalanan(item.id);
                                onOpen();
                              }}
                            >
                              X
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
              </div>{" "}
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Konfirmasi Hapus</ModalHeader>
                  <ModalCloseButton />

                  <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="red"
                      mr={3}
                      onClick={() => hapusPerjalanan(selectedPerjalanan)}
                    >
                      Ya, Hapus
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Batal
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </Box>
        ) : (
          <DataKosong />
        )}
      </Layout>
    </>
  );
}

export default Daftar;
