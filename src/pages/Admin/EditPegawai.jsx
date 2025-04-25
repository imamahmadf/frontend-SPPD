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
  Select,
  Flex,
  Textarea,
  Input,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
function EditPegawai(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [dataSeed, setDataSeed] = useState([]);
  const [dataPegawai, setDataPegawai] = useState({
    id: "",
    nama: "",
    jabatan: "",
    nip: "",
    daftarGolongan: { id: "", golongan: "" },
    daftarPangkat: { id: "", golongan: "" },
    daftarTingaktan: { id: "", tingkatan: "" },
  });

  const handleSelectChange = (name, value) => {
    setDataPegawai({
      ...dataPegawai,
      [name]: { ...dataPegawai[name], id: value },
    });
  };
  const editData = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/edit`, {
        dataPegawai,
        id: props.match.params.id,
      })
      .then((res) => {
        console.log(res.data, "DATASEEED");
        fetchDataPegawai();
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  async function fetchSeed() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get/seed`)
      .then((res) => {
        setDataSeed(res.data);
        console.log(res.data, "DATASEEED");
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async function fetchDataPegawai() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/one-pegawai/${props.match.params.id}`
      )
      .then((res) => {
        setDataPegawai({
          id: res.data.result.id,
          nama: res.data.result.nama,
          jabatan: res.data.result.jabatan,
          nip: res.data.result.nip,
          daftarGolongan: {
            id: res.data.result.daftarGolongan.id,
            golongan: res.data.result.daftarGolongan.golongan,
          },
          daftarPangkat: {
            id: res.data.result.daftarPangkat.id,
            pangkat: res.data.result.daftarPangkat.pangkat,
          },
          daftarTingkatan: {
            id: res.data.result.daftarTingkatan.id,
            tingkatan: res.data.result.daftarTingkatan.tingkatan,
          },
        });

        console.log(res.data, "CEK 1234567890");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPegawai();
    fetchSeed();
  }, []);
  return (
    <Layout>
      {JSON.stringify(dataPegawai)}
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
          <Box>
            <Table>
              <Thead>
                <Tr>
                  <Th>Nama</Th>
                  <Td>
                    <Flex>
                      {isEditing ? (
                        <>
                          <Input
                            value={dataPegawai.nama}
                            onChange={(e) =>
                              setDataPegawai({
                                ...dataPegawai,
                                nama: e.target.value,
                              })
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Text as="span">{dataPegawai.nama}</Text>
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Th>NIP</Th>
                  <Td>
                    <Flex>
                      {isEditing ? (
                        <>
                          <Input
                            value={dataPegawai.nip}
                            onChange={(e) =>
                              setDataPegawai({
                                ...dataPegawai,
                                nip: e.target.value,
                              })
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Text as="span">{dataPegawai.nip}</Text>
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Golongan</Th>
                  {isEditing ? (
                    <>
                      <Select
                        defaultValue={dataPegawai.daftarGolongan.id}
                        onChange={(e) =>
                          handleSelectChange("daftarGolongan", e.target.value)
                        }
                      >
                        <option value="">Pilih Golongan</option>
                        {dataSeed.resultGolongan &&
                          dataSeed.resultGolongan.map((val) => (
                            <option key={val.id} value={val.id}>
                              {val.golongan}
                            </option>
                          ))}
                      </Select>
                    </>
                  ) : (
                    <>
                      <Text>{dataPegawai.daftarGolongan.golongan}</Text>
                    </>
                  )}
                  <Th></Th>
                </Tr>
                <Tr>
                  <Th>Pangkat</Th>
                  <Td>
                    {isEditing ? (
                      <>
                        <Select
                          defaultValue={dataPegawai.daftarPangkat.id}
                          onChange={(e) =>
                            handleSelectChange("daftarPangkat", e.target.value)
                          }
                        >
                          <option value="">Pilih Golongan</option>
                          {dataSeed.resultPangkat &&
                            dataSeed.resultPangkat.map((val) => (
                              <option key={val.id} value={val.id}>
                                {val.pangkat}
                              </option>
                            ))}
                        </Select>
                      </>
                    ) : (
                      <>
                        <Text>{dataPegawai.daftarPangkat.pangkat}</Text>
                      </>
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Tingkatan</Th>
                  <Td>
                    {isEditing ? (
                      <>
                        <Select
                          defaultValue={dataPegawai?.daftarTingkatan.id}
                          onChange={(e) =>
                            handleSelectChange(
                              "daftarTingkatan",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Pilih Golongan</option>
                          {dataSeed.resultTingkatan &&
                            dataSeed.resultTingkatan.map((val) => (
                              <option key={val.id} value={val.id}>
                                {val.tingkatan}
                              </option>
                            ))}
                        </Select>
                        <Button onClick={() => editData()}>Simpan</Button>
                        <Button onClick={() => setIsEditing(false)}>
                          Batal
                        </Button>
                      </>
                    ) : (
                      <>
                        <Text>{dataPegawai.daftarTingkatan?.tingkatan}</Text>
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                      </>
                    )}
                  </Td>
                </Tr>
              </Thead>
            </Table>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}

export default EditPegawai;
