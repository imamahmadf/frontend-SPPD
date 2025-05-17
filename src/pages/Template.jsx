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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
import Layout from "../Componets/Layout";
const Template = () => {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataTemplate, setDataTemplate] = useState([]);
  const [oldFile, setOldFile] = useState("");
  const toast = useToast();

  async function fetchTemplate() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/template/get`)
      .then((res) => {
        setDataTemplate(res.data.result);
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

  useEffect(() => {
    fetchTemplate();
  }, []);
  return (
    <Layout>
      <Box
        pt={"140px"}
        bgColor={"secondary"}
        pb={"40px"}
        px={"30px"}
        minH={"90vh"}
      >
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          bgColor={"white"}
          p={"30px"}
          my={"30px"}
          minW={"1000px"}
        >
          <Box
            mx="auto"
            mt={10}
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
                      <FormLabel>Jenis Template</FormLabel>
                      <Select
                        mt="10px"
                        placeholder="Template"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        onChange={(e) => {
                          const selectedValue = parseInt(e.target.value);
                          console.log("Nilai yang dipilih:", selectedValue);
                          setFieldValue("jenis", selectedValue);

                          if (selectedValue === 1) {
                            setOldFile(dataTemplate.templateSuratTugas);
                          } else if (selectedValue === 2) {
                            setOldFile(dataTemplate.templateNotaDinas);
                          } else if (selectedFile === 3) {
                            setOldFile(dataTemplate.templateSPD);
                          }
                        }}
                      >
                        <option value="1">Surat Tugas </option>
                        <option value="2">Nota Dinas</option>
                        <option value="3">Surat Tugas Singkat </option>
                      </Select>
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
                      colorScheme="blue"
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
        </Container>
      </Box>
    </Layout>
  );
};

export default Template;
