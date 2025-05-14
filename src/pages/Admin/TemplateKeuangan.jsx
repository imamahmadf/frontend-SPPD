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
  Thead,
  Tbody,
  Table,
  Tr,
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
  const [dataTemplate, setDataTemplate] = useState([]);

  const toast = useToast();

  async function fetchTemplate() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/template/get-keuangan`
      )
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
        maxW="md"
        mx="auto"
        mt={"140px"}
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        {" "}
        {JSON.stringify(dataTemplate)}
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
      <Container>
        <Table>
          <Thead>
            <Tr>
              <Th>nama</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataTemplate?.map((item, index) => (
              <Tr>
                <Td>{item.nama}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    </Layout>
  );
};

export default TemplateKeuangan;
