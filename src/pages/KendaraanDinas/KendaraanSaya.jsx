import React, { useState, useEffect } from "react";
import axios from "axios";

import Layout from "../../Componets/Layout";
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
  Heading,
  SimpleGrid,
  Th,
  Td,
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import Foto from "../../assets/add_photo.png";
function KendaraanSaya() {
  const [DataKendaraanDinas, setDataKendaraanDinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const user = useSelector(userRedux);
  async function fetchDataKendaraanDinas() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kendaraan-dinas/get/detail/${user[0]?.pegawaiId}`
      )
      .then((res) => {
        setDataKendaraanDinas(res.data.result);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataKendaraanDinas();
  }, []);

  const handleFileChange = (file, setter, previewSetter) => {
    setter(file);

    // Generate preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewSetter(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      previewSetter(null);
    }

    // Clear error when file is selected
    setErrors((prev) => ({
      ...prev,
      [setter === setFoto1 ? "foto1" : "foto2"]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!foto1) {
      newErrors.foto1 = "Foto pertama wajib diisi";
    }

    if (!foto2) {
      newErrors.foto2 = "Foto kedua wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi semua field yang wajib diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("kmAkhir", foto1);
      formData.append("kondisiAkhir", foto2);
      formData.append("id", DataKendaraanDinas[0].id);

      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kendaraan-dinas/upload-bukti`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Berhasil",
        description: "Foto berhasil diupload",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFoto1(null);
      setFoto2(null);
      setPreview1(null);
      setPreview2(null);
      setErrors({});
      setIsModalOpen(false);

      // Refresh data
      fetchDataKendaraanDinas();
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast({
        title: "Error",
        description: "Gagal mengupload foto. Silakan coba lagi.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFoto1(null);
    setFoto2(null);
    setPreview1(null);
    setPreview2(null);
    setErrors({});
  };
  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"} minH={"60vh"}>
        <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
          {DataKendaraanDinas && DataKendaraanDinas.length > 0 ? (
            <>
              <Flex justify="space-between" align="center" mb={5}>
                <Heading size="lg">Detail Kendaraan Dinas</Heading>
                <Button
                  colorScheme="blue"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<Text>📷</Text>}
                >
                  Upload Foto
                </Button>
              </Flex>

              <Flex p={"15px"} gap={5}>
                <Image
                  borderRadius={"5px"}
                  alt="foto kendaraan"
                  width="50%"
                  height="800px"
                  overflow="hiden"
                  objectFit="cover"
                  src={
                    DataKendaraanDinas[0]?.kendaraan?.foto
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        DataKendaraanDinas[0]?.kendaraan?.foto
                      : Foto
                  }
                />
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={3}>
                    {`Nomor Plat: KT ${DataKendaraanDinas[0]?.kendaraan?.nomor} ${DataKendaraanDinas[0]?.kendaraan?.seri}`}
                  </Text>
                  <Text mb={2}>Tujuan: {DataKendaraanDinas[0]?.tujuan}</Text>
                  <Text mb={2}>
                    Tanggal Pinjam:
                    {new Date(
                      DataKendaraanDinas[0]?.tanggalAwal
                    ).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </Text>
                  <Text>
                    Tanggal Pengembalian:
                    {new Date(
                      DataKendaraanDinas[0]?.tanggalAkhir
                    ).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </Text>
                </Box>
              </Flex>
            </>
          ) : (
            <Center py={10}>
              <Text fontSize="lg" color="gray.500">
                Tidak ada data kendaraan dinas yang tersedia
              </Text>
            </Center>
          )}
        </Container>
      </Box>

      {/* Modal Upload Foto */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Foto Kendaraan</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Foto Pertama */}
              <FormControl isInvalid={errors.foto1}>
                <FormLabel>Foto Pertama *</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(e.target.files[0], setFoto1, setPreview1)
                  }
                  p={1}
                />
                <FormErrorMessage>{errors.foto1}</FormErrorMessage>

                {/* Preview Foto Pertama */}
                {preview1 && (
                  <Box mt={3}>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Preview Foto Pertama:
                    </Text>
                    <Image
                      src={preview1}
                      alt="Preview foto pertama"
                      maxW="200px"
                      maxH="200px"
                      objectFit="cover"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    />
                  </Box>
                )}
              </FormControl>

              {/* Foto Kedua */}
              <FormControl isInvalid={errors.foto2}>
                <FormLabel>Foto Kedua *</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(e.target.files[0], setFoto2, setPreview2)
                  }
                  p={1}
                />
                <FormErrorMessage>{errors.foto2}</FormErrorMessage>

                {/* Preview Foto Kedua */}
                {preview2 && (
                  <Box mt={3}>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Preview Foto Kedua:
                    </Text>
                    <Image
                      src={preview2}
                      alt="Preview foto kedua"
                      maxW="200px"
                      maxH="200px"
                      objectFit="cover"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    />
                  </Box>
                )}
              </FormControl>

              <Text fontSize="sm" color="gray.500" textAlign="center">
                * Kedua foto wajib diisi untuk melanjutkan
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCloseModal}>
              Batal
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Mengupload..."
              isDisabled={!foto1 || !foto2}
            >
              Upload Foto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default KendaraanSaya;
