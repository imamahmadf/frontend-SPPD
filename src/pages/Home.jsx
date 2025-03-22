import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import Layout from "../Componets/Layout";

function Home() {
  const [dataPegawai, setDataPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState([]);
  const [tanggalPengajuan, setTanggalPengajuan] = useState("");
  // const [inputEndDate, setInputEndDate] = useState("");
  const [dataSeed, setDataSeed] = useState([]);
  const [untuk, setUntuk] = useState("");
  const [asal, setAsal] = useState("");
  const [dataTtdSurTug, setDataTtdSurTug] = useState([]);
  const [dataTtdNotDis, setDataTtdNotDis] = useState([]);
  const [jenisPerjalanan, setJenisPerjalanan] = useState([]);
  const [dataKota, setDataKota] = useState([
    { dataDalamKota: "", tanggalBerangkat: "", tanggalPulang: "" },
  ]);
  const [dataKegiatan, setDataKegiatan] = useState([]);
  const [dataSubKegiatan, setDataSubKegiatan] = useState([]);
  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [tanggalPulang, setTanggalPulang] = useState("");
  const [perjalananKota, setPerjalananKota] = useState([
    { kota: "", tanggalBerangkat: "", tanggalPulang: "" },
  ]);

  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "pengajuan") {
      setTanggalPengajuan(value);
    } else if (field === "berangkat") {
      setTanggalBerangkat(value);
    } else if (field === "pulang") {
      setTanggalPulang(value);
    }
  };

  const submitPerjalanan = () => {
    console.log(
      selectedPegawai,
      tanggalPengajuan,
      dataSeed.resultNomorSurat,
      untuk,
      asal,

      dataTtdNotDis,
      dataTtdSurTug
    );
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/nota-dinas`,
        {
          pegawai: selectedPegawai,
          dataTtdSurTug,
          tanggalPengajuan,
          noSurat: dataSeed?.resultDaftarNomorSurat,
          subKegiatanId: dataSubKegiatan.value.id,
          untuk,
          asal,
          kodeRekeningFE: `${dataKegiatan?.value?.kodeRekening}.${dataSubKegiatan?.value?.kodeRekening}`,
          ttdNotDis: dataKegiatan.value.PPTK,
          perjalananKota,
          sumber: dataKegiatan.value.sumber,
          jenis: jenisPerjalanan.value,
          dalamKota: dataKota,
          tanggalBerangkat,
          tanggalPulang,
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
      })
      .catch((err) => {
        console.error(err); // Tangani error
      });
  };

  async function fetchDataPegawai() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get`)
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataPegawai(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchSeedPerjalanan() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perjalanan/get/seed`)
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataSeed(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  useEffect(() => {
    fetchDataPegawai();
    fetchSeedPerjalanan();
  }, []);

  const handleSelectChange = (selectedOption, pegawaiIndex) => {
    if (selectedOption) {
      const newPegawaiList = [...selectedPegawai];
      newPegawaiList[pegawaiIndex] = selectedOption; // Simpan pegawai yang dipilih
      setSelectedPegawai(newPegawaiList);
    }
    console.log(selectedPegawai);
  };

  const handlePerjalananChange = (index, field, value) => {
    const newPerjalanan = [...perjalananKota];
    newPerjalanan[index][field] = value;
    setPerjalananKota(newPerjalanan);
  };

  const handleDalamKotaChange = (index, field, value) => {
    const newDalamKota = [...dataKota];
    newDalamKota[index][field] = value;
    setDataKota(newDalamKota);
  };

  const addPerjalanan = () => {
    setPerjalananKota([
      ...perjalananKota,
      { kota: "", tanggalBerangkat: "", tanggalPulang: "" },
    ]);
  };

  const addDataKota = () => {
    setDataKota([
      ...dataKota,
      { dataDalamKota: "", tanggalBerangkat: "", tanggalPulang: "" },
    ]);
  };

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
          <HStack w={"100%"} spacing={4}>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataPegawai.result?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, 0);
                }}
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataPegawai.result?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, 1);
                }}
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataPegawai.result?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, 2);
                }}
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataPegawai.result?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, 3);
                }}
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataPegawai.result?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, 4);
                }}
              />
            </FormControl>
          </HStack>{" "}
          <Flex mt={"40px"} gap={4} w={"100%"}>
            <FormControl>
              <FormLabel>Untuk</FormLabel>
              <Textarea
                onChange={(e) => {
                  setUntuk(e.target.value);
                }}
                placeholder="isi dengan tujuan perjalanan dinas"
              />
            </FormControl>
            <Box w={"50%"}>
              <Box>
                <Text>Nomor Surat Tugas:</Text>
                <Text>
                  {dataSeed?.resultDaftarNomorSurat?.length > 0
                    ? dataSeed.resultDaftarNomorSurat[0]?.nomorSurat
                    : "Tidak ada data"}
                </Text>
              </Box>
              <Box>
                <Text>Nomor Nota Dinas:</Text>
                <Text>
                  {dataSeed?.resultDaftarNomorSurat?.length > 0
                    ? dataSeed.resultDaftarNomorSurat[1]?.nomorSurat
                    : "Tidak ada data"}
                </Text>
              </Box>
              <Box>
                <Text>Nomor SPD:</Text>
                <Text>
                  {dataSeed?.resultDaftarNomorSurat?.length > 0
                    ? dataSeed.resultDaftarNomorSurat[2]?.nomorSurat
                    : "Tidak ada data"}
                </Text>
              </Box>
            </Box>
          </Flex>
          <Flex mt={"40px"} gap={4}>
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              me="5px"
              maxWidth={"400px"}
            >
              {" "}
              <Text ms="18px">Tanggal Pengajuan</Text>
              <Input
                placeholder="Select Date and Time"
                defaultValue={tanggalPengajuan}
                size="md"
                type="date"
                border={"none"}
                onChange={(e) => handleChange(e, "pengajuan")}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Asal</FormLabel>
              <Textarea
                onChange={(e) => {
                  setAsal(e.target.value);
                }}
                placeholder="isi dengan alasan perjalanan dinas"
              />
            </FormControl>
          </Flex>
          {selectedPegawai.length > 0 && (
            <>
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Nama</Th>
                    <Th>Pangkat/Golongan</Th>
                    <Th>Tingkatan</Th>
                    <Th>Jabatan</Th>
                    <Th>NIP</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedPegawai.map((pegawai, index) => (
                    <Tr key={index}>
                      <Td>{pegawai.value.id}</Td>
                      <Td>{pegawai.value.nama}</Td>
                      <Td>
                        {pegawai.value.daftarPangkat.pangkat}/
                        {pegawai.value.daftarGolongan.golongan}
                      </Td>
                      <Td> {pegawai.value.daftarTingkatan.tingkatan}</Td>
                      <Td>{pegawai.value.jabatan}</Td>
                      <Td>{pegawai.value.nip}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
          <Box>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataSeed?.resultTtdSuratTugas?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Ttd Surat Tugas"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  setDataTtdSurTug(selectedOption);
                }}
              />
            </FormControl>

            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataSeed?.resultDaftarKegiatan?.map((val) => {
                  return {
                    value: val,
                    label: `${val.kegiatan} - ${val.kodeRekening}`,
                  };
                })}
                placeholder="Cari Kegiatan"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  setDataKegiatan(selectedOption);
                }}
              />
            </FormControl>
            {JSON.stringify(dataKota)}
            {dataKegiatan?.value && (
              <>
                <FormControl border={0} bgColor={"white"} flex="1">
                  <Select2
                    options={dataKegiatan?.value?.subKegiatan.map((val) => {
                      return {
                        value: val,
                        label: `${val.subKegiatan} - ${val.kodeRekening}`,
                      };
                    })}
                    placeholder="Cari Sub Kegiatan"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setDataSubKegiatan(selectedOption);
                    }}
                  />
                </FormControl>
              </>
            )}
            {dataSubKegiatan.value ? (
              <Text>{`Kode Rekening: ${dataKegiatan?.value?.kodeRekening}.${dataSubKegiatan?.value?.kodeRekening}`}</Text>
            ) : null}
          </Box>
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataSeed?.resultJenisPerjalanan?.map((val) => {
                return {
                  value: val,
                  label: `${val.jenis}`,
                };
              })}
              placeholder="Jenis Perjalanan"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                setJenisPerjalanan(selectedOption);
              }}
            />
          </FormControl>
          {jenisPerjalanan?.value?.id === 1 ? (
            <Flex mt={"40px"} gap={4} direction="column">
              {perjalananKota.map((item, index) => (
                <Flex key={index} gap={4}>
                  <FormControl>
                    <FormLabel>Kota</FormLabel>
                    <Input
                      value={item.kota}
                      onChange={(e) =>
                        handlePerjalananChange(index, "kota", e.target.value)
                      }
                      placeholder="Masukkan Kota"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tanggal Berangkat</FormLabel>
                    <Input
                      type="date"
                      defaultValue={item.tanggalBerangkat}
                      onChange={(e) =>
                        handlePerjalananChange(
                          index,
                          "tanggalBerangkat",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tanggal Pulang</FormLabel>
                    <Input
                      type="date"
                      defaultValue={item.tanggalPulang}
                      onChange={(e) =>
                        handlePerjalananChange(
                          index,
                          "tanggalPulang",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                </Flex>
              ))}
              <Button onClick={addPerjalanan}>Tambah Kota</Button>
            </Flex>
          ) : jenisPerjalanan?.value?.id === 2 ? (
            <Box>
              {dataKota.map((item, index) => {
                return (
                  <Flex key={index} gap={4}>
                    <FormControl border={0} bgColor={"white"}>
                      <Select2
                        options={dataSeed?.resultDalamKota?.map((val) => {
                          return {
                            value: { id: val.id, nama: val.nama },
                            label: `${val.nama}`,
                          };
                        })}
                        placeholder="Pilih Tujuan"
                        focusBorderColor="red"
                        value={
                          item.dataDalamKota
                            ? {
                                value: item.dataDalamKota,
                                label: dataSeed.resultDalamKota.find(
                                  (val) => val.id === item.dataDalamKota.id
                                )?.nama,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleDalamKotaChange(
                            index,
                            "dataDalamKota",
                            selectedOption.value
                          )
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Tanggal Berangkat</FormLabel>
                      <Input
                        type="date"
                        defaultValue={item.tanggalBerangkat}
                        onChange={(e) =>
                          handleDalamKotaChange(
                            index,
                            "tanggalBerangkat",
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Tanggal Pulang</FormLabel>
                      <Input
                        type="date"
                        defaultValue={item.tanggalPulang}
                        onChange={(e) =>
                          handleDalamKotaChange(
                            index,
                            "tanggalPulang",
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                  </Flex>
                );
              })}

              {dataKota.length > 2 ? null : (
                <Button onClick={addDataKota}>Tambah Kota</Button>
              )}
            </Box>
          ) : null}
          <Button onClick={submitPerjalanan}>Submit</Button>
        </Container>
      </Box>
    </Layout>
  );
}

export default Home;
