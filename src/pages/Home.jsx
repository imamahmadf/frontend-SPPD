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
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";

function Home() {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState([]);
  const [tanggalPengajuan, setTanggalPengajuan] = useState("");
  // const [inputEndDate, setInputEndDate] = useState("");
  const [dataSeed, setDataSeed] = useState([]);
  const [untuk, setUntuk] = useState("");

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
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perjalanan/get/seed/${
          user[0]?.unitKerja_profile?.id
        }`
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
      <Box pt={"80px"} bgColor={"white"} pb={"40px"} px={"30px"}>
        ini HOME
      </Box>
    </Layout>
  );
}

export default Home;
