import React, { useState, useEffect } from "react";
import axios from "axios";

import LayoutAset from "../../Componets/Aset/LayoutAset";
import TambahFotoKendaraan from "../../Componets/TambahFotoKendaraan";
import {
  Box,
  Text,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Select,
  Flex,
  ModalCloseButton,
  ModalBody,
  Textarea,
  useToast,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Select as Select2, AsyncSelect } from "chakra-react-select";

function formatTanggal(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRupiah(value) {
  if (value === null || value === undefined || value === "") return "-";
  const angka = Number(value);
  if (Number.isNaN(angka)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

function InfoItem({ label, value }) {
  return (
    <Box minW={0}>
      <Text fontSize="13px" color="gray.500" mb="2px">
        {label}
      </Text>
      <Text fontWeight="600" wordBreak="break-word">
        {value === null || value === undefined || value === "" ? "-" : value}
      </Text>
    </Box>
  );
}

function JudulBagian({ children }) {
  return (
    <HStack px={{ base: "16px", md: "24px" }} pt="24px" spacing={3}>
      <Box bgColor="aset" w="6px" h="26px" borderRadius="full" />
      <Heading size="md" color="aset">
        {children}
      </Heading>
    </HStack>
  );
}

function DetailKendaraan(props) {
  const [detailKendaraan, setDetailKendaraan] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [nomorSurat, setNomorSurat] = useState("");
  const [randomNumber, setRandomNumber] = useState(0);
  const [jenisList, setJenisList] = useState([]);
  const [pegawaiId, setPegawaiId] = useState(null);
  const [unitKerjaId, setUnitKerjaId] = useState(null);
  const [tanggal, setTanggal] = useState(new Date());
  const [keterangan, setKeterangan] = useState("");
  const toast = useToast();
  const [seed, setSeed] = useState(null);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isMutasiOpen,
    onOpen: onMutasiOpen,
    onClose: onMutasiClose,
  } = useDisclosure();
  const handleLinkClick = (link) => {
    if (!link) return;
    // Pastikan link dimulai dengan http atau https
    const validLink =
      link.startsWith("http://") || link.startsWith("https://")
        ? link
        : `https://${link}`;
    window.open(validLink, "_blank");
  };
  const fetchDataKendaraan = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/detail/${
          props.match.params.id
        }`
      );
      const result = res.data.result;
      setDetailKendaraan(result);
      setNomorSurat(res.data.resultTemplate[0]?.nomorSurat || "");
    } catch (err) {
      console.error(err);
      setDetailKendaraan(null);
    } finally {
      setMemuat(false);
    }
  };
  const mutasi = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/post/mutasi`,
        {
          keterangan,
          unitKerjaId,
          pegawaiId,
          kendaraanId: props.match.params.id,
          tanggal,
          asalUnitKerjaId: detailKendaraan?.kendaraanUK?.id,
          asalPegawaiId: detailKendaraan?.pegawaiId,
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
        onMutasiClose();
        fetchDataKendaraan();
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
        onMutasiClose();
      });
  };
  const fetchSeed = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/seed`
      );
      const result = res.data;
      setSeed(result);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataKendaraan();
    fetchSeed();
  }, []);

  const editSchema = Yup.object().shape({
    nomor: Yup.string().required("Nomor kendaraan wajib diisi"),
    noKontak: Yup.number().required("Nomor kendaraan wajib diisi"),
    noRangka: Yup.string().required("Nomor rangka wajib diisi"),
    noMesin: Yup.string().required("Nomor mesin wajib diisi"),

    merek: Yup.string().required("Merek wajib diisi"),
    warna: Yup.string().required("warna wajib diisi"),
    tgl_pkb: Yup.date().required("Tanggal PKB wajib diisi"),
    tg_stnk: Yup.date().required("Tanggal STNK wajib diisi"),
    jenisKendaraanId: Yup.string().required("Jenis kendaraan wajib dipilih"),
    statusKendaraanId: Yup.string().required(""),
    kondisiId: Yup.string().required(""),
    nilaiPerolehan: Yup.number().required("Nilai perolehan Wajib diisi"),
    tanggalPerolehan: Yup.date().required("Tanggal Perolehan Wajib disi"),
    nibar: Yup.string().required("nibar wajib diisi"),
    link: Yup.string().required("Link BPKB wajib diisi"),
  });

  const handleSubmitEdit = async (values, actions) => {
    console.log(values);
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/edit/${
          detailKendaraan.id
        }`,
        values
      );
      actions.setSubmitting(false);
      onEditClose();
      fetchDataKendaraan(); // refresh
    } catch (error) {
      console.error("Gagal update data kendaraan", error);
      actions.setSubmitting(false);
    }
  };

  const plat = `KT ${detailKendaraan?.nomor || "-"} ${
    detailKendaraan?.seri || ""
  }`.trim();

  return (
    <LayoutAset>
      <Box pb="60px" px={{ base: "16px", md: "30px" }} pt="20px">
        {memuat ? (
          <Container variant="primary" maxW="1280px" p="40px" borderRadius="8px">
            <Text color="gray.500">Memuat detail kendaraan...</Text>
          </Container>
        ) : !detailKendaraan ? (
          <Container variant="primary" maxW="1280px" p="40px" borderRadius="8px">
            <Heading size="md" color="aset" mb={2}>
              Detail kendaraan tidak ditemukan
            </Heading>
            <Text color="gray.500">
              Data kendaraan tidak dapat ditampilkan. Periksa kembali tautan atau coba muat ulang halaman.
            </Text>
          </Container>
        ) : (
        <Box>
        <Container variant="primary" maxW="1280px" p={{ base: "16px", md: "24px" }} borderRadius="8px">
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={{ base: 5, lg: 8 }}
            align="stretch"
          >
            <Box w={{ base: "100%", lg: "340px" }} flexShrink={0}>
              <TambahFotoKendaraan
                foto={detailKendaraan?.foto}
                id={detailKendaraan?.id}
                randomNumber={setRandomNumber}
                lebar="100%"
                tinggi={{ base: "240px", md: "380px" }}
              />
            </Box>
            <Box flex="1" minW={0}>
              <Flex
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={3}
                mb={5}
              >
                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="600">
                    Detail Kendaraan
                  </Text>
                  <Heading as="h1" size="lg" color="aset" mt={1}>
                    {plat}
                  </Heading>
                </Box>
                <HStack spacing={2} flexWrap="wrap">
                  <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                    {detailKendaraan?.statusKendaraan?.status || "Status belum diisi"}
                  </Badge>
                  <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                    {detailKendaraan?.kondisi?.nama || "Kondisi belum diisi"}
                  </Badge>
                </HStack>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={8} spacingY={4}>
                <InfoItem
                  label="Unit Kerja"
                  value={detailKendaraan?.kendaraanUK?.unitKerja}
                />
                <InfoItem
                  label="Pegawai"
                  value={detailKendaraan?.pegawai?.nama}
                />
                <InfoItem
                  label="Jenis Kendaraan"
                  value={detailKendaraan?.jenisKendaraan?.jenis}
                />
                <InfoItem label="Merek" value={detailKendaraan?.merek} />
                <InfoItem label="Warna" value={detailKendaraan?.warna} />
                <InfoItem label="Nomor Kontak" value={detailKendaraan?.noKontak} />
                <InfoItem label="Nomor Rangka" value={detailKendaraan?.noRangka} />
                <InfoItem label="Nomor Mesin" value={detailKendaraan?.noMesin} />
                <InfoItem
                  label="Tanggal PKB"
                  value={formatTanggal(detailKendaraan?.tgl_pkb)}
                />
                <InfoItem
                  label="Tanggal STNK"
                  value={formatTanggal(detailKendaraan?.tg_stnk)}
                />
                <InfoItem
                  label="Nilai Perolehan"
                  value={formatRupiah(detailKendaraan?.nilaiPerolehan)}
                />
                <InfoItem
                  label="Tanggal Perolehan"
                  value={formatTanggal(detailKendaraan?.tanggalPerolehan)}
                />
                <InfoItem label="NIBAR" value={detailKendaraan?.nibar} />
              </SimpleGrid>
              <Flex mt={6} gap={3} flexWrap="wrap">
                <Button variant="primary" onClick={onEditOpen}>
                  Edit
                </Button>
                <Button variant="primary" onClick={onMutasiOpen}>
                  Mutasi
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleLinkClick(detailKendaraan?.link)}
                >
                  BPKB
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Container>

        <Container
          variant="primary"
          maxW="1280px"
          p="0"
          mt="24px"
          borderRadius="8px"
          overflow="hidden"
        >
          <JudulBagian>Riwayat Surat Pengantar</JudulBagian>
          <Box p={{ base: "16px", md: "24px" }} overflowX="auto">
            <Table variant="aset" minW="720px">
              <Thead>
                <Tr>
                  <Th textTransform="none" letterSpacing="normal">
                    Nomor Surat
                  </Th>
                  <Th textTransform="none" letterSpacing="normal">
                    Tanggal
                  </Th>
                  <Th textTransform="none" letterSpacing="normal">
                    Penandatangan
                  </Th>
                  <Th textTransform="none" letterSpacing="normal">
                    Pembuat Surat
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {detailKendaraan?.suratPengantars?.length ? (
                  detailKendaraan.suratPengantars.map((item, index) => (
                    <Tr key={item.id || index}>
                      <Td>{(nomorSurat || "").replace("NOMOR", item.noLoket)}</Td>
                      <Td>{formatTanggal(item?.updatedAt)}</Td>
                      <Td>{item?.penandatangan?.nama || "-"}</Td>
                      <Td>{item?.user?.nama || "-"}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center" color="gray.500">
                      Belum ada riwayat surat pengantar
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Container>

        <Container
          variant="primary"
          maxW="1280px"
          p="0"
          mt="24px"
          borderRadius="8px"
          overflow="hidden"
        >
          <JudulBagian>Riwayat Mutasi Kendaraan</JudulBagian>
          <Box px={{ base: "16px", md: "24px" }} pb="24px" pt="16px" overflowX="auto">
            <Table variant="aset" minW="960px">
              <Thead>
                <Tr>
                  <Th
                    colSpan={2}
                    textAlign="center"
                    textTransform="none"
                    letterSpacing="normal"
                  >
                    Unit Kerja
                  </Th>
                  <Th
                    colSpan={2}
                    textAlign="center"
                    textTransform="none"
                    letterSpacing="normal"
                  >
                    Pegawai
                  </Th>
                  <Th
                    rowSpan={2}
                    textAlign="center"
                    textTransform="none"
                    letterSpacing="normal"
                  >
                    Tanggal BAST
                  </Th>
                  <Th
                    rowSpan={2}
                    textAlign="center"
                    textTransform="none"
                    letterSpacing="normal"
                  >
                    Keterangan
                  </Th>
                </Tr>
                <Tr>
                  <Th textAlign="center" textTransform="none" letterSpacing="normal">
                    Asal
                  </Th>
                  <Th textAlign="center" textTransform="none" letterSpacing="normal">
                    Tujuan
                  </Th>
                  <Th textAlign="center" textTransform="none" letterSpacing="normal">
                    Asal
                  </Th>
                  <Th textAlign="center" textTransform="none" letterSpacing="normal">
                    Tujuan
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {detailKendaraan?.mutasiKendaraans?.length ? (
                  detailKendaraan.mutasiKendaraans.map((item, index) => (
                    <Tr key={item.id || index}>
                      <Td textAlign="center">
                        {item.unitKerjaAsal?.unitKerja || "-"}
                      </Td>
                      <Td textAlign="center">
                        {item.unitKerjaTujuan?.unitKerja || "-"}
                      </Td>
                      <Td textAlign="center">{item.pegawaiAsal?.nama || "-"}</Td>
                      <Td textAlign="center">{item.pegawaiTujuan?.nama || "-"}</Td>
                      <Td textAlign="center">{formatTanggal(item?.tanggal)}</Td>
                      <Td textAlign="center">{item?.keterangan || "-"}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center" color="gray.500">
                      Belum ada riwayat mutasi
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Container>
        </Box>
        )}

        {/* Modal Edit */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isEditOpen}
          onClose={onEditClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius="8px" maxWidth="800px" mx={4}>
            <ModalHeader>Edit Data Kendaraan</ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={{
                nomor: detailKendaraan?.nomor || "",
                noKontak: detailKendaraan?.noKontak || 0,
                noRangka: detailKendaraan?.noRangka || "",
                noMesin: detailKendaraan?.noMesin || "",
                merek: detailKendaraan?.merek || "",
                warna: detailKendaraan?.warna || "",
                tgl_pkb: detailKendaraan?.tgl_pkb?.split("T")[0] || "",
                tg_stnk: detailKendaraan?.tg_stnk?.split("T")[0] || "",
                jenisKendaraanId:
                  detailKendaraan?.jenisKendaraan?.id?.toString() || "", // Penting: harus string
                statusKendaraanId:
                  detailKendaraan?.statusKendaraan?.id?.toString() || "", // Penting: harus string
                kondisiId: detailKendaraan?.kondisi?.id?.toString() || "", // Penting: harus string

                nilaiPerolehan: detailKendaraan?.nilaiPerolehan,
                tanggalPerolehan:
                  detailKendaraan?.tanggalPerolehan?.split?.("T")[0] || "",
                nibar: detailKendaraan?.nibar,
                link: detailKendaraan?.link,
              }}
              validationSchema={editSchema}
              onSubmit={handleSubmitEdit}
              enableReinitialize
            >
              {(props) => (
                <Form>
                  <ModalBody pb={6} maxH="70vh" overflowY="auto">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Field name="nomor">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.nomor && form.touched.nomor}
                          >
                            <FormLabel>Nomor Kendaraan</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.nomor}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="noRangka">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.noRangka && form.touched.noRangka
                            }
                          >
                            <FormLabel>Nomor Rangka</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.noRangka}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="noMesin">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.noMesin && form.touched.noMesin
                            }
                          >
                            <FormLabel>Nomor Mesin</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.noMesin}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="tgl_pkb">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.tgl_pkb && form.touched.tgl_pkb
                            }
                          >
                            <FormLabel>Tanggal PKB</FormLabel>
                            <Input type="date" {...field} />
                            <FormErrorMessage>
                              {form.errors.tgl_pkb}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="tg_stnk">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.tg_stnk && form.touched.tg_stnk
                            }
                          >
                            <FormLabel>Tanggal STNK</FormLabel>
                            <Input type="date" {...field} />
                            <FormErrorMessage>
                              {form.errors.tg_stnk}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="jenisKendaraanId">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.jenisKendaraanId &&
                              form.touched.jenisKendaraanId
                            }
                          >
                            <FormLabel>Jenis Kendaraan</FormLabel>
                            <Select
                              placeholder="Pilih Jenis Kendaraan"
                              {...field}
                            >
                              {Array.isArray(seed?.jenis) &&
                                seed.jenis.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.jenis}
                                  </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                              {form.errors.jenisKendaraanId}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="merek">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.merek && form.touched.merek}
                          >
                            <FormLabel>Merek</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.merek}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="warna">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.warna && form.touched.warna}
                          >
                            <FormLabel>Warna</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.warna}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="nilaiPerolehan">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.nilaiPerolehan &&
                              form.touched.nilaiPerolehan
                            }
                          >
                            <FormLabel>Nilai Perolehan</FormLabel>
                            <Input type="number" {...field} />
                            <FormErrorMessage>
                              {form.errors.nilaiPerolehan}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="tanggalPerolehan">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.tanggalPerolehan &&
                              form.touched.tanggalPerolehan
                            }
                          >
                            <FormLabel>Tanggal Perolehan</FormLabel>
                            <Input type="date" {...field} />
                            <FormErrorMessage>
                              {form.errors.tanggalPerolehan}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="nibar">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.nibar && form.touched.nibar}
                          >
                            <FormLabel>NIBAR</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.nibar}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="statusKendaraanId">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.statusKendaraanId &&
                              form.touched.statusKendaraanId
                            }
                          >
                            <FormLabel>Status Kendaraan</FormLabel>
                            <Select
                              placeholder="Pilih status Kendaraan"
                              {...field}
                            >
                              {Array.isArray(seed?.status) &&
                                seed.status.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.status}
                                  </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                              {form.errors.statusKendaraanId}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="kondisiId">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.kondisiId && form.touched.kondisiId
                            }
                          >
                            <FormLabel>Kondisi Kendaraan</FormLabel>
                            <Select
                              placeholder="Pilih Kondisi Kendaraan"
                              {...field}
                            >
                              {Array.isArray(seed?.kondisi) &&
                                seed.kondisi.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.nama}
                                  </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                              {form.errors.kondisiId}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>{" "}
                      <Field name="noKontak">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.noKontak && form.touched.noKontak
                            }
                          >
                            <FormLabel>Nomor Kontak</FormLabel>
                            <Input type="number" {...field} />
                            <FormErrorMessage>
                              {form.errors.noKontak}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="link">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.link && form.touched.link}
                          >
                            <FormLabel>Link BPKB</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.link}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </SimpleGrid>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      isLoading={props.isSubmitting} // gunakan ini jika ingin loading state otomatis
                      type="submit" // cukup type submit tanpa onClick
                    >
                      Simpan
                    </Button>
                    <Button onClick={onEditClose}>Batal</Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </Modal>

        <Modal
          closeOnOverlayClick={false}
          isOpen={isMutasiOpen}
          onClose={onMutasiClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius="8px" maxWidth="800px" mx={4}>
            <ModalHeader>Mutasi Kendaraan</ModalHeader>
            <ModalCloseButton />{" "}
            <Box p={"30px"}>
              <FormControl my={"30px"}>
                <FormLabel>Nama Pegawai</FormLabel>
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
                    setPegawaiId(selectedOption.value);
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
              <FormControl my={"30px"} border={0} bgColor={"white"} flex="1">
                <FormLabel>Unit Kerja</FormLabel>
                <Select2
                  options={seed?.unitKerja?.map((val) => ({
                    value: val.id,
                    label: `${val.unitKerja}`,
                  }))}
                  placeholder="Contoh: Laboratorium kesehatan daerah"
                  focusBorderColor="red"
                  onChange={(selectedOption) => {
                    setUnitKerjaId(selectedOption.value);
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
              <FormControl mt={"30px"}>
                <FormLabel>Tanggal BAST</FormLabel>
                <Input
                  bgColor={"terang"}
                  type="date"
                  height={"60px"}
                  onChange={(e) => setTanggal(e.target.value)}
                  placeholder="Contoh: mutasi ke BKAD"
                />
              </FormControl>
              <FormControl mt={"30px"}>
                <FormLabel>Keterangan</FormLabel>
                <Textarea
                  bgColor={"terang"}
                  height={"100px"}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Contoh: mutasi ke BKAD"
                />
              </FormControl>
            </Box>{" "}
            <ModalFooter pe={"30px"} pb={"30px"}>
              <Button onClick={mutasi} variant={"primary"}>
                Mutasi
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </LayoutAset>
  );
}

export default DetailKendaraan;
