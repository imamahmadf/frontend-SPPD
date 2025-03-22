import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import { Link, useHistory } from "react-router-dom";
import Rill from "../Componets/Rill";
import { useDisclosure } from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
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
  Input,
  Spacer,
} from "@chakra-ui/react";
function Rampung(props) {
  const [dataRampung, setDataRampung] = useState([]);
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [satuan, setSatuan] = useState("");
  const [qty, setQty] = useState(0);
  const [nilai, setNilai] = useState(0);
  const [jenisRampung, setJenisRampung] = useState(0);
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [itemToDelete, setItemToDelete] = useState(null);
  // Menambahkan totalDuras
  const totalDurasi = dataRampung?.result?.perjalanan?.tempats?.reduce(
    (total, tempat) => total + tempat.dalamKota.durasi, // Asumsi durasi ada di dalamKota
    0 // nilai awal
  );
  const buatOtomatis = () => {
    const maxTransport = dataRampung?.result?.perjalanan?.tempats?.reduce(
      (max, tempat) =>
        tempat.dalamKota.uangTransport > max.dalamKota.uangTransport
          ? tempat
          : max,
      dataRampung.result.perjalanan.tempats[0] // nilai awal
    );

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/kwitansi-otomatis`,
        {
          personilId: dataRampung.result.id,
          nomorSPD: dataRampung.result.nomorSPD,
          tanggalPengajuan: dataRampung.result.tanggalPengajuan,
          pegawaiNama: dataRampung.result.pegawai.nama,
          pegawaiNip: dataRampung.result.pegawai.nip,
          pegawaiJabatan: dataRampung.result.pegawai.jabatan,
          untuk: dataRampung.result.perjalanan.untuk,
          PPTKNama:
            dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.PPTK.nama,
          PPTKNip:
            dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.PPTK.nip,
          subKegiatan:
            dataRampung.result.perjalanan.daftarSubKegiatan.subKegiatan,
          kodeRekening: `${dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.kodeRekening}${dataRampung.result.perjalanan.daftarSubKegiatan.kodeRekening}`,
          uangHarian: 170000,
          uangTransport: maxTransport.dalamKota.uangTransport,
          tempatNama: maxTransport.dalamKota.nama,
          asal: dataRampung.result.perjalanan.asal,
          totalDurasi,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const cetak = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/cetak-kwitansi`,
        {
          id: dataRampung.result.id,
          nomorSPD: dataRampung.result.nomorSPD,
          pegawaiNama: dataRampung.result.pegawai.nama,
          pegawaiNip: dataRampung.result.pegawai.nip,
          pegawaiJabatan: dataRampung.result.pegawai.jabatan,
          untuk: dataRampung.result.perjalanan.untuk,
          PPTKNama:
            dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.PPTK.nama,
          PPTKNip:
            dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.PPTK.nip,
          subKegiatan:
            dataRampung.result.perjalanan.daftarSubKegiatan.subKegiatan,
          kodeRekening: `${dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.kodeRekening}${dataRampung.result.perjalanan.daftarSubKegiatan.kodeRekening}`,
          rincianBPD: dataRampung.result.rincianBPDs,
          tanggalPengajuan: dataRampung.result.perjalanan.tanggalPengajuan,
          totalDurasi,
          jenis: dataRampung.result.perjalanan.jenisPerjalanan.id,
          tempat: dataRampung.result.perjalanan.tempats,
          jenisPerjalanan: dataRampung.result.perjalanan.jenisPerjalanan.jenis,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "letter.docx"); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleEdit = (item) => {
    setEditMode(item.id);
    setEditedData({
      ...item,
    });
  };

  const handleChange = (e, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = (id) => {
    console.log(editedData);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/update/rincian-bpd`,
        editedData
      )
      .then((res) => {
        setEditMode(null);
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  async function fetchDataRampung() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kwitansi/get/rampung/${
          props.match.params.id
        }`
      )
      .then((res) => {
        console.log(res.data);
        setDataRampung(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function hapusBPD(val) {
    console.log(val);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/delete/rincian-bpd`,
        {
          id: val.id,
        }
      )
      .then((res) => {
        console.log(res.data);
        onDeleteClose();
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const submitRampung = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kwitansi/post/rampung`,
        {
          item: namaKegiatan,
          qty,
          satuan,
          jenisId: jenisRampung.value,
          nilai,
          personilId: dataRampung.result.id,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchDataRampung();
  }, []);

  // Kelompokkan rincianBPDs berdasarkan jenis
  const groupedData =
    dataRampung.result?.rincianBPDs?.reduce((acc, item) => {
      const jenis = item.jenisRincianBPD?.jenis;
      if (!acc[jenis]) {
        acc[jenis] = [];
      }
      acc[jenis].push(item);
      return acc;
    }, {}) || {};

  return (
    <Layout>
      <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"} pb={"40px"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
          {JSON.stringify(dataRampung?.result?.rincianBPDs.length)}
          {dataRampung?.result?.perjalanan?.jenisPerjalanan.id === 2 &&
          dataRampung?.result?.rincianBPDs.length == 0 ? (
            <Button onClick={buatOtomatis}>buat otomatis</Button>
          ) : null}
          <Rill
            data={dataRampung?.daftarRill}
            personilId={dataRampung?.result?.id}
          />
          <Box>
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              me="5px"
              maxWidth={"400px"}
            >
              {" "}
              <Text ms="18px">nama kegiatan</Text>
              <Input
                placeholder="nama Kegiatan"
                size="md"
                type="text"
                border={"none"}
                onChange={(e) => setNamaKegiatan(e.target.value)}
              />
            </FormControl>
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              me="5px"
              maxWidth={"400px"}
            >
              {" "}
              <Text ms="18px">satuan</Text>
              <Input
                placeholder="satuan"
                size="md"
                type="text"
                border={"none"}
                onChange={(e) => setSatuan(e.target.value)}
              />
            </FormControl>
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              me="5px"
              maxWidth={"400px"}
            >
              {" "}
              <Text ms="18px">Jumlah</Text>
              <Input
                placeholder="Jumlah"
                size="md"
                type="number"
                border={"none"}
                onChange={(e) => setQty(e.target.value)}
              />
            </FormControl>{" "}
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              me="5px"
              maxWidth={"400px"}
            >
              {" "}
              <Text ms="18px">Nilai</Text>
              <Input
                placeholder="Nilai"
                size="md"
                type="number"
                border={"none"}
                onChange={(e) => setNilai(e.target.value)}
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataRampung.jenisRampung?.map((val) => {
                  return {
                    value: val.id,
                    label: `${val.jenis}`,
                  };
                })}
                placeholder="Jenis Rampung"
                focusBorderColor="red"
                closeMenuOnSelect={false}
                onChange={(selectedOption) => {
                  setJenisRampung(selectedOption);
                }}
              />
            </FormControl>
            <Button onClick={submitRampung}>submit</Button>
            <Button onClick={cetak}>CETAK</Button>
          </Box>
          {/* Tabel untuk merender rincianBPD */}
          {Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData).map((jenis) => (
              <Box key={jenis} mt={4}>
                <Text fontWeight="bold" fontSize="lg">
                  {jenis}
                </Text>
                <Table variant="simple" mt={2}>
                  <Thead>
                    <Tr>
                      <Th>item</Th>
                      <Th>Nilai</Th>
                      <Th>Qty</Th>
                      <Th>Satuan</Th>
                      <Th>Aksi</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {groupedData[jenis].map((item) => (
                      <Tr key={item.id}>
                        <Td>
                          {editMode === item.id ? (
                            <Input
                              value={editedData.item}
                              onChange={(e) => handleChange(e, "item")}
                            />
                          ) : (
                            item.item
                          )}
                        </Td>
                        <Td>
                          {editMode === item.id ? (
                            <Input
                              type="number"
                              value={editedData.nilai}
                              onChange={(e) => handleChange(e, "nilai")}
                            />
                          ) : (
                            item.nilai
                          )}
                        </Td>
                        <Td>
                          {editMode === item.id ? (
                            <Input
                              type="number"
                              value={editedData.qty}
                              onChange={(e) => handleChange(e, "qty")}
                            />
                          ) : (
                            item.qty
                          )}
                        </Td>
                        <Td>
                          {editMode === item.id ? (
                            <Input
                              value={editedData.satuan}
                              onChange={(e) => handleChange(e, "satuan")}
                            />
                          ) : (
                            item.satuan
                          )}
                        </Td>
                        <Td>
                          {editMode === item.id ? (
                            <HStack>
                              <Button
                                colorScheme="green"
                                onClick={() => handleSave(item.id)}
                              >
                                Save
                              </Button>
                              <Button
                                colorScheme="gray"
                                onClick={() => setEditMode(null)}
                              >
                                Cancel
                              </Button>
                            </HStack>
                          ) : (
                            <HStack>
                              <Button
                                colorScheme="blue"
                                onClick={() => handleEdit(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() => {
                                  setItemToDelete(item);
                                  onDeleteOpen();
                                }}
                              >
                                Delete
                              </Button>
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ))
          ) : (
            <Text>Tidak ada data untuk ditampilkan.</Text>
          )}
        </Container>
      </Box>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="900px">
          <ModalHeader>Rill </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Button
              onClick={() => {
                hapusBPD(itemToDelete);
              }}
              colorScheme="red"
            >
              Hapus
            </Button>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default Rampung;
