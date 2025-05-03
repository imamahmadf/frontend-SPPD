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
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import Layout from "../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";

function Perjalanan() {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState([]);
  const [tanggalPengajuan, setTanggalPengajuan] = useState("");
  const [klasifikasi, setKlasifikasi] = useState(null);
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(null);
  // const [inputEndDate, setInputEndDate] = useState("");
  const [dataSeed, setDataSeed] = useState([]);
  const [untuk, setUntuk] = useState("");
  const [asal, setAsal] = useState(user[0]?.unitKerja_profile?.asal);
  const [dataTtdNotaDinas, setDataTtdNotaDinas] = useState(null);
  const [dataTtdSuratTugas, setDataTtdSuratTugas] = useState(null);
  const [dataPPTK, setDataPPTK] = useState(null);
  const [dataKPA, setDataKPA] = useState(null);
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
  const [dataKlasifikasi, setDataKlasifikasi] = useState([]);
  const [dataKodeKlasifikasi, setDataKodeKlasifikasi] = useState(null);
  const [dataSumberDana, setDataSumberDana] = useState(null);
  const [dataBendahara, setDataBendahara] = useState(null);
  const [jenisPelayananKesehatan, setJenisPelayananKesehatan] = useState(1);
  const [dataJenisPerjalanan, setDataJenisPerjalanan] = useState([]);
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
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/nota-dinas`,
        {
          pegawai: selectedPegawai,
          dataTtdSurTug: dataTtdSuratTugas,
          dataTtdNotaDinas,
          PPTKId: dataPPTK.value.id,
          tanggalPengajuan,
          noSurat: dataSeed?.resultDaftarNomorSurat,
          subKegiatanId: dataSubKegiatan.value.id,
          untuk,
          asal,
          kodeRekeningFE: `${dataSubKegiatan?.value?.kodeRekening}.${jenisPerjalanan.value.kodeRekening}`,
          ttdNotDis: dataTtdNotaDinas,
          perjalananKota,
          // sumber: dataKegiatan.value.sumber,
          jenis: jenisPerjalanan.value,
          dalamKota: dataKota,
          tanggalBerangkat,
          tanggalPulang,
          indukUnitKerjaFE: user[0]?.unitKerja_profile,
          KPAId: dataKPA.value.id,
          kodeKlasifikasi: dataKodeKlasifikasi,
          dataBendaharaId: dataBendahara.id,
          pelayananKesehatanId: jenisPelayananKesehatan,
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
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/seed?indukUnitKerjaId=${
          user[0]?.unitKerja_profile?.indukUnitKerja.id
        }&unitKerjaId=${user[0]?.unitKerja_profile?.id}`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        setDataSeed(res.data);

        if (res.data.resultPPTK && res.data.resultPPTK.length > 0) {
          setDataPPTK({
            value: res.data.resultPPTK[0],
            label: res.data.resultPPTK[0]?.pegawai_PPTK?.nama,
          });
        }

        if (res.data.resultKPA && res.data.resultKPA.length > 0) {
          setDataKPA({
            value: res.data.resultKPA[0],
            label: res.data.resultKPA[0]?.pegawai_KPA?.nama,
          });
        }
        if (
          res.data.resultTtdNotaDinas &&
          res.data.resultTtdNotaDinas.length > 0
        ) {
          setDataTtdNotaDinas({
            value: res.data.resultTtdNotaDinas[0],
            label: res.data.resultTtdNotaDinas[0]?.pegawai_notaDinas?.nama,
          });
        }

        if (
          res.data.resultTtdSuratTugas &&
          res.data.resultTtdSuratTugas.length > 0
        ) {
          setDataTtdSuratTugas({
            value: res.data.resultTtdSuratTugas[0],
            label: res.data.resultTtdSuratTugas[0]?.pegawai?.nama,
          });
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  const fetchJenisPerjalanan = async (id) => {
    console.log(id, "data sumber dana");
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/jenis-perjalanan/${id}`
      )
      .then((res) => {
        console.log(res.data, "tessss");
        setDataJenisPerjalanan(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const fetchDataKodeKlasifikasi = async (id) => {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/klasifikasi/get/kode-klasifikasi/${id}`
      )
      .then((res) => {
        console.log(res.data, "tessss");
        setKodeKlasifikasi(res.data.result);
        setDataKlasifikasi(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

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
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Data Nota Dinas</Heading>
          </HStack>
          <Box p={"30px"}>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Klasifikasi</FormLabel>
              <Select2
                options={dataSeed.resultKlasifikasi?.map((val) => {
                  return {
                    value: val,
                    label: `${val.kode}-${val.namaKlasifikasi}`,
                  };
                })}
                placeholder="Cari Klasifikasi"
                onChange={(selectedOption) => {
                  setKlasifikasi(selectedOption);
                  fetchDataKodeKlasifikasi(selectedOption.value.id);
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
            </FormControl>

            {dataKlasifikasi[0] ? (
              <FormControl my={"30px"}>
                <FormLabel fontSize={"24px"}>Klasifikasi</FormLabel>
                <Select2
                  options={dataKlasifikasi.map((val) => ({
                    value: val,
                    label: `${val.kode} - ${val.kegiatan}`,
                  }))}
                  placeholder="Pilih Klasifikasi"
                  focusBorderColor="red"
                  onChange={(selectedOption) => {
                    setDataKodeKlasifikasi(selectedOption);
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
              </FormControl>
            ) : null}
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Untuk</FormLabel>
              <Textarea
                onChange={(e) => {
                  setUntuk(e.target.value);
                }}
                placeholder="isi dengan tujuan perjalanan dinas"
                backgroundColor={"terang"}
                p={"20px"}
                minHeight={"160px"}
              />
            </FormControl>
          </Box>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
          my={"30px"}
        >
          {" "}
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Daftar Personil</Heading>
          </HStack>
          <SimpleGrid columns={2} spacing={10} p={"30px"}>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Personil 1</FormLabel>
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
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Personil 2</FormLabel>
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
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Personil 3</FormLabel>
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
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Personil 4</FormLabel>
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
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Personil 5</FormLabel>
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
            </FormControl>
          </SimpleGrid>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Daftar Tanda Tangan</Heading>
          </HStack>
          <Box p={"30px"}>
            <FormControl border={0} bgColor={"white"} flex="1" my={"30px"}>
              <FormLabel fontSize={"24px"}>Tanda Tangan Nota Dinas</FormLabel>
              <Select2
                options={
                  dataSeed?.resultTtdNotaDinas?.map((val) => {
                    return {
                      value: val,
                      label: `${val?.pegawai_notaDinas?.nama}`,
                    };
                  }) || []
                }
                placeholder="Ttd Nota Dinas"
                focusBorderColor="red"
                value={dataTtdNotaDinas}
                onChange={(selectedOption) => {
                  setDataTtdNotaDinas(selectedOption);
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
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1" my={"30px"}>
              <FormLabel fontSize={"24px"}>Tanda tangan Surat Tugas</FormLabel>
              <Select2
                options={[
                  {
                    label:
                      dataSeed?.resultTtdSuratTugas?.find(
                        (val) =>
                          val.indukUnitKerjaId ===
                          user[0]?.unitKerja_profile.indukUnitKerja.id
                      )?.["indukUnitKerja-ttdSuratTugas"]?.indukUnitKerja ||
                      "Unit Kerja 2",
                    options:
                      dataSeed?.resultTtdSuratTugas
                        ?.filter((val) => val.indukUnitKerjaId === 2)
                        .map((val) => ({
                          value: val,
                          label: `${val?.pegawai?.nama}`,
                        })) || [],
                  },
                  {
                    label:
                      dataSeed?.resultTtdSuratTugas?.find(
                        (val) => val.unitKerjaId === 1
                      )?.["indukUnitKerja-ttdSuratTugas"]?.indukUnitKerja ||
                      "Unit Kerja 1",
                    options:
                      dataSeed?.resultTtdSuratTugas
                        ?.filter((val) => val.indukUnitKerjaId === 1)
                        .map((val) => ({
                          value: val,
                          label: `${val?.pegawai?.nama}`,
                        })) || [],
                  },
                ]}
                placeholder="Ttd Surat Tugas"
                focusBorderColor="red"
                value={dataTtdSuratTugas}
                onChange={(selectedOption) => {
                  setDataTtdSuratTugas(selectedOption);
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
            </FormControl>
            <FormControl border={0} bgColor={"white"} flex="1" my={"30px"}>
              <FormLabel fontSize={"24px"}>
                Tanda Tangan Pengguna Anggaran
              </FormLabel>
              <Select2
                options={
                  dataSeed?.resultKPA?.map((val) => {
                    return {
                      value: val,
                      label: `${val?.pegawai_KPA?.nama}`,
                    };
                  }) || []
                }
                placeholder="Kuasa Pengguna Anggaran"
                focusBorderColor="red"
                value={dataKPA}
                onChange={(selectedOption) => {
                  setDataKPA(selectedOption);
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
            </FormControl>

            <FormControl border={0} bgColor={"white"} flex="1" my={"30px"}>
              <FormLabel fontSize={"24px"}>Tanda Tangan PPTK</FormLabel>
              <Select2
                options={
                  dataSeed?.resultPPTK?.map((val) => {
                    return {
                      value: val,
                      label: `${val?.pegawai_PPTK?.nama}`,
                    };
                  }) || []
                }
                placeholder="PPTK"
                focusBorderColor="red"
                value={dataPPTK}
                onChange={(selectedOption) => {
                  setDataPPTK(selectedOption);
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
            </FormControl>
          </Box>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Data Keuangan</Heading>
          </HStack>
          <Box p={"30px"}>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Sumber Dana</FormLabel>
              <Select2
                options={dataSeed?.resultSumberDana?.map((val) => {
                  return {
                    value: val,
                    label: `${val.sumber}`,
                  };
                })}
                placeholder="sumber dana"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  setDataSumberDana(selectedOption);
                  fetchJenisPerjalanan(selectedOption.value.id);
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
            </FormControl>

            {dataSumberDana?.value && (
              <>
                <FormControl border={0} bgColor={"white"} flex="1">
                  <Select2
                    options={dataSumberDana?.value?.bendaharas.map((val) => {
                      return {
                        value: val,
                        label: `${val.jabatan} - ${val.pegawai_bendahara.nama}`,
                      };
                    })}
                    placeholder="Cari Bendahara"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setDataBendahara(selectedOption.value);
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
                </FormControl>
              </>
            )}
          </Box>
        </Container>
        {dataSumberDana ? (
          <>
            {" "}
            <Container
              border={"1px"}
              borderRadius={"6px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              maxW={"1280px"}
              bgColor={"white"}
              pt={"30px"}
              ps={"0px"}
              my={"30px"}
            >
              <HStack>
                <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
                <Heading color={"primary"}>Data Perjalanan Dinas</Heading>
              </HStack>
              {JSON.stringify(jenisPelayananKesehatan)}

              <Box p={"30px"}>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>Jenis Perjalanan</FormLabel>
                  <Select2
                    options={dataJenisPerjalanan?.map((val) => {
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
                </FormControl>
                {jenisPerjalanan?.value?.jenis?.includes("Pelayanan") ? (
                  <FormControl my={"30px"}>
                    <FormLabel fontSize={"24px"}>
                      Jenis Pelayanan Kesehatan
                    </FormLabel>
                    <Select2
                      options={dataSeed.resultPelayananKesehatan.map((val) => {
                        return {
                          value: val.id,
                          label: `${val.jenis}`,
                        };
                      })}
                      placeholder="Jenis Perjalanan"
                      focusBorderColor="red"
                      onChange={(selectedOption) => {
                        setJenisPelayananKesehatan(selectedOption.value);
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
                  </FormControl>
                ) : null}

                {jenisPerjalanan?.value?.tipePerjalananId === 2 ? (
                  <Flex my={"30px"} gap={4} direction="column">
                    {perjalananKota.map((item, index) => (
                      <Flex key={index} gap={4}>
                        <FormControl>
                          <FormLabel fontSize={"24px"}>Nama Kota</FormLabel>
                          <Input
                            height={"60px"}
                            bgColor={"terang"}
                            value={item.kota}
                            onChange={(e) =>
                              handlePerjalananChange(
                                index,
                                "kota",
                                e.target.value
                              )
                            }
                            placeholder="Masukkan Kota"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize={"24px"}>
                            Tanggal Berangkat
                          </FormLabel>
                          <Input
                            height={"60px"}
                            bgColor={"terang"}
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
                          <FormLabel fontSize={"24px"}>
                            Tanggal Berangkat
                          </FormLabel>
                          <Input
                            height={"60px"}
                            bgColor={"terang"}
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
                    <Button variant={"secondary"} onClick={addPerjalanan}>
                      Tambah Kota
                    </Button>
                  </Flex>
                ) : jenisPerjalanan?.value?.tipePerjalananId === 1 ? (
                  <Box>
                    {dataKota.map((item, index) => {
                      return (
                        <Flex key={index} gap={4}>
                          <FormControl border={0} bgColor={"white"}>
                            <FormLabel fontSize={"24px"}>Tujuan</FormLabel>
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
                                        (val) =>
                                          val.id === item.dataDalamKota.id
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
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize={"24px"}>
                              Tanggal berangkat
                            </FormLabel>
                            <Input
                              height={"60px"}
                              bgColor={"terang"}
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
                            <FormLabel fontSize={"24px"}>
                              Tanggal Pulang
                            </FormLabel>
                            <Input
                              height={"60px"}
                              bgColor={"terang"}
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
                      <Button
                        width={"100%"}
                        mt={"15px"}
                        variant={"secondary"}
                        onClick={addDataKota}
                      >
                        Tambah Kota
                      </Button>
                    )}
                  </Box>
                ) : null}

                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}> SUB BARU Kegiatan</FormLabel>
                  <Select2
                    options={dataSeed?.resultDaftarSubKegiatan?.map((val) => {
                      return {
                        value: val,
                        label: `${val.subKegiatan} - ${val.kodeRekening}`,
                      };
                    })}
                    placeholder="Cari Kegiatan"
                    focusBorderColor="red"
                    onChange={(selectedOption) => {
                      setDataSubKegiatan(selectedOption);
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
                </FormControl>
                {JSON.stringify(dataKota)}
                {dataKegiatan?.value && (
                  <>
                    <FormControl my={"30px"}>
                      <FormLabel fontSize={"24px"}>Sub Kegiatan</FormLabel>
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
                    </FormControl>
                  </>
                )}
                {dataSubKegiatan.value ? (
                  <Text>{`Kode Rekening: ${dataKegiatan?.value?.kodeRekening}.${dataSubKegiatan?.value?.kodeRekening}.${jenisPerjalanan?.value?.kodeRekening}`}</Text>
                ) : null}

                <Flex mt={"40px"} gap={4}>
                  <FormControl>
                    <FormLabel fontSize={"24px"}>Tanggal Pengajuan</FormLabel>
                    <Input
                      bgColor={"terang"}
                      height="60px"
                      placeholder="Select Date and Time"
                      defaultValue={tanggalPengajuan}
                      type="date"
                      border={"none"}
                      onChange={(e) => handleChange(e, "pengajuan")}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize={"24px"}>Asal</FormLabel>
                    <Input
                      onChange={(e) => {
                        setAsal(e.target.value);
                      }}
                      bgColor={"terang"}
                      height="60px"
                      placeholder="isi dengan asal "
                      defaultValue={asal}
                    />
                  </FormControl>
                </Flex>
              </Box>
            </Container>
          </>
        ) : null}

        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
          my={"20px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Data Keuangan</Heading>
          </HStack>
          <Box p={"30px"} style={{ overflowX: "auto" }}>
            {selectedPegawai.length > 0 && (
              <>
                <Table variant="simple" mt={4}>
                  <Thead bgColor={"primary"}>
                    <Tr>
                      <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                        No
                      </Th>
                      <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                        Nama
                      </Th>
                      <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                        Pangkat/Golongan
                      </Th>
                      <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                        Tingkatan
                      </Th>
                      <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                        Jabatan
                      </Th>
                      <Th fontSize={"14px"} color={"secondary"} py={"15px"}>
                        NIP
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody bgColor={"secondary"}>
                    {selectedPegawai.map((pegawai, index) => (
                      <Tr key={index}>
                        <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                          {pegawai.value.id}
                        </Td>
                        <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                          {pegawai.value.nama}
                        </Td>
                        <Td>
                          {pegawai.value.daftarPangkat.pangkat}/
                          {pegawai.value.daftarGolongan.golongan}
                        </Td>
                        <Td> {pegawai.value.daftarTingkatan.tingkatan}</Td>
                        <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                          {pegawai.value.jabatan}
                        </Td>
                        <Td fontSize={"14px"} color={"primary"} py={"10px"}>
                          {pegawai.value.nip}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </Box>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
        >
          {/* {JSON.stringify(user[0]?.unitKerja_profile)} */}
          {JSON.stringify(dataBendahara)}
          <HStack w={"100%"} spacing={4}></HStack>{" "}
          <Flex mt={"40px"} gap={4} w={"100%"}>
            <Box w={"50%"}>
              <Box>
                <Text>Nomor Surat Tugas:</Text>
                <Text>
                  {dataSeed?.resultDaftarNomorSurat?.length > 0
                    ? dataSeed.resultDaftarNomorSurat[0]?.jenisSurat.nomorSurat
                    : "Tidak ada data"}
                </Text>
              </Box>
              <Box>
                <Text>Nomor Nota Dinas:</Text>
                <Text>
                  {dataSeed?.resultDaftarNomorSurat?.length > 0
                    ? dataSeed.resultDaftarNomorSurat[1]?.jenisSurat.nomorSurat
                    : "Tidak ada data"}
                </Text>
              </Box>
              <Box>
                <Text>Nomor SPD:</Text>
                <Text>
                  {dataSeed?.resultDaftarNomorSurat?.length > 0
                    ? dataSeed.resultDaftarNomorSurat[2]?.jenisSurat.nomorSurat
                    : "Tidak ada data"}
                </Text>
              </Box>
            </Box>
          </Flex>
        </Container>
        <Container maxW={"1280px"}>
          {" "}
          <Button onClick={submitPerjalanan}>Submit</Button>
        </Container>
      </Box>
    </Layout>
  );
}

export default Perjalanan;
