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
} from "@chakra-ui/react";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../../Redux/Reducers/auth";
import Layout from "../../Componets/Layout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

function NaikGolongan() {
  const [selectedFiles, setSelectedFiles] = useState({});
  const user = useSelector(userRedux);
  const toast = useToast();
  const [dataProfile, setDataProfile] = useState(null);
  async function fetchProfile() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/profile/${
          user[0].id
        }`
      )
      .then((res) => {
        // Tindakan setelah berhasil
        setDataProfile(res.data.result);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Validasi Yup
  const validationSchema = Yup.object().shape({
    formulir_usulan: Yup.mixed()
      .required("Formulir Usulan Naik Pangkat wajib diunggah")
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
    sk_cpns: Yup.mixed()
      .required("Fotocopy SK CPNS Legalisir wajib diunggah")
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
    sk_pns: Yup.mixed()
      .required("Fotocopy SK PNS Legalisir wajib diunggah")
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
    pak: Yup.mixed()
      .required("PAK wajib diunggah")
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
    sk_jafung_pertama: Yup.mixed()
      .required(
        "Fotocopy SK Jafung Pengangkatan Pertama Kali Legalisir wajib diunggah"
      )
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
    skp_2tahun: Yup.mixed()
      .required("Fotocopy SKP 2 Tahun Terakhir Legalisir wajib diunggah")
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
    sk_mutasi: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => !value || value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => !value || value.size <= 700 * 1024
      ),
    str_sip: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => !value || value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => !value || value.size <= 700 * 1024
      ),
    surat_cuti: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Format file harus PDF",
        (value) => !value || value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => !value || value.size <= 700 * 1024
      ),
  });

  const fileFields = [
    {
      name: "formulir_usulan",
      label: "Formulir Usulan Naik Pangkat",
      wajib: true,
    },
    { name: "sk_cpns", label: "Fotocopy SK CPNS Legalisir", wajib: true },
    { name: "sk_pns", label: "Fotocopy SK PNS Legalisir", wajib: true },
    { name: "pak", label: "PAK", wajib: true },
    {
      name: "sk_jafung_pertama",
      label: "Fotocopy SK Jafung Pengangkatan Pertama Kali Legalisir",
      wajib: true,
    },
    {
      name: "skp_2tahun",
      label: "Fotocopy SKP 2 Tahun Terakhir Legalisir",
      wajib: true,
    },
    { name: "sk_mutasi", label: "Fotocopy SK Mutasi", wajib: false },
    {
      name: "str_sip",
      label: "Fotocopy STR dan SIP aktif Legalisir",
      wajib: false,
    },
    {
      name: "surat_cuti",
      label: "Fotocopy surat Cuti jika cuti > 29 hari",
      wajib: false,
    },
  ];
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
          <Box p={"30px"}>
            <Heading>{dataProfile?.pegawai?.nama}</Heading>
            <Heading fontSize={"20px"}>{dataProfile?.pegawai?.jabatan}</Heading>
            <Text>{dataProfile?.pegawai?.nip}</Text>
            <Text>
              {dataProfile?.pegawai?.daftarPangkat.pangkat}/
              {dataProfile?.pegawai?.daftarGolongan.golongan}
            </Text>
            <Text> {dataProfile?.pegawai?.daftarUnitKerja.unitKerja}</Text>
            <Text> {dataProfile?.pegawai?.tanggalTMT}</Text>
          </Box>
        </Container>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
        >
          <Formik
            initialValues={{
              formulir_usulan: null,
              sk_cpns: null,
              sk_pns: null,
              pak: null,
              sk_jafung_pertama: null,
              skp_2tahun: null,
              sk_mutasi: null,
              str_sip: null,
              surat_cuti: null,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const formData = new FormData();
              // Append semua field wajib (sudah divalidasi pasti ada)
              formData.append("formulir_usulan", values.formulir_usulan);
              formData.append("sk_cpns", values.sk_cpns);
              formData.append("sk_pns", values.sk_pns);
              formData.append("pak", values.pak);
              formData.append("sk_jafung_pertama", values.sk_jafung_pertama);
              formData.append("skp_2tahun", values.skp_2tahun);
              formData.append("pegawaiId", user[0].id);
              // Append field opsional jika ada
              if (values.sk_mutasi)
                formData.append("sk_mutasi", values.sk_mutasi);
              if (values.str_sip) formData.append("str_sip", values.str_sip);
              if (values.surat_cuti)
                formData.append("surat_cuti", values.surat_cuti);
              try {
                await axios.post(
                  `${
                    import.meta.env.VITE_REACT_APP_API_BASE_URL
                  }/usulan/post/golongan`,
                  formData,
                  { headers: { "Content-Type": "multipart/form-data" } }
                );
                toast({
                  title: "Sukses!",
                  description: "File berhasil diunggah.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                resetForm();
                setSelectedFiles({});
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
            {({ setFieldValue, isSubmitting, errors, touched, values }) => (
              <Form>
                <VStack spacing={10} align="stretch">
                  {fileFields.map((field) => (
                    <FormControl
                      key={field.name}
                      isInvalid={errors[field.name] && touched[field.name]}
                      isRequired={field.wajib}
                    >
                      <FormLabel>
                        {`Upload File ${field.label} ${
                          field.wajib ? "(wajib)" : "(opsional)"
                        }`}
                      </FormLabel>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(event) => {
                          setFieldValue(
                            field.name,
                            event.currentTarget.files[0]
                          );
                          setSelectedFiles((prev) => ({
                            ...prev,
                            [field.name]: event.currentTarget.files[0],
                          }));
                        }}
                        p={1}
                      />
                      {values[field.name] && (
                        <Text fontSize="sm" color="gray.600">
                          File: {values[field.name].name}
                        </Text>
                      )}
                      <Text color="red.500" fontSize="sm">
                        {errors[field.name] &&
                          touched[field.name] &&
                          errors[field.name]}
                      </Text>
                    </FormControl>
                  ))}
                  <Button
                    type="submit"
                    variant={"primary"}
                    isLoading={isSubmitting}
                    isDisabled={
                      !values.formulir_usulan ||
                      !values.sk_cpns ||
                      !values.sk_pns ||
                      !values.pak ||
                      !values.sk_jafung_pertama
                    }
                  >
                    Upload
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </Container>
      </Box>
    </Layout>
  );
}

export default NaikGolongan;
