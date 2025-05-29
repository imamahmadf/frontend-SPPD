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
  Spinner,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import Loading from "../../Componets/Loading";

function DetailPegawaiAdmin(props) {
  const [dataPegawai, setDataPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchDataPegawai() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/detail-pegawai/${props.match.params.id}`
      );
      setDataPegawai(res.data.result);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDataPegawai();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Center pt="80px" h="100vh">
          <Text color="red.500">{error}</Text>
        </Center>
      </Layout>
    );
  }

  if (!dataPegawai || !dataPegawai.length) {
    return (
      <Layout>
        <Center pt="80px" h="100vh">
          <Text>Data pegawai tidak ditemukan</Text>
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box pb={"40px"} px={"30px"}>
        <Container maxW={"1280px"} variant={"primary"} p={"30px"} my={"30px"}>
          <Heading size="md" mb={2}>
            Nama : {dataPegawai[0]?.nama}
          </Heading>
          <Text>NIP. : {dataPegawai[0]?.nip}</Text>
          <Text mb={5}>Jabatan: {dataPegawai[0]?.jabatan}</Text>

          <Table variant={"primary"}>
            <Thead>
              <Tr>
                <Th>nomor SPD</Th>
                <Th>Tanggal Berangkat</Th>
                <Th>Tanggal Pulang</Th>
                <Th>Tujuan</Th>
                <Th>Biaya Perjalanan</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataPegawai[0]?.personils?.map((item, index) => (
                <Tr key={index}>
                  <Td>{item?.nomorSPD || "-"}</Td>
                  <Td>
                    {new Date(item?.tanggalBerangkat).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    ) || "-"}
                  </Td>
                  <Td>
                    {new Date(item?.tanggalPulang).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) || "-"}
                  </Td>
                  <Td>
                    {item?.tujuan?.map((val, idx) => (
                      <Text key={idx}>{val || "-"}</Text>
                    ))}
                  </Td>
                  <Td>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item?.totaluang) || "-"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>
    </Layout>
  );
}

export default DetailPegawaiAdmin;
