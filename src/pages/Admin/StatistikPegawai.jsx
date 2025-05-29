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

function StatistikPegawai() {
  const [dataPegawai, setDataPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  async function fetchDataPegawai() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/unit-kerja-pegawai`
      );
      setDataPegawai(res.data.result);
      console.log(res.data.result);
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
  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          maxW={"4880px"}
          variant={"primary"}
          p={"30px"}
          style={{ overflowX: "auto" }}
        >
          {dataPegawai?.map((unit, index) => (
            <Box key={unit.unitKerjaId} mb={10}>
              <Heading size="md" mb={3}>
                {index + 1}. {unit.namaUnitKerja}
              </Heading>
              <Text mb={2}>
                <strong>Total Pegawai:</strong> {unit.totalPegawai}
              </Text>
              <HStack spacing={6} mb={4}>
                <Text>
                  <strong>PNS:</strong> {unit.statusPegawai?.PNS || 0}
                </Text>
                <Text>
                  <strong>CPNS:</strong> {unit.statusPegawai?.CPNS || 0}
                </Text>
                <Text>
                  <strong>P3K:</strong> {unit.statusPegawai?.P3K || 0}
                </Text>
                <Text>
                  <strong>PTT:</strong> {unit.statusPegawai?.PTT || 0}
                </Text>
              </HStack>
              <Table variant="primary" size="sm" mb={6}>
                <Thead>
                  <Tr>
                    <Th>Status</Th>
                    {Object.values(unit.profesi).map((profesi, i) => (
                      <Th key={i} isNumeric>
                        {profesi.namaProfesi}
                      </Th>
                    ))}
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {["PNS", "CPNS", "P3K", "PTT"].map((status) => {
                    let totalPerStatus = 0;

                    return (
                      <Tr key={status}>
                        <Td fontWeight="bold">{status}</Td>
                        {Object.values(unit.profesi).map((profesi) => {
                          const jumlah = profesi.jumlah[status] || 0;
                          totalPerStatus += jumlah;
                          return (
                            <Td key={profesi.namaProfesi} isNumeric>
                              {jumlah}
                            </Td>
                          );
                        })}
                        <Td isNumeric fontWeight="bold">
                          {totalPerStatus}
                        </Td>
                      </Tr>
                    );
                  })}

                  {/* Baris Total per Profesi */}
                  <Tr bg="gray.50">
                    <Td fontWeight="bold">Total</Td>
                    {Object.values(unit.profesi).map((profesi) => {
                      const totalProfesi =
                        (profesi.jumlah.PNS || 0) +
                        (profesi.jumlah.CPNS || 0) +
                        (profesi.jumlah.P3K || 0) +
                        (profesi.jumlah.PTT || 0);

                      return (
                        <Td
                          key={profesi.namaProfesi + "_total"}
                          isNumeric
                          fontWeight="bold"
                        >
                          {totalProfesi}
                        </Td>
                      );
                    })}
                    <Td isNumeric fontWeight="bold">
                      {unit.totalPegawai}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          ))}
        </Container>
      </Box>
    </Layout>
  );
}

export default StatistikPegawai;
