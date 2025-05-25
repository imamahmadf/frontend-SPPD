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
const TemplateKadis = () => {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataTemplate, setDataTemplate] = useState([]);
  const [oldFile, setOldFile] = useState("");
  const toast = useToast();

  async function fetchTemplate() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/template/get-kadis`)
      .then((res) => {
        setDataTemplate(res.data.result);
        setOldFile(res.data.result[0].template);
        console.log(res.data.result[0].template);
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
              initialValues={{ file: null, nomorSurat: null }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                console.log("Nilai yang dikirim:", values.jenis);
                const formData = new FormData();
                formData.append("file", values.file);
                formData.append("nomorSurat", values.nomorSurat);
                formData.append("oldFile", oldFile);
                formData.append("id", dataTemplate[0].id);

                try {
                  const response = await axios.post(
                    `${
                      import.meta.env.VITE_REACT_APP_API_BASE_URL
                    }/template/upload-kadis`,
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
                      <FormLabel>Nomor Surat</FormLabel>
                      <Input
                        type="text"
                        onChange={(event) => {
                          setFieldValue("nomorSurat", event.target.value);
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

export default TemplateKadis;
