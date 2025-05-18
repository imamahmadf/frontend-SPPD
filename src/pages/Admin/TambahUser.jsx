import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";
import "../../Style/pagination.css";
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
  Input,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import { register } from "../../Redux/Reducers/auth";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useSelector } from "react-redux";

function TambahUser() {
  const [dataPegawai, setDataPegawai] = useState([]);
  const [role, setRole] = useState(0); // Default role sebagai 'user'
  const [nama, setNama] = useState(null);
  const [password, setPassword] = useState(null);
  const [namaPengguna, setNamaPengguna] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [dataUnitKerja, setDataUnitKerja] = useState(null);
  const [unitKerjaId, setUnitKerjaId] = useState(null);
  const [dataRole, setDataRole] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Hapus spasi dari password
    const cleanNamaPengguna = namaPengguna.replace(/\s+/g, "");
    await dispatch(
      register(nama, password, cleanNamaPengguna, role, unitKerjaId)
    );
    // Arahkan ke halaman login setelah register
    history.push("/admin/daftar-user");
  };

  async function fetchRole() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-role`)
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        setDataUnitKerja(res.data.resultUnitKerja);
        setDataRole(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

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

  useEffect(() => {
    fetchDataPegawai();
    fetchRole();
  }, []);
  return (
    <Layout>
      <Box
        pt={"140px"}
        bgColor={"secondary"}
        minH={"90vh"}
        pb={"40px"}
        px={"30px"}
      >
        {/* {JSON.stringify(selectedPegawai)} */}
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
        >
          {/* <FormControl my={"30px"}>
            <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
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
                setNama(selectedOption.value.nama);
                setPassword(selectedOption.value.nip);
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
          </FormControl> */}

          <FormControl my={"30px"}>
            <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
            <AsyncSelect
              loadOptions={async (inputValue) => {
                if (!inputValue) return [];
                try {
                  const res = await axios.get(
                    `${
                      import.meta.env.VITE_REACT_APP_API_BASE_URL
                    }/pegawai/search?q=${inputValue}`
                  );
                  return res.data.result.map((val) => ({
                    value: val,
                    label: val.nama,
                  }));
                } catch (err) {
                  console.error("Failed to load options:", err.message);
                  return [];
                }
              }}
              placeholder="Ketik Nama Pegawai"
              onChange={(selectedOption) => {
                setNama(selectedOption.value.nama);
                setNamaPengguna(selectedOption.value.nip);
              }}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              chakraStyles={{
                container: (provided) => ({ ...provided, borderRadius: "6px" }),
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

          <FormControl my={"30px"}>
            <FormLabel fontSize={"24px"}>Role</FormLabel>
            <Select2
              options={dataRole?.map((val) => {
                return {
                  value: val,
                  label: `${val.nama}`,
                };
              })}
              placeholder="Cari Role"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                setRole(selectedOption.value.id);
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
            <FormLabel fontSize={"24px"}>Unit Kerja</FormLabel>
            <Select2
              options={dataUnitKerja?.map((val) => {
                return {
                  value: val,
                  label: `${val.unitKerja}`,
                };
              })}
              placeholder="Cari Unit Kerja"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                setUnitKerjaId(selectedOption.value.id);
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
          <FormControl>
            <FormLabel fontSize={"24px"}>Kata Sandi</FormLabel>
            <Input
              height={"60px"}
              bgColor={"terang"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="kata sandi"
            />
          </FormControl>
          <Button mt={"30px"} variant={"primary"} onClick={handleSubmit}>
            Tambah +
          </Button>
        </Container>
      </Box>
    </Layout>
  );
}

export default TambahUser;
