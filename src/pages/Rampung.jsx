import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import { Link, useHistory } from "react-router-dom";
import Rill from "../Componets/Rill";
import { useDisclosure } from "@chakra-ui/react";
import Foto from "../assets/add_photo.png";
import TambahBuktiKegiatan from "../Componets/TambahBuktiKegiatan";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useFormik } from "formik";
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
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";

function Rampung(props) {
  const toast = useToast();
  const [randomNumber, setRandomNumber] = useState(0);
  const inputFileRef = useRef(null);
  const [dataRampung, setDataRampung] = useState([]);
  const [templateId, setTemplateId] = useState(
    dataRampung?.template?.[0]?.id || null
  );
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeMsg, setFileSizeMsg] = useState("");
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [itemToDelete, setItemToDelete] = useState(null);
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [bendaharaSelected, setBendaharaSelected] = useState(null);
  const {
    isOpen: isInputOpen,
    onOpen: onInputOpen,
    onClose: onInputClose,
  } = useDisclosure();
  const [isPrinting, setIsPrinting] = useState(false);

  function renderTemplate() {
    return dataRampung.template?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderJenis() {
    return dataRampung.jenisRampung?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.jenis}
        </option>
      );
    });
  }

  const pengajuan = () => {
    if (!dataRampung.result.id) {
      console.error("ID tidak valid");
      return;
    }

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/pengajuan/${dataRampung.result.id}`,
        {
          perjalananId: dataRampung.result.perjalanan.id,
        }
      )
      .then((response) => {
        // Tindakan setelah berhasil
        console.log("Pengajuan berhasil:", response.data);
        toast({
          title: "Berhasil!",
          description: "Pengajuan berhasil dikirim.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Terjadi kesalahan saat mengirim pengajuan.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleFile = (event) => {
    if (event.target.files[0].size / 1024 > 1024) {
      setFileSizeMsg("File size is greater than maximum limit");
    } else {
      setSelectedFile(event.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(event.target.files[0]);
      formik.setFieldValue("pic", event.target.files[0]);
    }
  };
  // Menambahkan totalDuras
  const totalDurasi = dataRampung?.result?.perjalanan?.tempats?.reduce(
    (total, tempat) => total + tempat.dalamKota.durasi, // Asumsi durasi ada di dalamKota
    0 // nilai awal
  );
  const buatOtomatis = () => {
    const maxTransport = dataRampung?.result?.perjalanan?.tempats?.reduce(
      (max, tempat) =>
        tempat.dalamKota.uangTransport > max.dalamKota.uangTransport
          ? tempat
          : max,
      dataRampung.result.perjalanan.tempats[0] // nilai awal
    );

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/kwitansi-otomatis`,
        {
          personilId: dataRampung.result.id,

          subKegiatan:
            dataRampung.result.perjalanan.daftarSubKegiatan.subKegiatan,
          // kodeRekening: `${dataRampung.result.perjalanan.daftarSubKegiatan.kegiatan.kodeRekening}${dataRampung.result.perjalanan.daftarSubKegiatan.kodeRekening}`,
          uangHarian: 170000,
          uangTransport: maxTransport.dalamKota.uangTransport,
          tempatNama: maxTransport.dalamKota.nama,
          asal: dataRampung.result.perjalanan.asal,
          totalDurasi,
          pelayananKesehatan: dataRampung.result.perjalanan.pelayananKesehatan,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const cetak = () => {
    setIsPrinting(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/cetak-kwitansi`,
        {
          id: dataRampung.result.id,

          nomorSPD: dataRampung.result.nomorSPD,
          pegawaiNama: dataRampung.result.pegawai.nama,
          pegawaiNip: dataRampung.result.pegawai.nip,
          pegawaiJabatan: dataRampung.result.pegawai.jabatan,
          untuk: dataRampung.result.perjalanan.untuk,
          PPTKNama: dataRampung.result.perjalanan.PPTK.pegawai_PPTK.nama,
          PPTKNip: dataRampung.result.perjalanan.PPTK.pegawai_PPTK.nip,
          KPANama: dataRampung.result.perjalanan.KPA.pegawai_KPA.nama,
          KPANip: dataRampung.result.perjalanan.KPA.pegawai_KPA.nip,
          KPAJabatan: dataRampung.result.perjalanan.KPA.jabatan,
          templateId,
          subKegiatan:
            dataRampung.result.perjalanan.daftarSubKegiatan.subKegiatan,
          kodeRekening: `${dataRampung.result.perjalanan.daftarSubKegiatan.kodeRekening}${dataRampung.result.perjalanan.jenisPerjalanan.kodeRekening}`,
          rincianBPD: dataRampung.result.rincianBPDs,
          tanggalPengajuan: dataRampung.result.perjalanan.tanggalPengajuan,
          totalDurasi,
          jenis: dataRampung.result.perjalanan.jenisPerjalanan.id,
          tempat: dataRampung.result.perjalanan.tempats,
          jenisPerjalanan: dataRampung.result.perjalanan.jenisPerjalanan.jenis,
          dataBendahara: dataRampung.result.perjalanan.bendahara,
          tahun: new Date(
            dataRampung?.result?.perjalanan.tanggalPengajuan
          ).getFullYear(),
          // untukPembayaran:
          //   dataRampung.result.perjalanan.bendahara.sumberDana.untukPembayaran,
        },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "letter.docx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast({
          title: "Berhasil!",
          description: "File berhasil diunduh.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error!",
          description: "Gagal mengunduh file.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsPrinting(false);
      });
  };

  YupPassword(Yup);

  // /////////////

  const formik = useFormik({
    initialValues: {
      item: "",
      satuan: "",
      // harga: "",
      qty: 0,
      nilai: 0,

      jenis: 0,
    },
    // onSubmit: (values) => {
    //   alert(JSON.stringify(values, null, 2));
    // },
    validationSchema: Yup.object().shape({
      item: Yup.string().required("Mo. Batch wajib diisi"),
      satuan: Yup.string().required("tanganggal kadaluarsa wajib diisi"),
      // harga: Yup.number("masukkan angka").required("harga satuan wajib disi"),
      qty: Yup.number("masukkan angka").required(
        "masukkan jumlah obat perkotak"
      ),
      nilai: Yup.number("masukkan angka").required("Perusahaan wajib diisi"),

      jenis: Yup.number("masukkan angka").required("stok obat wajib disi"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values, "tes formik");
      const { item, satuan, qty, nilai, jenis } = values;

      // kirim data ke back-end
      const formData = new FormData();
      formData.append("item", item);
      formData.append("satuan", satuan);
      formData.append("qty", qty);
      formData.append("nilai", nilai);
      formData.append("jenisId", jenis);
      formData.append("personilId", props.match.params.id);
      formData.append("pic", selectedFile);

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/kwitansi/post/rampung`,
          formData
        )
        .then((res) => {
          // Menampilkan toast setelah berhasil
          console.log(res.data);
          fetchDataRampung();
          onInputClose();
          toast({
            title: "Berhasil!",
            description: "Data Nomor Batch berhasil disimpan.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          // Reset form dan state setelah berhasil

          // Arahkan pengguna ke halaman lain (misalnya daftar obat)
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  // ////////////

  const handleEdit = (item) => {
    setEditMode(item.id);
    setEditedData({
      ...item,
    });
  };

  const handleChange = (e, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = (id) => {
    console.log(editedData);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/update/rincian-bpd`,
        editedData
      )
      .then((res) => {
        setEditMode(null);
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  async function fetchDataRampung() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kwitansi/get/rampung/${
          props.match.params.id
        }`,
        { unitKerjaId: user[0]?.unitKerja_profile.id }
      )
      .then((res) => {
        console.log(res.data);
        setDataRampung(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function hapusBPD(val) {
    console.log(val);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/delete/rincian-bpd`,
        {
          id: val.id,
        }
      )
      .then((res) => {
        console.log(res.data);
        onDeleteClose();
        fetchDataRampung();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataRampung();
  }, [randomNumber]);

  useEffect(() => {
    if (dataRampung?.dataBendahara?.length > 0) {
      setBendaharaSelected(dataRampung.dataBendahara[0]);
    }
  }, [dataRampung]);

  useEffect(() => {
    if (dataRampung?.template?.length > 0) {
      setTemplateId(dataRampung.template[0].id);
    }
  }, [dataRampung]);

  // Kelompokkan rincianBPDs berdasarkan jenis
  const groupedData =
    dataRampung.result?.rincianBPDs?.reduce((acc, item) => {
      const jenis = item.jenisRincianBPD?.jenis;
      if (!acc[jenis]) {
        acc[jenis] = [];
      }
      acc[jenis].push(item);
      return acc;
    }, {}) || {};

  return (
    <Layout>
      {isPrinting && <Loading />}
      <Box pt={"140px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Data Rampung</Heading>
            <Spacer />

            <Center
              height={"50px"}
              borderRadius={"3px"}
              p={"5px"}
              color={"white"}
              w={"160px"}
              bgColor={
                dataRampung?.result?.status.id === 1
                  ? "grey"
                  : dataRampung?.result?.status.id === 2
                  ? "primary"
                  : dataRampung?.result?.status.id === 3
                  ? "ungu"
                  : dataRampung?.result?.status.id === 4
                  ? "oren"
                  : dataRampung?.result?.status.id === 5
              }
            >
              <Text> {dataRampung?.result?.status.statusKuitansi}</Text>
            </Center>
          </HStack>

          <Box p={"30px"}>
            <Flex gap={"30px"}>
              <Box>
                <TambahBuktiKegiatan
                  pic={dataRampung?.result?.perjalanan?.pic}
                  id={dataRampung?.result?.perjalanan?.id}
                  randomNumber={setRandomNumber}
                />
              </Box>
              <Box>
                <Text fontWeight={"600"} fontSize={"18px"}>
                  Nama: {dataRampung?.result?.pegawai?.nama}
                </Text>
                <Text fontWeight={"600"} fontSize={"18px"}>
                  Asal: {dataRampung?.result?.perjalanan?.asal}
                </Text>
                {/* {JSON.stringify(dataRampung?.result?.perjalanan.tanggalPengajuan)}
              {JSON.stringify(user[0]?.unitKerja_profile)}
  
              {JSON.stringify(bendaharaSelected)} */}

                <Text>
                  Status: {dataRampung?.result?.status.statusKuitansi}
                </Text>
                <Text>
                  Catatan: {dataRampung?.result?.catatan || "Tidak Ada Catatan"}
                </Text>
                {dataRampung?.result?.statusId === 3 ? (
                  <FormControl>
                    <FormLabel fontSize={"24px"}>Template</FormLabel>
                    <Select
                      height={"60px"}
                      bgColor={"terang"}
                      borderRadius={"8px"}
                      borderColor={"rgba(229, 231, 235, 1)"}
                      defaultValue={dataRampung?.template?.[0]?.id}
                      onChange={(e) => {
                        setTemplateId(e.target.value);
                      }}
                    >
                      {renderTemplate()}
                    </Select>
                  </FormControl>
                ) : null}
              </Box>
            </Flex>
            {dataRampung?.result?.statusId === 3 ? null : (
              <>
                {/* <FormControl>
                  <FormLabel>Bendahara</FormLabel>
                  <Select
                    mt="10px"
                    border="1px"
                    borderRadius={"8px"}
                    borderColor={"rgba(229, 231, 235, 1)"}
                    value={bendaharaSelected}
                    onChange={(e) => {
                      setBendaharaSelected(parseInt(e.target.value));
                    }}
                  >
                    {renderBendahara()}
                  </Select>
                  {formik.errors.jenis ? (
                    <Alert status="error" color="red" text="center">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      <Text ms="10px">{formik.errors.jenis}</Text>
                    </Alert>
                  ) : null}
                </FormControl> */}
              </>
            )}
            {dataRampung?.result?.statusId === 3 ||
            dataRampung?.result?.statusId === 2 ? null : (
              <Box></Box>
            )}{" "}
            <Flex mt={"30px"} gap={5}>
              <Rill
                data={dataRampung?.daftarRill}
                personilId={dataRampung?.result?.id}
                randomNumber={setRandomNumber}
                status={dataRampung?.result?.statusId}
              />
              {dataRampung?.result?.statusId === 3 ? (
                <Button variant={"primary"} onClick={cetak}>
                  CETAK
                </Button>
              ) : null}
              {dataRampung?.result?.statusId === 3 ||
              dataRampung?.result?.statusId === 2 ? null : (
                <Button onClick={onInputOpen} variant={"primary"}>
                  Tambah +
                </Button>
              )}{" "}
              {dataRampung?.result?.perjalanan?.jenisPerjalanan
                .tipePerjalananId === 1 &&
              dataRampung?.result?.rincianBPDs.length == 0 ? (
                <Button variant={"primary"} onClick={buatOtomatis}>
                  buat otomatis
                </Button>
              ) : null}
            </Flex>
          </Box>
        </Container>
        {/* <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Input Rincian Biaya Perjalanan</Heading>
          </HStack>
        </Container> */}
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          pt={"30px"}
          ps={"0px"}
          mt={"30px"}
        >
          <HStack>
            <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
            <Heading color={"primary"}>Detail Rampung</Heading>
          </HStack>
          <Box p={"30px"} style={{ overflowX: "auto" }}>
            {Object.keys(groupedData).length > 0 ? (
              Object.keys(groupedData).map((jenis) => (
                <Box key={jenis} mt={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    {jenis}
                  </Text>
                  <Table variant="primary" mt={2}>
                    <Thead>
                      <Tr>
                        <Th>item</Th>
                        <Th>Nilai</Th>
                        <Th>Qty</Th>
                        <Th>Satuan</Th> <Th>Bukti</Th>
                        {dataRampung?.result?.statusId === 3 ||
                        dataRampung?.result?.statusId === 2 ? null : (
                          <Th>Aksi</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {groupedData[jenis].map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            {editMode === item.id ? (
                              <Input
                                value={editedData.item}
                                onChange={(e) => handleChange(e, "item")}
                              />
                            ) : (
                              item.item
                            )}
                          </Td>
                          <Td>
                            {editMode === item.id ? (
                              <Input
                                type="number"
                                value={editedData.nilai}
                                onChange={(e) => handleChange(e, "nilai")}
                              />
                            ) : (
                              new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(item.nilai)
                            )}
                          </Td>
                          <Td>
                            {editMode === item.id ? (
                              <Input
                                type="number"
                                value={editedData.qty}
                                onChange={(e) => handleChange(e, "qty")}
                              />
                            ) : (
                              item.qty
                            )}
                          </Td>
                          <Td>
                            {editMode === item.id ? (
                              <Input
                                value={editedData.satuan}
                                onChange={(e) => handleChange(e, "satuan")}
                              />
                            ) : (
                              item.satuan
                            )}
                          </Td>{" "}
                          <Td>
                            {editMode === item.id ? (
                              <Input
                                value={editedData.satuan}
                                onChange={(e) => handleChange(e, "satuan")}
                              />
                            ) : (
                              <Box>
                                <Image
                                  borderRadius={"5px"}
                                  alt="foto obat"
                                  width="120px"
                                  height="80px"
                                  overflow="hiden"
                                  objectFit="cover"
                                  src={
                                    item.bukti
                                      ? import.meta.env
                                          .VITE_REACT_APP_API_BASE_URL +
                                        item.bukti
                                      : Foto
                                  }
                                />
                              </Box>
                            )}
                          </Td>
                          {dataRampung?.result?.statusId === 3 ||
                          dataRampung?.result?.statusId === 2 ? null : (
                            <Td>
                              {editMode === item.id ? (
                                <HStack>
                                  <Button
                                    colorScheme="green"
                                    onClick={() => handleSave(item.id)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    colorScheme="gray"
                                    onClick={() => setEditMode(null)}
                                  >
                                    Cancel
                                  </Button>
                                </HStack>
                              ) : (
                                <HStack>
                                  <Button
                                    colorScheme="blue"
                                    onClick={() => handleEdit(item)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    colorScheme="red"
                                    onClick={() => {
                                      setItemToDelete(item);
                                      onDeleteOpen();
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </HStack>
                              )}
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ))
            ) : (
              <Text>Tidak ada data untuk ditampilkan.</Text>
            )}
          </Box>
          {dataRampung?.result?.statusId === 1 ||
          dataRampung?.result?.statusId == 4 ? (
            <Button
              ms={"30px"}
              mb={"30px"}
              variant={"primary"}
              onClick={() => {
                pengajuan();
              }}
            >
              Ajukan
            </Button>
          ) : null}
        </Container>
      </Box>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="900px">
          <ModalHeader>Rill </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Button
              onClick={() => {
                hapusBPD(itemToDelete);
              }}
              colorScheme="red"
            >
              Hapus
            </Button>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isInputOpen}
        onClose={onInputClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="1200px">
          <ModalHeader>Rill </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Box>
              <FormControl mb={"30px"}>
                <FormLabel fontSize={"24px"}>Item</FormLabel>
                <Input
                  placeholder="Contoh: Hotel"
                  height={"60px"}
                  bgColor={"terang"}
                  type="text"
                  border={"none"}
                  onChange={(e) => {
                    formik.setFieldValue("item", e.target.value);
                  }}
                />
                {formik.errors.item ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{formik.errors.item}</Text>
                  </Alert>
                ) : null}
              </FormControl>
              <FormControl my={"30px"}>
                <FormLabel fontSize={"24px"}>Satuan</FormLabel>
                <Input
                  placeholder="contoh: malam"
                  height={"60px"}
                  bgColor={"terang"}
                  type="text"
                  border={"none"}
                  onChange={(e) => {
                    formik.setFieldValue("satuan", e.target.value);
                  }}
                />
                {formik.errors.satuan ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{formik.errors.satuan}</Text>
                  </Alert>
                ) : null}
              </FormControl>
              <FormControl my={"30px"}>
                {" "}
                <FormLabel fontSize={"24px"}>Quantity</FormLabel>
                <Input
                  placeholder="contoh; 1"
                  height={"60px"}
                  bgColor={"terang"}
                  type="number"
                  border={"none"}
                  onChange={(e) => {
                    formik.setFieldValue("qty", e.target.value);
                  }}
                />
                {formik.errors.qty ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{formik.errors.qty}</Text>
                  </Alert>
                ) : null}
              </FormControl>{" "}
              <FormControl my={"30px"}>
                {" "}
                <FormLabel fontSize={"24px"}>Nilai</FormLabel>
                <Input
                  placeholder="Contoh: 5000000"
                  height={"60px"}
                  bgColor={"terang"}
                  type="number"
                  border={"none"}
                  onChange={(e) => {
                    formik.setFieldValue("nilai", e.target.value);
                  }}
                />
                {formik.errors.nilai ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{formik.errors.nilai}</Text>
                  </Alert>
                ) : null}
              </FormControl>
              <FormControl>
                <FormLabel fontSize={"24px"}>Jenis</FormLabel>
                <Select
                  placeholder="Jenis"
                  height={"60px"}
                  bgColor={"terang"}
                  borderRadius={"8px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  onChange={(e) => {
                    formik.setFieldValue("jenis", parseInt(e.target.value));
                  }}
                >
                  {renderJenis()}
                </Select>
                {formik.errors.jenis ? (
                  <Alert status="error" color="red" text="center">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <Text ms="10px">{formik.errors.jenis}</Text>
                  </Alert>
                ) : null}
              </FormControl>
              <FormControl>
                <Input
                  onChange={handleFile}
                  ref={inputFileRef}
                  accept="image/png, image/jpeg"
                  display="none"
                  type="file"

                  // hidden="hidden"
                />
              </FormControl>{" "}
              <FormControl>
                <Image
                  src={Foto}
                  id="imgpreview"
                  alt="Room image"
                  width="100%"
                  height={{ ss: "210px", sm: "210px", sl: "650px" }}
                  me="10px"
                  mt="20px"
                  overflow="hiden"
                  objectFit="cover"
                />
              </FormControl>{" "}
              <FormControl mt="20px">
                <FormHelperText>Max size: 1MB</FormHelperText>
                <Button
                  variant={"secondary"}
                  w="100%"
                  onClick={() => inputFileRef.current.click()}
                >
                  Add Photo
                </Button>
                {fileSizeMsg ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{fileSizeMsg}</Text>
                  </Alert>
                ) : null}
              </FormControl>{" "}
              <Button onClick={formik.handleSubmit}>submit</Button>
            </Box>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default Rampung;
