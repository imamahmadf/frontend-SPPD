import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useDisclosure } from "@chakra-ui/react";
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Center,
  Td,
  Flex,
  Textarea,
  Input,
  Spacer,
  useToast,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import Loading from "../../Componets/Loading";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../../Redux/Reducers/auth";

function RampungAdmin(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState("");
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [isModalBatalOpen, setIsModalBatalOpen] = useState(false);
  const [alasanBatal, setAlasanBatal] = useState("");
  const [dataTemplate, setDataTemplate] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const user = useSelector(userRedux);
  const [templateId, setTemplateId] = useState(null);

  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );
  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/template/download-undangan`,
        {
          params: { fileName },

          responseType: "blob",
        }
      );

      // Membuat URL untuk file yang akan diunduh
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mengunduh file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const terimaVerifikasi = (personilId) => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/verifikasi/terima`,
        { personilId }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataPerjalanan();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const batalkanVerifikasi = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/verifikasi/tolak`,
        { personilId: selectedItemId, catatan: alasanBatal }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataPerjalanan();
        setIsModalBatalOpen(false);
        setAlasanBatal("");
        setSelectedItemId(null);
      })
      .catch((err) => {
        console.error(err);
      });
    console.log(selectedItemId);
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/get/detail-perjalanan/${props.match.params.id}`
      )
      .then((res) => {
        setDetailPerjalanan(res.data.result);
        setDataTemplate(res.data.template);
        // Set templateId setelah data tersedia
        if (res.data.result?.template?.[0]?.id) {
          setTemplateId(res.data.result.template[0].id);
        } else if (res.data.template?.[0]?.id) {
          setTemplateId(res.data.template[0].id);
        }
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const totalDurasi =
    detailPerjalanan?.tempats?.reduce(
      (total, tempat) => total + (tempat?.dalamKota?.durasi || 0), // Asumsi durasi ada di dalamKota
      0 // nilai awal
    ) || 0;
  const cetak = (val) => {
    // Validasi templateId sebelum mencetak
    if (!templateId) {
      toast({
        title: "Error!",
        description:
          "Template belum dipilih. Silakan pilih template terlebih dahulu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsPrinting(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/cetak-kwitansi`,
        {
          indukUnitKerja:
            user[0]?.unitKerja_profile?.indukUnitKerja?.indukUnitKerja,
          nomorSPD: val?.nomorSPD,
          nomorST: detailPerjalanan?.noSuratTugas,
          pegawaiNama: val?.pegawai?.nama,
          pegawaiNip: val?.pegawai?.nip,
          pegawaiJabatan: val?.pegawai?.jabatan,
          untuk: detailPerjalanan?.untuk,
          PPTKNama: detailPerjalanan?.PPTK?.pegawai_PPTK?.nama,
          PPTKNip: detailPerjalanan?.PPTK?.pegawai_PPTK?.nip,
          KPANama: detailPerjalanan?.KPA?.pegawai_KPA?.nama,
          KPANip: detailPerjalanan?.KPA?.pegawai_KPA?.nip,
          KPAJabatan: detailPerjalanan?.KPA?.jabatan,
          templateId,
          subKegiatan: detailPerjalanan?.daftarSubKegiatan?.subKegiatan,
          kodeRekening: `${
            detailPerjalanan?.daftarSubKegiatan?.kodeRekening || ""
          }${detailPerjalanan?.jenisPerjalanan?.kodeRekening || ""}`,
          rincianBPD: val?.rincianBPDs,
          tanggalPengajuan: detailPerjalanan?.tanggalPengajuan,
          totalDurasi,
          jenis: detailPerjalanan?.jenisId,
          tempat: detailPerjalanan?.tempats,
          jenisPerjalanan: detailPerjalanan?.jenisPerjalanan?.jenis,
          dataBendahara: detailPerjalanan?.bendahara,
          tahun: detailPerjalanan?.tanggalPengajuan
            ? new Date(detailPerjalanan.tanggalPengajuan).getFullYear()
            : new Date().getFullYear(),
          // untukPembayaran:
          //   dataRampung.result.perjalanan.bendahara.sumberDana.untukPembayaran,
        },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `kuitansi_${val?.pegawai?.nama}${props.match.params.id}.docx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast({
          title: "Berhasil!",
          description: "File berhasil diunduh.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal mengunduh file.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsPrinting(false);
      });
  };

  function renderTemplate() {
    return dataTemplate?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, []);

  return (
    <Layout>
      {isPrinting && <Loading />}
      <Box pb={"40px"} px={"30px"}>
        <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
          {/* {JSON.stringify(detailPerjalanan)} */}
          <Flex gap={"30px"} mb={"30px"}>
            <Box>
              <Image
                borderRadius={"5px"}
                alt="foto obat"
                width="620px"
                height="480px"
                overflow="hiden"
                objectFit="cover"
                src={
                  detailPerjalanan?.pic
                    ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                      detailPerjalanan?.pic
                    : Foto
                }
              />
            </Box>
            <Box>
              <Text>Asal: {detailPerjalanan.asal}</Text>
              <Text>Dasar: {detailPerjalanan.dasar || "-"}</Text>{" "}
              <Text>No. Surat Tugas: {detailPerjalanan.noSuratTugas}</Text>
              <Text>
                No. Nota Dinas:{" "}
                {detailPerjalanan.isNotaDinas
                  ? detailPerjalanan.noNotaDinas
                  : "-"}
              </Text>{" "}
              <Text>
                No. Telaahan Staf:{" "}
                {detailPerjalanan.isNotaDinas
                  ? "-"
                  : detailPerjalanan.noNotaDinas}
              </Text>
              <Text>
                Tanggal Pengajuan:
                {new Date(detailPerjalanan.tanggalPengajuan).toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </Text>
              <Text>
                Tanggal Berangkat:{" "}
                {new Date(
                  detailPerjalanan.tempats?.[0]?.tanggalBerangkat
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Text>
                Tanggal Pulang:{" "}
                {new Date(
                  detailPerjalanan.tempats?.[
                    detailPerjalanan.tempats?.length - 1
                  ]?.tanggalPulang
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Text>
                Sumber Dana: {detailPerjalanan?.bendahara?.sumberDana?.sumber}
              </Text>
              <Text>Tujuan: {daftarTempat}</Text>
              <Text>
                Untuk Pembayaran:
                {`Belanja ${detailPerjalanan?.jenisPerjalanan?.jenis} dalam rangka untuk ${detailPerjalanan?.untuk} ke ${daftarTempat}, sub kegiatan ${detailPerjalanan?.daftarSubKegiatan?.subKegiatan} ${detailPerjalanan?.bendahara?.sumberDana?.kalimat1}, tahun anggaran`}
              </Text>
              <Text>
                Kode Rekening:
                {`${detailPerjalanan?.daftarSubKegiatan?.kodeRekening}${detailPerjalanan?.jenisPerjalanan?.kodeRekening}`}
              </Text>
              {detailPerjalanan?.undangan ? (
                <Button
                  variant={"primary"}
                  onClick={() => handleDownload(detailPerjalanan?.undangan)}
                >
                  lihat
                </Button>
              ) : null}
              {/* <Text>
            Personil: {JSON.stringify(detailPerjalanan.personils[0].status)}
          </Text> */}
            </Box>
          </Flex>{" "}
          <FormControl>
            <FormLabel fontSize={"24px"}>Template</FormLabel>
            <Select
              height={"60px"}
              bgColor={"terang"}
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              value={templateId || ""}
              onChange={(e) => {
                setTemplateId(e.target.value);
              }}
            >
              {renderTemplate()}
            </Select>
          </FormControl>
          {detailPerjalanan?.personils?.map((item, index) => (
            <Box
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              key={index}
              mb={"25px"}
              p={"10px"}
            >
              <Flex>
                <Box>
                  <Text fontWeight="bold">{item?.pegawai.nama}</Text>
                  <Text>Nomor SPD: {item?.nomorSPD}</Text>

                  <Text>Catatan : {item.catatan}</Text>
                </Box>
                <Spacer />
                <Center
                  height={"50px"}
                  borderRadius={"3px"}
                  p={"5px"}
                  color={"white"}
                  w={"160px"}
                  bgColor={
                    item.status.id === 1
                      ? "grey"
                      : item.status.id === 2
                      ? "primary"
                      : item.status.id === 3
                      ? "ungu"
                      : item.status.id === 4
                      ? "oren"
                      : item.status.id === 5
                  }
                >
                  <Text> {item.status.statusKuitansi}</Text>
                </Center>
              </Flex>
              <Table variant="primary" mt={2}>
                <Thead>
                  <Tr>
                    <Th>Jenis</Th>
                    <Th>Item</Th>
                    <Th>Nilai</Th>
                    <Th>Qty</Th>
                    <Th>Satuan</Th>
                    <Th>Bukti</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {item.rincianBPDs.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <Tr>
                        <Td>{val.jenisRincianBPD.jenis}</Td>
                        <Td>{val.item}</Td>
                        <Td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(val.nilai)}
                        </Td>
                        <Td>{val.qty}</Td>
                        <Td>{val.satuan}</Td>
                        <Td>
                          <Image
                            borderRadius={"5px"}
                            alt="foto obat"
                            width="120px"
                            height="80px"
                            overflow="hidden"
                            objectFit="cover"
                            src={
                              val.bukti
                                ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                                  val.bukti
                                : Foto
                            }
                            onClick={() => {
                              setSelectedImage(
                                import.meta.env.VITE_REACT_APP_API_BASE_URL +
                                  val.bukti
                              );
                              onOpen();
                            }}
                          />
                        </Td>
                      </Tr>
                      {val.rills.length > 0 && (
                        <Tr>
                          <Td colSpan={7}>
                            <Table size="sm">
                              <Thead bg="secondary">
                                <Tr>
                                  <Th py={"15px"}>Item </Th>
                                  <Th py={"15px"}>Nilai </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {val.rills.map((rill, rillIndex) => (
                                  <Tr key={rillIndex}>
                                    <Td>{rill.item}</Td>
                                    <Td>
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                      }).format(rill.nilai)}
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
              <Flex mt={"20px"} gap={"20px"}>
                {item.statusId === 2 && (
                  <Button
                    variant={"primary"}
                    onClick={() => terimaVerifikasi(item.id)}
                  >
                    Verifikasi
                  </Button>
                )}
                {item.statusId === 2 && (
                  <Button
                    variant={"cancle"}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setIsModalBatalOpen(true);
                    }}
                  >
                    batalkan
                  </Button>
                )}

                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setSelectedData(item);
                    cetak(item);
                  }}
                >
                  Cetak
                </Button>
              </Flex>
            </Box>
          ))}
          {/* {JSON.stringify(detailPerjalanan)} */}
        </Container>

        <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Gambar</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src={selectedImage ? selectedImage : Foto}
                alt="Gambar Besar"
                width="100%"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isModalBatalOpen}
          onClose={() => setIsModalBatalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alasan Pembatalan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={alasanBatal}
                onChange={(e) => setAlasanBatal(e.target.value)}
                placeholder="Masukkan alasan pembatalan"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={() => batalkanVerifikasi(selectedItemId)}
              >
                Batalkan
              </Button>
              <Button onClick={() => setIsModalBatalOpen(false)}>Tutup</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export default RampungAdmin;
