import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Reducers/auth"; // Import action creator
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

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
  Textarea,
} from "@chakra-ui/react";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../../Redux/Reducers/auth";
import Loading from "../../Componets/Loading";
import LayoutPegawai from "../../Componets/Pegawai/LayoutPegawai";
import Layout from "../../Componets/Layout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

function DetailUsulan(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [dataUsulan, setDataUsulan] = useState(null);
  const [isModalBatalOpen, setIsModalBatalOpen] = useState(false);
  const [catatan, setCatatan] = useState(null);

  async function fetchDataUsulan() {
    setIsLoading(true); // Set loading true sebelum fetch
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/usulan/get/detail/${
          props.match.params.id
        }`
      )
      .then((res) => {
        setDataUsulan(res.data.result);
        console.log(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }

  const ubahStatus = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/usulan/update/usulan-pangkat`,
        { id: dataUsulan.id, catatan }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataUsulan();
        setIsModalBatalOpen(false);
        setAlasanBatal(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handlePreview = (fileName) => {
    const url = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}${fileName}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    // Jalankan kedua fetch dan set loading false setelah keduanya selesai
    fetchDataUsulan();
  }, []);
  if (isLoading) return <Loading />;
  return (
    <LayoutPegawai>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
        >
          <Flex>
            <Box>
              <Heading>{dataUsulan?.pegawai?.nama}</Heading>
              <Heading fontSize={"20px"}>
                {dataUsulan?.pegawai?.jabatan}
              </Heading>
              <Text>{dataUsulan?.pegawai?.nip}</Text>
              <Text>
                {dataUsulan?.pegawai?.daftarPangkat.pangkat}/
                {dataUsulan?.pegawai?.daftarGolongan.golongan}
              </Text>
              <Text> {dataUsulan?.pegawai?.daftarUnitKerja.unitKerja}</Text>
              <Text> {dataUsulan?.pegawai?.tanggalTMT}</Text>
            </Box>
            <Spacer />
            <Box>
              <Text>
                Status:
                {dataUsulan?.status === 0
                  ? " Pengajuan"
                  : dataUsulan?.status === 1
                  ? " Diterima"
                  : dataUsulan.status === 2
                  ? "   Ditolak"
                  : null}{" "}
              </Text>
              {JSON.stringify()}
            </Box>
          </Flex>
          <Box>
            <Text>Catatan: {dataUsulan?.catatan}</Text>
          </Box>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
          mt={"30px"}
        >
          <Center gap={20}>
            <Box width="50%" textAlign="start" py={2}>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  Formulir Pengusulan
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.formulirUsulan)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>{" "}
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  SK Cpns
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.skCpns)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  SK PNS
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.skPns)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  PAK
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.PAK)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  SK Mutasi
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.skMutasi)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
            </Box>
            <Box width="50%" textAlign="start" py={2}>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  SK Jafung
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.skJafung)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>{" "}
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  SKP
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.skp)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  STR
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.str)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  Surat Cuti
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.suratCuti)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
              <Center minWidth={"50%"}>
                <Box width="50%" textAlign="start" py={2}>
                  SK Pencantuman Gelar
                </Box>
                <Box width="50%" textAlign="end" py={2}>
                  <Button
                    variant={"primary"}
                    onClick={() => handlePreview(dataUsulan.gelar)}
                  >
                    Lihat
                  </Button>
                </Box>
              </Center>
            </Box>
          </Center>
          {dataUsulan?.status == 0 ? (
            <Flex mt={"20px"} gap={"20px"}>
              <Button
                variant={"primary"}
                onClick={() => {
                  ubahStatus(dataUsulan.id);
                }}
              >
                Verifikasi
              </Button>

              <Button
                variant={"cancle"}
                onClick={() => {
                  setIsModalBatalOpen(true);
                }}
              >
                batalkan
              </Button>
            </Flex>
          ) : null}
        </Container>
      </Box>{" "}
      <Modal
        isOpen={isModalBatalOpen}
        onClose={() => setIsModalBatalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alasan Pembatalan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Masukkan alasan pembatalan"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => ubahStatus(dataUsulan.id)}
            >
              Batalkan
            </Button>
            <Button onClick={() => setIsModalBatalOpen(false)}>Tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutPegawai>
  );
}

export default DetailUsulan;
