import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import { Link, useHistory } from "react-router-dom";
import Rill from "../Componets/Rill";
import { useDisclosure } from "@chakra-ui/react";
import Foto from "../assets/add_photo.png";

import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useFormik } from "formik";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  Heading,
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
  Select,
  Td,
  Flex,
  Textarea,
  Alert,
  Toast,
  Input,
  FormHelperText,
  Spacer,
  VStack,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { parseISO, addDays } from "date-fns";
import moment from "moment";
import "moment/locale/id"; // Tambahkan ini
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

moment.locale("id");
const localizer = momentLocalizer(moment);

const formats = {
  dayFormat: (date, culture, localizer) =>
    format(date, "EEEE", { locale: idLocale }), // Senin, Selasa, ...
  weekdayFormat: (date, culture, localizer) =>
    format(date, "EEEEEE", { locale: idLocale }), // S, S, R, K, ...
  monthHeaderFormat: (date, culture, localizer) =>
    format(date, "MMMM yyyy", { locale: idLocale }), // Juni 2025
  dayHeaderFormat: (date, culture, localizer) =>
    format(date, "EEEE, d MMMM", { locale: idLocale }), // Senin, 16 Juni
};

function pegawaiProfile() {
  const toast = useToast();
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [events, setEvents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataProfile, setDataProfile] = useState(null);
  const [dataUsulan, setDataUsulan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataPegawai, setDataPegawai] = useState(null);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const [fileError, setFileError] = useState("");
  async function fetchDataPegawai() {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/get/detail-pegawai/${user[0].pegawaiId}`
      );
      setDataPegawai(res.data.result[0]);
      console.log(res.data.result[0]);

      const formattedEvents = res.data.result[0].personils.map((item) => {
        const startDate = item.tanggalBerangkat
          ? parseISO(item.tanggalBerangkat)
          : new Date();

        const endDate = item.tanggalPulang
          ? parseISO(item.tanggalPulang)
          : startDate;

        return {
          title: item.tujuan,
          start: startDate,
          end: endDate,
          allDay: true,
          resource: item,
        };
      });
      setEvents(formattedEvents);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  }
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

  async function fetchUsulan() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get/usulan/${
          user[0].pegawaiId
        }`
      )
      .then((res) => {
        // Tindakan setelah berhasil
        setDataUsulan(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("File harus diunggah")
      .test(
        "fileType",
        "Format file tidak valid. Harap unggah file .pdf",
        (value) => value && value.type === "application/pdf"
      )
      .test(
        "fileSize",
        "Ukuran file maksimal 700KB",
        (value) => value && value.size <= 700 * 1024
      ),
  });
  useEffect(() => {
    fetchProfile();
    fetchUsulan();
    fetchDataPegawai();
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
          mt={"30px"}
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
        >
          {dataUsulan?.dokumen ? null : (
            <Button onClick={onTambahOpen} variant={"primary"} px={"50px"}>
              Buat Usulan
            </Button>
          )}
          <Box>
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>dokumen</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {dataUsulan?.dokumen ? (
                      <Button
                        variant={"primary"}
                        onClick={() => handleDownload(dataUsulan.dokumen)}
                      >
                        lihat
                      </Button>
                    ) : (
                      "-"
                    )}
                  </Td>{" "}
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Container>
        <Container maxW={"1280px"} variant={"primary"} p={"30px"} my={"30px"}>
          {" "}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            formats={formats} // Tambahkan ini
          />
          <Table variant={"primary"}>
            <Thead>
              <Tr>
                <Th>nomor SPD</Th>
                <Th>Tanggal Berangkat</Th>
                <Th>Tanggal Pulang</Th>
                <Th>Tujuan</Th>
                <Th>Biaya Perjalanan</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataPegawai?.personils?.map((item, index) => (
                <Tr key={index}>
                  <Td>{item?.nomorSPD || "-"}</Td>
                  <Td>
                    {new Date(item?.tanggalBerangkat).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    ) || "-"}
                  </Td>
                  <Td>
                    {new Date(item?.tanggalPulang).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) || "-"}
                  </Td>
                  <Td>
                    {item?.tujuan?.map((val, idx) => (
                      <Text key={idx}>{val || "-"}</Text>
                    ))}
                  </Td>
                  <Td>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item?.totaluang) || "-"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>{" "}
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
                <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
                <Heading color={"primary"}>Tambah Pegawai</Heading>
              </HStack>
            </Box>{" "}
            <Box
              mx="auto"
              mt={10}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
            >
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Upload Berkas
              </Text>

              <Formik
                initialValues={{ file: null }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  const formData = new FormData();
                  formData.append("file", values.file);

                  formData.append("pegawaiId", dataProfile?.pegawai.id || null);

                  try {
                    const response = await axios.post(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/pegawai/upload-usulan`,
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
                          accept=".pdf"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file && file.size > 700 * 1024) {
                              setFileError("Ukuran file maksimal 700KB");
                              setFieldValue("file", null);
                              setSelectedFile(null);
                            } else {
                              setFileError("");
                              setFieldValue("file", file);
                              setSelectedFile(file);
                            }
                          }}
                          p={1}
                        />
                        <FormErrorMessage>{errors.file}</FormErrorMessage>
                        {fileError && (
                          <Alert status="error" mt={2}>
                            <Text>{fileError}</Text>
                          </Alert>
                        )}
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
          </ModalBody>

          <ModalFooter pe={"60px"} pb={"30px"}></ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default pegawaiProfile;
