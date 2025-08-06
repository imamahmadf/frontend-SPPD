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

import LayoutPegawai from "../../Componets/Pegawai/LayoutPegawai";
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

  const ubahStatus = () => {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/usulan/update/usulan-pangkat`,
        { id: dataProfile.pegawai.usulanPegawais[0].id, statusId: 0 }
      )
      .then((res) => {
        console.log(res.data);
        fetchProfile();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // Validasi Yup
  const validationSchema = Yup.object().shape({
    formulirUsulan: Yup.mixed()
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
    skCpns: Yup.mixed()
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
    skPns: Yup.mixed()
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
    PAK: Yup.mixed()
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
    skJafung: Yup.mixed()
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
    skp: Yup.mixed()
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
    skMutasi: Yup.mixed()
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
    STR: Yup.mixed()
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
    suratCuti: Yup.mixed()
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
      name: "formulirUsulan",
      label: "Formulir Usulan Naik Pangkat",
      wajib: true,
    },
    { name: "skCpns", label: "Fotocopy SK CPNS Legalisir", wajib: true },
    { name: "skPns", label: "Fotocopy SK PNS Legalisir", wajib: true },
    { name: "PAK", label: "PAK", wajib: true },
    {
      name: "skJafung",
      label: "Fotocopy SK Jafung Pengangkatan Pertama Kali Legalisir",
      wajib: true,
    },
    {
      name: "skp",
      label: "Fotocopy SKP 2 Tahun Terakhir Legalisir",
      wajib: true,
    },
    { name: "skMutasi", label: "Fotocopy SK Mutasi", wajib: false },
    {
      name: "STR",
      label: "Fotocopy STR dan SIP aktif Legalisir",
      wajib: false,
    },
    {
      name: "suratCuti",
      label: "Fotocopy surat Cuti jika cuti > 29 hari",
      wajib: false,
    },
  ];
  const handlePreview = (fileName) => {
    const url = `${import.meta.env.VITE_REACT_APP_API_BASE_URL}${fileName}`;
    window.open(url, "_blank");
  };

  // Fungsi helper untuk mendapatkan nama file lama berdasarkan field name
  const getNamaFileLama = (fieldName, usulanPegawai) => {
    if (!usulanPegawai) return "";

    // Mapping field name ke property yang sesuai di data API
    const fieldMapping = {
      formulirUsulan: "formulirUsulan",
      skCpns: "skCpns",
      skPns: "skPns",
      PAK: "PAK",
      skMutasi: "skMutasi",
      skJafung: "skJafung",
      skp: "skp",
      STR: "str",
      suratCuti: "suratCuti",
      gelar: "gelar",
    };

    // Menggunakan mapping untuk mendapatkan nama file lama
    const apiFieldName = fieldMapping[fieldName];
    if (apiFieldName && usulanPegawai[apiFieldName]) {
      return usulanPegawai[apiFieldName];
    }

    return "";
  };

  // Fungsi untuk mengirim file ke API dengan informasi jenis dokumen
  const handleUploadFile = async (file, jenisDokumen, fieldName) => {
    if (!file) return false;
    if (file.size > 700 * 1024) {
      setUploadError("Ukuran file maksimal 700KB.");
      return false;
    }

    setUploadLoading(true);
    const usulanId = dataProfile?.pegawai?.usulanPegawais[0]?.id;
    const formData = new FormData();

    // Data file yang akan diupload
    formData.append("id", usulanId);
    formData.append("file", file);

    // Informasi tambahan tentang dokumen yang diupload
    formData.append("jenis_dokumen", jenisDokumen); // Contoh: "SK PNS", "PAK", "Formulir Pengusulan"
    formData.append("nama_file", file.name); // Nama file asli
    formData.append("ukuran_file", file.size); // Ukuran file dalam bytes
    formData.append("tipe_file", file.type); // MIME type file
    formData.append("field_name", fieldName); // Nama field di database

    // Mendapatkan nama file dokumen yang lama (jika ada)
    const usulanPegawai = dataProfile?.pegawai?.usulanPegawais[0];
    const namaFileLama = getNamaFileLama(fieldName, usulanPegawai);

    // Menambahkan nama file dokumen yang lama
    formData.append("nama_file_lama", namaFileLama);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/usulan/update/usulan-pegawai`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Sukses!",
        description: `File ${jenisDokumen} berhasil diupload.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data setelah upload berhasil
      await fetchProfile();
      return true;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Gagal Upload",
        description: `Terjadi kesalahan saat upload file ${jenisDokumen}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState({
    open: false,
    label: "",
    endpoint: "",
    field: "",
    fileName: "",
  });
  const [uploadError, setUploadError] = useState("");

  // Mapping dokumen ke endpoint dan field
  const uploadConfig = {
    formulirUsulan: {
      label: "Formulir Pengusulan",
      endpoint: "/usulan/upload/formulirusulan",
      field: "formulirUsulan",
    },
    skCpns: {
      label: "SK Cpns",
      endpoint: "/usulan/upload/skcpns",
      field: "skCpns",
    },
    skPns: {
      label: "SK PNS",
      endpoint: "/usulan/upload/skpns",
      field: "skPns",
    },
    PAK: {
      label: "PAK",
      endpoint: "/usulan/upload/PAK",
      field: "PAK",
    },
    skMutasi: {
      label: "SK Mutasi",
      endpoint: "/usulan/upload/skmutasi",
      field: "skMutasi",
    },
    skJafung: {
      label: "SK Jafung",
      endpoint: "/usulan/upload/skjafung",
      field: "skJafung",
    },
    skp: {
      label: "SKP",
      endpoint: "/usulan/upload/skp",
      field: "skp",
    },
    str: {
      label: "STR",
      endpoint: "/usulan/upload/str",
      field: "STR",
    },
    suratCuti: {
      label: "Surat Cuti",
      endpoint: "/usulan/upload/suratcuti",
      field: "suratCuti",
    },
    gelar: {
      label: "SK Pencantuman Gelar",
      endpoint: "/usulan/upload/gelar",
      field: "gelar",
    },
  };

  return (
    <LayoutPegawai>
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
          mt={"30px"}
        >
          {dataProfile?.pegawai?.usulanPegawais[0]?.status === 2 ? (
            <Center gap={20}>
              <Box width="50%" textAlign="start" py={2}>
                {/* Formulir Pengusulan */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    Formulir Pengusulan
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].formulirUsulan ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0]
                              .formulirUsulan
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.formulirUsulan.label,
                          endpoint: uploadConfig.formulirUsulan.endpoint,
                          field: uploadConfig.formulirUsulan.field,
                          fileName: "formulirUsulan",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>{" "}
                {/* SK Cpns */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    SK Cpns
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {/* {dataProfile?.pegawai.usulanPegawais[0]} */}
                    {dataProfile?.pegawai?.usulanPegawais[0].skCpns ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].skCpns
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.skCpns.label,
                          endpoint: uploadConfig.skCpns.endpoint,
                          field: uploadConfig.skCpns.field,
                          fileName: "skCpns",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
                {/* SK PNS */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    SK PNS
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {/* {dataProfile?.pegawai.usulanPegawais[0]} */}
                    {dataProfile?.pegawai.usulanPegawais[0].skPns ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].skPns
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.skPns.label,
                          endpoint: uploadConfig.skPns.endpoint,
                          field: uploadConfig.skPns.field,
                          fileName: "skPns",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
                {/* PAK */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    PAK
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {/* {dataProfile?.pegawai.usulanPegawais[0]} */}
                    {dataProfile?.pegawai.usulanPegawais[0].PAK ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].PAK
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}
                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.PAK.label,
                          endpoint: uploadConfig.PAK.endpoint,
                          field: uploadConfig.PAK.field,
                          fileName: "PAK",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
                {/* SK Mutasi */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    SK Mutasi
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].skMutasi ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].skMutasi
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.skMutasi.label,
                          endpoint: uploadConfig.skMutasi.endpoint,
                          field: uploadConfig.skMutasi.field,
                          fileName: "skMutasi",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
              </Box>
              <Box width="50%" textAlign="start" py={2}>
                {/* SK Jafung */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    SK Jafung
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].skJafung ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].skJafung
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.skJafung.label,
                          endpoint: uploadConfig.skJafung.endpoint,
                          field: uploadConfig.skJafung.field,
                          fileName: "skJafung",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>{" "}
                {/* SKP */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    SKP
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].skp ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].skp
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.skp.label,
                          endpoint: uploadConfig.skp.endpoint,
                          field: uploadConfig.skp.field,
                          fileName: "skp",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
                {/* STR */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    STR
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].str ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].str
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.str.label,
                          endpoint: uploadConfig.str.endpoint,
                          field: uploadConfig.str.field,
                          fileName: "str",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
                {/* Surat Cuti */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    Surat Cuti
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].suratCuti ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].suratCuti
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.suratCuti.label,
                          endpoint: uploadConfig.suratCuti.endpoint,
                          field: uploadConfig.suratCuti.field,
                          fileName: "suratCuti",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
                {/* SK Pencantuman Gelar */}
                <Center minWidth={"50%"}>
                  <Box width="50%" textAlign="start" py={2}>
                    SK Pencantuman Gelar
                  </Box>
                  <Box width="50%" textAlign="end" py={2}>
                    {dataProfile?.pegawai.usulanPegawais[0].gelar ? (
                      <Button
                        variant={"primary"}
                        onClick={() =>
                          handlePreview(
                            dataProfile?.pegawai.usulanPegawais[0].gelar
                          )
                        }
                      >
                        Lihat
                      </Button>
                    ) : (
                      "-"
                    )}

                    <Button
                      ml={2}
                      variant={"outline"}
                      onClick={() =>
                        setUploadModal({
                          open: true,
                          label: uploadConfig.gelar.label,
                          endpoint: uploadConfig.gelar.endpoint,
                          field: uploadConfig.gelar.field,
                          fileName: "gelar",
                        })
                      }
                    >
                      Upload Berkas
                    </Button>
                  </Box>
                </Center>
              </Box>
            </Center>
          ) : dataProfile?.pegawai?.usulanPegawais[0]?.status === 0 ? (
            <Text>proses</Text>
          ) : (
            <Text>terima</Text>
          )}
          <Button onClick={ubahStatus} mt={"30px"} variant={"primary"}>
            Kirim
          </Button>
        </Container>

        {/* Modal Upload Berkas Dinamis */}
        <Modal
          isOpen={uploadModal.open}
          onClose={() => {
            setUploadModal({ ...uploadModal, open: false });
            setUploadFile(null);
            setUploadError("");
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload {uploadModal.label}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Jenis Dokumen: {uploadModal.label}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={3}>
                    Field: {uploadModal.field}
                  </Text>
                  {/* Menampilkan nama file lama jika ada */}
                  {(() => {
                    const usulanPegawai =
                      dataProfile?.pegawai?.usulanPegawais[0];
                    const namaFileLama = getNamaFileLama(
                      uploadModal.field,
                      usulanPegawai
                    );

                    return namaFileLama ? (
                      <Box p={2} bg="orange.50" borderRadius="md" mb={3}>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="orange.700"
                          mb={1}
                        >
                          File yang akan diganti:
                        </Text>
                        <Text fontSize="sm" color="orange.600">
                          {namaFileLama}
                        </Text>
                      </Box>
                    ) : null;
                  })()}
                </Box>

                <FormControl>
                  <FormLabel>Pilih File PDF</FormLabel>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 700 * 1024) {
                        setUploadError("Ukuran file maksimal 700KB.");
                        setUploadFile(null);
                        e.target.value = null;
                      } else {
                        setUploadFile(file);
                        setUploadError("");
                      }
                    }}
                    mb={3}
                  />
                </FormControl>

                {uploadFile && (
                  <Box p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" mb={1}>
                      File yang dipilih:
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Nama: {uploadFile.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Ukuran: {(uploadFile.size / 1024).toFixed(2)} KB
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Tipe: {uploadFile.type}
                    </Text>
                  </Box>
                )}

                {uploadError && (
                  <Text fontSize="sm" color="red.500">
                    {uploadError}
                  </Text>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                isLoading={uploadLoading}
                isDisabled={!uploadFile}
                onClick={async () => {
                  const success = await handleUploadFile(
                    uploadFile,
                    uploadModal.label,
                    uploadModal.field
                  );

                  if (success) {
                    setUploadFile(null);
                    setUploadError("");
                    setUploadModal({ ...uploadModal, open: false });
                  }
                }}
              >
                Upload
              </Button>
              <Button
                onClick={() => {
                  setUploadModal({ ...uploadModal, open: false });
                  setUploadFile(null);
                  setUploadError("");
                }}
              >
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {dataProfile?.pegawai?.usulanPegawais[0] ? null : (
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
                formulirUsulan: null,
                skCpns: null,
                skPns: null,
                PAK: null,
                skJafung: null,
                skp: null,
                skMutasi: null,
                STR: null,
                suratCuti: null,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const formData = new FormData();
                // Append semua field wajib (sudah divalidasi pasti ada)
                formData.append("formulirUsulan", values.formulirUsulan);
                formData.append("skCpns", values.skCpns);
                formData.append("skPns", values.skPns);
                formData.append("PAK", values.PAK);
                formData.append("skJafung", values.skJafung);
                formData.append("skp", values.skp);
                formData.append("pegawaiId", user[0].pegawaiId);
                // Append field opsional jika ada
                if (values.skMutasi)
                  formData.append("skMutasi", values.skMutasi);
                if (values.STR) formData.append("STR", values.STR);
                if (values.suratCuti)
                  formData.append("suratCuti", values.suratCuti);
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
                        !values.formulirUsulan ||
                        !values.skCpns ||
                        !values.skPns ||
                        !values.PAK ||
                        !values.skJafung
                      }
                    >
                      Upload
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Container>
        )}
      </Box>
    </LayoutPegawai>
  );
}

export default NaikGolongan;
