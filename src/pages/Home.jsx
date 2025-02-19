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
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [dataSeed, setDataSeed] = useState([]);
  const [kodeRekening, setKodeRekening] = useState([]);
  const [tujuan, setTujuan] = useState("");
  const [alasan, setAlasan] = useState("");
  const [dataTtdSurTug, setDataTtdSurTug] = useState([]);
  const [dataTtdNotDis, setDataTtdNotDis] = useState([]);
  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "startDate") {
      setInputStartDate(value);
    } else if (field === "endDate") {
      setInputEndDate(value);
    }
  };

  const submitPerjalanan = () => {
    console.log(
      selectedPegawai,
      inputEndDate,
      inputStartDate,
      dataSeed.resultNomorSurat,
      tujuan,
      alasan,
      kodeRekening,
      dataTtdNotDis,
      dataTtdSurTug
    );
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perjalanan/post`,
        {
          pegawai: selectedPegawai,
          tanggalBerangkat: inputStartDate,
          tanggalPulang: inputEndDate,
          noSurat: dataSeed.resultNomorSurat,
          tujuan,
          alasan,
          kodeRekeningFE: kodeRekening,
          dataTtdNotDis: dataTtdNotDis.value,
          dataTtdSurTug: dataTtdSurTug.value,
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
        link.setAttribute("download", "letter.docx"); // Nama file yang diunduh
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
                closeMenuOnSelect={false}
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
                closeMenuOnSelect={false}
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
                closeMenuOnSelect={false}
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
                closeMenuOnSelect={false}
                onChange={(selectedOption) => {
                  handleSelectChange(selectedOption, 3);
                }}
              />
            </FormControl>
          </HStack>{" "}
          <Flex mt={"40px"} gap={4} w={"100%"}>
            {" "}
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              me="5px"
              maxWidth={"400px"}
            >
              {" "}
              <Text ms="18px">Tanggal Berangkat</Text>
              <Input
                placeholder="Select Date and Time"
                defaultValue={inputStartDate}
                size="md"
                type="date"
                border={"none"}
                onChange={(e) => handleChange(e, "startDate")}
              />
            </FormControl>
            <FormControl
              border={"1px"}
              borderColor="gray.400"
              maxWidth={"400px"}
            >
              {/* buat stardate adnn date dalm flex agar bias sevelahan(dicoba), dijadikan query nanti nya */}
              <Text ms="18px">Tanggal Pulang</Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                defaultValue={inputStartDate}
                type="date"
                border={"none"}
                onChange={(e) => handleChange(e, "endDate")}
              />
            </FormControl>
            <Box w={"50%"}>
              <Box>
                <Text>Nomor Surat Tugas:</Text>
                <Text>
                  {dataSeed?.resultNomorSurat?.length > 0
                    ? dataSeed.resultNomorSurat[0]?.nomor
                    : "Tidak ada data"}
                </Text>
              </Box>
              <Box>
                <Text>Nomor Nota Dinas:</Text>
                <Text>
                  {dataSeed?.resultNomorSurat?.length > 1
                    ? dataSeed.resultNomorSurat[1]?.nomor
                    : "Tidak ada data"}
                </Text>
              </Box>
              <Box>
                <Text>Nomor SPD:</Text>
                <Text>
                  {dataSeed?.resultNomorSurat?.length > 2
                    ? dataSeed.resultNomorSurat[2]?.nomor
                    : "Tidak ada data"}
                </Text>
              </Box>
            </Box>
          </Flex>
          <Flex mt={"40px"} gap={4}>
            <FormControl>
              <FormLabel>Tujuan</FormLabel>
              <Textarea
                onChange={(e) => {
                  setTujuan(e.target.value);
                }}
                placeholder="isi dengan tujuan perjalanan dinas"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Alasan</FormLabel>
              <Textarea
                onChange={(e) => {
                  setAlasan(e.target.value);
                }}
                placeholder="isi dengan alasan perjalanan dinas"
              />
            </FormControl>
          </Flex>
          <Flex>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataSeed.resultKodeRekening?.map((val) => {
                  return {
                    value: val,
                    label: `${val.kode}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                closeMenuOnSelect={false}
                onChange={(e) => {
                  setKodeRekening(e);
                }}
              />
            </FormControl>

            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataSeed.resultTtdSurTug?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                closeMenuOnSelect={false}
                onChange={(e) => {
                  setDataTtdSurTug(e);
                }}
              />
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1">
              <Select2
                options={dataSeed.resultTtdNotDis?.map((val) => {
                  return {
                    value: val,
                    label: `${val.nama}`,
                  };
                })}
                placeholder="Cari Nama Pegawai"
                focusBorderColor="red"
                closeMenuOnSelect={false}
                onChange={(e) => {
                  setDataTtdNotDis(e);
                }}
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
                    <Th>Pangkat</Th>
                    <Th>Golongan</Th>
                    <Th>Jabatan</Th>
                    <Th>NIP</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedPegawai.map((pegawai, index) => (
                    <Tr key={index}>
                      <Td>{pegawai.value.id}</Td>
                      <Td>{pegawai.value.nama}</Td>
                      <Td>{pegawai.value.pangkat.nama}</Td>
                      <Td>{pegawai.value.golongan.golongan}</Td>
                      <Td>{pegawai.value.jabatan}</Td>
                      <Td>{pegawai.value.nip}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
          <Box mt={"40px"}>
            {kodeRekening && kodeRekening.value && (
              <>
                <Table variant="simple" mt={4}>
                  <Thead>
                    <Tr>
                      <Th>No</Th>
                      <Th>kode</Th>
                      <Th>kegitan</Th>
                      <Th>subkegiatan</Th>
                      <Th>Sumber</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>1</Td>
                      <Td>{kodeRekening.value.kode}</Td>
                      <Td>{kodeRekening.value.kegiatan}</Td>
                      <Td>{kodeRekening.value.subKegiatan}</Td>
                      <Td>{kodeRekening.value.sumber}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </>
            )}
          </Box>
          <Button onClick={submitPerjalanan}>Submit</Button>
        </Container>
      </Box>
    </Layout>
  );
}

export default Home;
