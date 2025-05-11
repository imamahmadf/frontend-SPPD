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
  const [selectedRills, setSelectedRills] = useState([]);
  const [isRillsModalOpen, setIsRillsModalOpen] = useState(false);

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

  const handleRills = (rills) => {
    setSelectedRills(rills);
    setIsRillsModalOpen(true);
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
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
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
              <Text>Dasar: {detailPerjalanan.dasar || "-"}</Text>
              <Text>Nota Dinas: {detailPerjalanan.noNotaDinas}</Text>
              <Text>Surat Tugas: {detailPerjalanan.noSuratTugas}</Text>
              <Text>
                Tanggal Pengajuan: {detailPerjalanan.tanggalPengajuan}
              </Text>
              <Text>
                Sumber Dana: {detailPerjalanan.bendahara?.sumberDana?.sumber}
              </Text>
              {/* <Text>{`${detailPerjalanan?.tempats[0]?.dalamKota?.nama}, ${detailPerjalanan?.tempats[1]?.dalamKota?.nama}`}</Text> */}

              <Text>
                Untuk Pembayaran:{" "}
                {`Belanja ${detailPerjalanan?.jenisPerjalanan?.jenis} dalam rangka untuk ${detailPerjalanan?.untuk} ke, sub kegiatan ${detailPerjalanan?.daftarSubKegiatan?.subKegiatan}, tahun anggaran `}
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
              <Text fontWeight="bold">{item?.pegawai.nama}</Text>
              <Text>Nomor SPD: {item?.nomorSPD}</Text>
              <Text>Status : {item.status.statusKuitansi}</Text>
              <Text>Catatan : {item.catatan}</Text>
              <Table variant="simple" mt={2}>
                <Thead bgColor={"primary"}>
                  <Tr>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Jenis
                    </Th>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Item
                    </Th>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Nilai
                    </Th>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Qty
                    </Th>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Satuan
                    </Th>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Bukti
                    </Th>
                    <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody bgColor={"secondary"}>
                  {item.rincianBPDs.map((val, idx) => (
                    <Tr key={idx}>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {val.jenisRincianBPD.jenis}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {val.item}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(val.nilai)}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {val.qty}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {val.satuan}
                      </Td>
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
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
                      <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                        {val.rills.length > 0 && (
                          <Button onClick={() => handleRills(val.rills)}>
                            Lihat Rills
                          </Button>
                        )}
                      </Td>
                    </Tr>
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

        <Modal
          isOpen={isRillsModalOpen}
          onClose={() => setIsRillsModalOpen(false)}
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Informasi Rills</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Item</Th>
                    <Th>Nilai</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedRills.map((rill, index) => (
                    <Tr key={index}>
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
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={() => setIsRillsModalOpen(false)}
              >
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export default RampungAdmin;
