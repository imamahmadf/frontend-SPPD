import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  VStack,
  useToast,
  FormLabel,
  Select,
  Container,
  Flex,
  Thead,
  Tbody,
  Table,
  Tr,
  Center,
  Td,
  Th,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import Layout from "../../Componets/Layout";
const TemplateKeuangan = () => {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileAllKwitansi, setSelectedFileAllKwitansi] = useState(null);
  const [dataTemplate, setDataTemplate] = useState([]);
  const [dataGlobal, setDataGlobal] = useState([]);
  const [dataAllKwitansi, setDataAllKwitansi] = useState([]);
  const toast = useToast();

  async function fetchTemplate() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/template/get-keuangan`
      )
      .then((res) => {
        setDataTemplate(res.data.result);
        setDataGlobal(res.data.resultGlobal);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchAllKwitansi() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/template/get-all-kwitansi`
      )
      .then((res) => {
        setDataAllKwitansi(res.data.result);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

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

  const handleDelete = async (item) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/template/delete/template-keuangan/${item.id}`,
        { filename: item.template }
      );
      fetchTemplate();
      toast({
        title: "Sukses!",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Membuat URL untuk file yang akan diunduh
    } catch (error) {
      toast({
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mengunduh file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGlobal = async (item) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/template/delete/template-keuangan-global/${item.id}`,
        { filename: item.template }
      );
      fetchTemplate();
      toast({
        title: "Sukses!",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Membuat URL untuk file yang akan diunduh
    } catch (error) {
      toast({
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mengunduh file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAllKwitansi = async (item) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/template/delete/template-all-kwitansi/${item.id}`,
        { fileName: item.template }
      );
      fetchAllKwitansi();
      toast({
        title: "Sukses!",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus template",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/template/download`,
        {
          params: { fileName },

          responseType: "blob",
        }
      );

      // Membuat URL untuk file yang akan diunduh
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mengunduh file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTemplate();
    fetchAllKwitansi();
  }, []);
  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"} minH={"90vh"}>
        <Container variant={"primary"} p={"30px"} my={"30px"} minW={"1000px"}>
          <Flex gap={"50px"}>
            <Box
              w={"50%"}
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

                  formData.append("nama", values.nama);

                  try {
                    const response = await axios.post(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/template/upload-keuangan`,
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
                    fetchTemplate();
                    setSelectedFile(null);
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
                      <FormControl>
                        <FormLabel>Nama Template</FormLabel>
                        <Input
                          type="text"
                          onChange={(event) => {
                            setFieldValue("nama", event.target.value);
                          }}
                        />
                        <FormErrorMessage>{errors.jenis}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors.file && touched.file}>
                        <Input
                          type="file"
                          accept=".docx"
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
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
            <Box minW={"50%"}>
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th>Nama</Th>

                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataTemplate?.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.nama}</Td>

                      <Td>
                        <Flex gap={5}>
                          <Button
                            variant={"primary"}
                            onClick={() => handleDownload(item.template)}
                          >
                            Lihat
                          </Button>
                          <Button
                            variant={"cancle"}
                            onClick={() => handleDelete(item)}
                          >
                            Hapus
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Container>

        <Container variant={"primary"} p={"30px"} my={"30px"} minW={"1000px"}>
          <Flex gap={"50px"}>
            <Box
              w={"50%"}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
            >
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Upload Template Kwitansi Global
              </Text>
              <Formik
                initialValues={{ file: null, jenis: null }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  console.log("Nilai yang dikirim:", values.jenis);
                  const formData = new FormData();
                  formData.append("file", values.file);

                  formData.append("nama", values.nama);

                  try {
                    const response = await axios.post(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/template/upload-keuangan-global`,
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
                    fetchTemplate();
                    setSelectedFile(null);
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
                      <FormControl>
                        <FormLabel>Nama Template</FormLabel>
                        <Input
                          type="text"
                          onChange={(event) => {
                            setFieldValue("nama", event.target.value);
                          }}
                        />
                        <FormErrorMessage>{errors.jenis}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors.file && touched.file}>
                        <Input
                          type="file"
                          accept=".docx"
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
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
            <Box minW={"50%"}>
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th>Nama</Th>

                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataGlobal?.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.nama}</Td>

                      <Td>
                        <Flex gap={5}>
                          <Button
                            variant={"primary"}
                            onClick={() => handleDownload(item.dokumen)}
                          >
                            Lihat
                          </Button>
                          <Button
                            variant={"cancle"}
                            onClick={() => handleDeleteGlobal(item)}
                          >
                            Hapus
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Container>

        <Container variant={"primary"} p={"30px"} my={"30px"} minW={"1000px"}>
          <Flex gap={"50px"}>
            <Box
              w={"50%"}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
            >
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Upload Template All Kwitansi
              </Text>
              <Formik
                initialValues={{ file: null, nama: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  const formData = new FormData();
                  formData.append("file", values.file);
                  formData.append("nama", values.nama);

                  try {
                    const response = await axios.post(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/template/upload-all-kwitansi`,
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
                    fetchAllKwitansi();
                    setSelectedFileAllKwitansi(null);
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
                      <FormControl>
                        <FormLabel>Nama Template</FormLabel>
                        <Input
                          type="text"
                          onChange={(event) => {
                            setFieldValue("nama", event.target.value);
                          }}
                        />
                        <FormErrorMessage>{errors.nama}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={errors.file && touched.file}>
                        <Input
                          type="file"
                          accept=".docx"
                          onChange={(event) => {
                            setFieldValue("file", event.currentTarget.files[0]);
                            setSelectedFileAllKwitansi(event.currentTarget.files[0]);
                          }}
                          p={1}
                        />
                        <FormErrorMessage>{errors.file}</FormErrorMessage>
                      </FormControl>

                      {selectedFileAllKwitansi && (
                        <Text fontSize="sm" color="gray.600">
                          File: {selectedFileAllKwitansi.name}
                        </Text>
                      )}

                      <Button
                        type="submit"
                        variant={"primary"}
                        isLoading={isSubmitting}
                        isDisabled={!selectedFileAllKwitansi}
                      >
                        Upload
                      </Button>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </Box>
            <Box minW={"50%"}>
              <Table variant={"primary"}>
                <Thead>
                  <Tr>
                    <Th>Nama</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataAllKwitansi?.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.nama}</Td>
                      <Td>
                        <Flex gap={5}>
                          <Button
                            variant={"primary"}
                            onClick={() => handleDownload(item.template)}
                          >
                            Lihat
                          </Button>
                          <Button
                            variant={"cancle"}
                            onClick={() => handleDeleteAllKwitansi(item)}
                          >
                            Hapus
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
};

export default TemplateKeuangan;
