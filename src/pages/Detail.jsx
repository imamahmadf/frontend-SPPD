import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Flex,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";

function Detail(props) {
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );
  async function fetchDataPerjalan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/detail-perjalanan/${props.match.params.id}`
      )
      .then((res) => {
        setDetailPerjalanan(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const history = useHistory();
  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("File harus diunggah")
      .test(
        "fileType",
        "Format file tidak valid. Harap unggah file .docx",
        (value) =>
          value &&
          value.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ),
  });
  useEffect(() => {
    fetchDataPerjalan();
  }, []);
  return (
    <>
      <Layout>
        <Box>
          <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
            <Flex>
              <Box>
                <Text>Asal: {detailPerjalanan.asal}</Text>
                <Text>Dasar: {detailPerjalanan.dasar || "-"}</Text>{" "}
                <Text>No. Surat Tugas: {detailPerjalanan.noSuratTugas}</Text>{" "}
                <Text>
                  No. Nota Dinas:{" "}
                  {detailPerjalanan.isNotaDinas
                    ? detailPerjalanan.noNotaDinas
                    : "-"}
                </Text>{" "}
                <Text>
                  No. Telaahan Staf:{" "}
                  {detailPerjalanan.isNotaDinas
                    ? "-"
                    : detailPerjalanan.noNotaDinas}
                </Text>
                <Text>
                  Tanggal Pengajuan:
                  {new Date(
                    detailPerjalanan.tanggalPengajuan
                  ).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Text>
                  Tanggal Berangkat:{" "}
                  {new Date(
                    detailPerjalanan.tempats?.[0]?.tanggalBerangkat
                  ).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Text>
                  Tanggal Pulang:{" "}
                  {new Date(
                    detailPerjalanan.tempats?.[
                      detailPerjalanan.tempats?.length - 1
                    ]?.tanggalPulang
                  ).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Text>
                  Sumber Dana: {detailPerjalanan.bendahara?.sumberDana?.sumber}
                </Text>
                <Text>Tujuan: {daftarTempat}</Text>
              </Box>{" "}
              <Box
                mx="auto"
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
              >
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Upload Template Word
                </Text>

                <Formik
                  initialValues={{ file: null, jenis: null }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    console.log("Nilai yang dikirim:", values.jenis);
                    const formData = new FormData();
                    formData.append("file", values.file);
                    formData.append(
                      "id",
                      user[0]?.unitKerja_profile?.indukUnitKerja.id
                    );
                    formData.append("jenis", values.jenis);
                    formData.append("oldFile", oldFile);

                    try {
                      const response = await axios.post(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/template/upload`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                      );

                      toast({
                        title: "Sukses!",
                        description: response.data.message,
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });

                      resetForm();
                      setSelectedFile(null);
                      fetchTemplate();
                    } catch (error) {
                      toast({
                        title: "Gagal Mengunggah",
                        description: "Terjadi kesalahan saat mengunggah file",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    }

                    setSubmitting(false);
                  }}
                >
                  {({ setFieldValue, isSubmitting, errors, touched }) => (
                    <Form>
                      <VStack spacing={4} align="stretch">
                        <FormControl isInvalid={errors.file && touched.file}>
                          <Input
                            type="file"
                            accept=".docx"
                            onChange={(event) => {
                              setFieldValue(
                                "file",
                                event.currentTarget.files[0]
                              );
                              setSelectedFile(event.currentTarget.files[0]);
                            }}
                            p={1}
                          />
                          <FormErrorMessage>{errors.file}</FormErrorMessage>
                        </FormControl>

                        {selectedFile && (
                          <Text fontSize="sm" color="gray.600">
                            File: {selectedFile.name}
                          </Text>
                        )}

                        <Button
                          type="submit"
                          variant={"primary"}
                          isLoading={isSubmitting}
                          isDisabled={!selectedFile}
                        >
                          Upload
                        </Button>
                      </VStack>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Flex>
          </Container>
          <Container mt={"30px"} variant={"primary"} maxW={"1280px"} p={"30px"}>
            {detailPerjalanan?.personils?.map((item, index) => {
              return (
                <>
                  <Box
                    bgColor={"primary"}
                    borderRadius={"5px"}
                    color={"white"}
                    p={"10px"}
                    m={"15px"}
                  >
                    <Text>{item.pegawai.nama}</Text>

                    <Button
                      onClick={() => {
                        history.push(`/rampung/${item.id}`);
                      }}
                    >
                      {" "}
                      Rampung
                    </Button>
                  </Box>
                </>
              );
            })}
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default Detail;
