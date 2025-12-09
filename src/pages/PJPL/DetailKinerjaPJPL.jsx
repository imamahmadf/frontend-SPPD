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
  Flex,
  Spacer,
  useDisclosure,
  Center,
  Spinner,
  SimpleGrid,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../Componets/Layout";
import LayoutPegawai from "../../Componets/Pegawai/LayoutPegawai";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import Loading from "../../Componets/Loading";
function DetailKinerjaPJPL(props) {
  const [dataBendahara, setDataBendahara] = useState(null);
  const [dataPejabat, setDataPejabat] = useState(null);
  const history = useHistory();
  const user = useSelector(userRedux);
  const toast = useToast();
  const role = useSelector(selectRole);
  const [pegawaiId, setPegawaiId] = useState(null);
  const [unitKerjaId, setUnitKerjaId] = useState(null);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();

  // async function fetchDataKontrak() {
  //   await axios
  //     .get(
  //       `${
  //         import.meta.env.VITE_REACT_APP_API_BASE_URL
  //       }/PJPL/get/detail-kontrak/${props.match.params.id}`
  //     )
  //     .then((res) => {
  //       setDataPejabat(res.data.result);

  //       console.log(res.data.result);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  async function fetchDataIndikatorPejabat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/PJPL/get/indikator-kinerja/${user[0].unitKerja_profile.id}`
      )
      .then((res) => {
        setDataPejabat(res.data.result);

        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const tambahPejabat = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/PJPL/post/pejabat-verifikator`,
        {
          pegawaiId,
          unitKerjaId,
        }
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil!",
          description: "Data berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onTambahClose();
        fetchDataPejabat();
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error!",
          description: "Data gagal ditambahkan",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        onTambahClose();
      });
  };

  useEffect(() => {
    // fetchDataKontrak();
    fetchDataIndikatorPejabat();
  }, []);

  return (
    <LayoutPegawai>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container maxW={"1280px"} variant={"primary"} p={"30px"} my={"30px"}>
          {JSON.stringify()}
          <HStack gap={5} mb={"30px"}>
            <Button onClick={onTambahOpen} variant={"primary"} px={"50px"}>
              Tambah indikator kinerja +
            </Button>{" "}
          </HStack>{" "}
        </Container>
      </Box>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isTambahOpen}
        onClose={onTambahClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="1200px">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box>
              <HStack>
                <Box bgColor={"pegawai"} width={"30px"} height={"30px"}></Box>
                <Heading color={"pegawai"}>Tambah indikator</Heading>
              </HStack>

              <SimpleGrid columns={2} spacing={10} p={"30px"}>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>indikator</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    onChange={(e) => handleSubmitChange("seri", e.target.value)}
                    placeholder="Contoh: E"
                  />
                </FormControl>
                <FormControl my={"30px"}>
                  <FormLabel fontSize={"24px"}>target</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    type="number"
                    onChange={(e) => handleSubmitChange("seri", e.target.value)}
                    placeholder="2"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>
          </ModalBody>

          <ModalFooter pe={"60px"} pb={"30px"}>
            <Button onClick={tambahPejabat} variant={"primary"}>
              Tambah Kendaraan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutPegawai>
  );
}

export default DetailKinerjaPJPL;
