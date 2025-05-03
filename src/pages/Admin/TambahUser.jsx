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
  const [role, setRole] = useState("user"); // Default role sebagai 'user'
  const [nama, setNama] = useState(null);
  const [password, setPassword] = useState(null);
  const [namaPengguna, setNamaPengguna] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(register(nama, namaPengguna, password, role));
    // Arahkan ke halaman login setelah register
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

  useEffect(() => {
    fetchDataPegawai();
  }, []);
  return (
    <Layout>
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        {/* {JSON.stringify(selectedPegawai)} */}
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
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
          </FormControl>{" "}
          <FormControl>
            <FormLabel fontSize={"24px"}>Nama Pengguna</FormLabel>
            <Input
              height={"60px"}
              bgColor={"terang"}
              onChange={(e) => setNamaPengguna(e.target.value)}
              placeholder="Contoh: amin"
            />
          </FormControl>
          <Button onClick={handleSubmit}>Tambah</Button>
        </Container>
      </Box>
    </Layout>
  );
}

export default TambahUser;
