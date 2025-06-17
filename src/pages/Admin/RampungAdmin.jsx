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
} from "@chakra-ui/react";

function RampungAdmin(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [isModalBatalOpen, setIsModalBatalOpen] = useState(false);
  const [alasanBatal, setAlasanBatal] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );

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
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, []);

  return (
    <Layout>
      <Box pb={"40px"} px={"30px"}>
        <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
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
                Sumber Dana: {detailPerjalanan.bendahara?.sumberDana?.sumber}
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
              {/* <Text>
            Personil: {JSON.stringify(detailPerjalanan.personils[0].status)}
          </Text> */}
            </Box>
          </Flex>
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
