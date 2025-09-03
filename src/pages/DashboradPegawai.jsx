import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Reducers/auth"; // Import action creator
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import BGPegawai from "../assets/bgPegawai.png";
import {
  Box,
  Center,
  Text,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Container,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Input,
  useToast,
  Badge,
  VStack,
  Divider,
  Spacer,
  Image,
  useDisclosure,
  useColorMode,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import axios from "axios";
import LayoutPegawai from "../Componets/Pegawai/LayoutPegawai";

export default function DashboradPegawai() {
  const history = useHistory();
  const [data, setData] = useState(null);

  // Fungsi untuk menghitung sisa hari
  const hitungSisaHari = (tanggalAwal, tanggalAkhir) => {
    if (!tanggalAwal || !tanggalAkhir) return null;

    const sekarang = new Date();
    const tanggalAwalDate = new Date(tanggalAwal);
    const tanggalAkhirDate = new Date(tanggalAkhir);

    // Jika sudah melewati tanggal akhir
    if (sekarang > tanggalAkhirDate) {
      const selisihHari = Math.ceil(
        (sekarang - tanggalAkhirDate) / (1000 * 60 * 60 * 24)
      );
      return { status: "terlambat", hari: selisihHari };
    }

    // Jika masih dalam rentang waktu
    if (sekarang >= tanggalAwalDate && sekarang <= tanggalAkhirDate) {
      const selisihHari = Math.ceil(
        (tanggalAkhirDate - sekarang) / (1000 * 60 * 60 * 24)
      );
      return { status: "aktif", hari: selisihHari };
    }

    // Jika belum dimulai
    if (sekarang < tanggalAwalDate) {
      const selisihHari = Math.ceil(
        (tanggalAwalDate - sekarang) / (1000 * 60 * 60 * 24)
      );
      return { status: "belum_mulai", hari: selisihHari };
    }

    return null;
  };

  // Fungsi untuk mendapatkan deskripsi status
  const getDeskripsiStatus = (status, hari) => {
    switch (status) {
      case "aktif":
        return `Sisa waktu: ${hari} hari lagi`;
      case "terlambat":
        return `Terlambat: ${hari} hari`;
      case "belum_mulai":
        return `Akan dimulai dalam: ${hari} hari`;
      default:
        return "";
    }
  };

  async function fetchData() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/usulan/get/one/laporan-usulan-pegawai`
      )
      .then((res) => {
        setData(res.data.result[0]);
        console.log(res.data, "DATASEEED");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <LayoutPegawai>
      <Box
        height="80vh"
        backgroundImage={`url(${BGPegawai})`}
        backgroundSize="cover"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Center>
          <Box>
            <Container
              border={"1px"}
              borderRadius={"6px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              bgColor={"white"}
              py={"30px"}
              ps={"0px"}
              mb={"50px"}
            >
              <Center gap={5}>
                <Text>{data?.tanggalAwal}</Text>
                <Text>{data?.tanggalAkhir}</Text>
              </Center>

              {/* Deskripsi Sisa Hari */}
              {data?.tanggalAwal && data?.tanggalAkhir && (
                <Center mt={3}>
                  <Badge
                    colorScheme={
                      hitungSisaHari(data.tanggalAwal, data.tanggalAkhir)
                        ?.status === "aktif"
                        ? "green"
                        : hitungSisaHari(data.tanggalAwal, data.tanggalAkhir)
                            ?.status === "terlambat"
                        ? "red"
                        : "blue"
                    }
                    variant="subtle"
                    fontSize="sm"
                    px={3}
                    py={2}
                    borderRadius="md"
                  >
                    {getDeskripsiStatus(
                      hitungSisaHari(data.tanggalAwal, data.tanggalAkhir)
                        ?.status,
                      hitungSisaHari(data.tanggalAwal, data.tanggalAkhir)?.hari
                    )}
                  </Badge>
                </Center>
              )}
            </Container>

            {data?.status ? (
              <Flex gap={5}>
                <Menu>
                  <MenuButton as={Button}>Usulan Kenaikan Pangkat</MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        history.push("/pegawai/naik-golongan");
                      }}
                    >
                      kenaikan pangkat Berkala
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton as={Button}>Usulan Kenaikan Jenjang</MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        history.push("/pegawai/naik-Jenjang");
                      }}
                    >
                      kenaikan Jenjang
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            ) : null}
          </Box>
        </Center>
      </Box>
    </LayoutPegawai>
  );
}
