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
    pendidikan: "",
    profesi: { id: "", nama: "" },
    statusPegawai: { id: "", status: "" },
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
          pendidikan: res.data.result.pendidikan,
          profesi: {
            id: res.data.result.profesi.id,
            nama: res.data.result.profesi.nama,
          },
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
          statusPegawai: {
            id: res.data.result.statusPegawai.id,
            status: res.data.result.statusPegawai.status,
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
      {/* {JSON.stringify(dataPegawai)} */}
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container maxW={"1280px"} variant={"primary"} pt={"30px"} ps={"0px"}>
          <Box p={"30px"}>
            <Table>
              <Thead>
                <Tr>
                  <Th minWidth={"100px"}>Nama:</Th>
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
                  <Th minWidth={"100px"}>NIP</Th>
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
                  <Th minWidth={"100px"}>Pendidikan</Th>
                  <Td>
                    <Flex>
                      {isEditing ? (
                        <>
                          <Input
                            value={dataPegawai.pendidikan}
                            onChange={(e) =>
                              setDataPegawai({
                                ...dataPegawai,
                                pendidikan: e.target.value,
                              })
                            }
                          />
                        </>
                      ) : (
                        <>
                          <Text as="span">{dataPegawai.pendidikan}</Text>
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
                <Tr>
                  <Th minWidth={"100px"}>Golongan</Th>
                  <Td>
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
                  </Td>
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
                      </>
                    ) : (
                      <>
                        <Text>{dataPegawai.daftarTingkatan?.tingkatan}</Text>
                      </>
                    )}
                  </Td>
                </Tr>

                <Tr>
                  <Th>Status Pegawai</Th>
                  <Td>
                    {isEditing ? (
                      <>
                        <Select
                          defaultValue={dataPegawai?.statusPegawai.id}
                          onChange={(e) =>
                            handleSelectChange("statusPegawai", e.target.value)
                          }
                        >
                          <option value="">Pilih Status Pegawai</option>
                          {dataSeed.resultStatusPegawai &&
                            dataSeed.resultStatusPegawai.map((val) => (
                              <option key={val.id} value={val.id}>
                                {val.status}
                              </option>
                            ))}
                        </Select>
                      </>
                    ) : (
                      <>
                        <Text>{dataPegawai.statusPegawai?.status}</Text>
                      </>
                    )}
                  </Td>
                </Tr>

                <Tr>
                  <Th>Profesi</Th>
                  <Td>
                    {isEditing ? (
                      <>
                        <Select
                          defaultValue={dataPegawai?.profesi.id}
                          onChange={(e) =>
                            handleSelectChange("daftarProfesi", e.target.value)
                          }
                        >
                          <option value="">Pilih Profesi</option>
                          {dataSeed.resultProfesi &&
                            dataSeed.resultProfesi.map((val) => (
                              <option key={val.id} value={val.id}>
                                {val.nama}
                              </option>
                            ))}
                        </Select>
                      </>
                    ) : (
                      <>
                        <Text>{dataPegawai.profesi?.nama}</Text>
                      </>
                    )}
                  </Td>
                </Tr>
              </Thead>
            </Table>
            <Box mt={"30px"}>
              {isEditing ? (
                <>
                  {" "}
                  <Button
                    me={"15px"}
                    variant={"primary"}
                    onClick={() => editData()}
                  >
                    Simpan
                  </Button>
                  <Button
                    variant={"cancle"}
                    onClick={() => setIsEditing(false)}
                  >
                    Batal
                  </Button>
                </>
              ) : (
                <Button variant={"primary"} onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}

export default EditPegawai;
