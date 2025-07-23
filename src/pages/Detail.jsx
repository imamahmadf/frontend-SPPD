import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import { Spacer, useDisclosure } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Container,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Select,
  Flex,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Loading from "../Componets/Loading";

function Detail(props) {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tambah state loading
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isHapusOpen,
    onOpen: onHapusOpen,
    onClose: onHapusClose,
  } = useDisclosure();
  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );
  async function fetchDataPerjalan() {
    setIsLoading(true); // Set loading true sebelum fetch
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

  async function fetchSubKegiatan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/sub-kegiatan/get-filter/${user[0]?.unitKerja_profile?.id}`
      )
      .then((res) => {
        setDataSubKegiatan(res.data.result);
        console.log(res.data.result, "SUB KEGIATAN");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const history = useHistory();

  useEffect(() => {
    // Jalankan kedua fetch dan set loading false setelah keduanya selesai
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchDataPerjalan(), fetchSubKegiatan()]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  const [pegawaiId, setPegawaiId] = useState(null); // id pegawai baru
  const [personilId, setPersonilId] = useState(null); // id personil yang diedit
  const [pegawaiLamaId, setPegawaiLamaId] = useState(null); // id pegawai lama
  const [personilHapusId, setPersonilHapusId] = useState(null); // id personil yang akan dihapus
  const [namaPegawaiHapus, setNamaPegawaiHapus] = useState(""); // nama pegawai yang akan dihapus
  const [isEditUntukOpen, setIsEditUntukOpen] = useState(false); // modal edit untuk
  const [editUntukValue, setEditUntukValue] = useState(""); // nilai untuk yang diedit
  const [editSubKegiatanId, setEditSubKegiatanId] = useState(null); // nilai sub kegiatan yang diedit

  const handleEditPegawai = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/edit-pegawai`,
        {
          personilId,
          pegawaiBaruId: pegawaiId,
          pegawaiLamaId,
        }
      );
      onEditClose();
      fetchDataPerjalan(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  const handleHapusPersonil = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/hapus/${personilHapusId}`
      );
      onHapusClose();
      fetchDataPerjalan(); // refresh data
    } catch (err) {
      console.error(err);
    }
  };

  // Ambil semua statusId dari personils
  const statusIds = detailPerjalanan?.personils?.map((item) => item.statusId);

  // Cek apakah ada statusId yang 2 atau 3
  const adaStatusDuaAtauTiga = statusIds?.includes(2) || statusIds?.includes(3);

  if (isLoading) return <Loading />;

  return (
    <>
      <Layout>
        <Box>
          <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
            <Flex>
              <Box>
                <Text>Asal: {detailPerjalanan.asal}</Text>
                <Text>Dasar: {detailPerjalanan.dasar || "-"}</Text>
                <Text>Untuk: {detailPerjalanan.untuk}</Text>
                <Text>No. Surat Tugas: {detailPerjalanan.noSuratTugas}</Text>
                <Text>
                  No. Nota Dinas:
                  {detailPerjalanan.isNotaDinas
                    ? detailPerjalanan.noNotaDinas
                    : "-"}
                </Text>
                <Text>
                  No. Telaahan Staf:
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
                  Tanggal Berangkat:
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
                  Tanggal Pulang:
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
                <Text>
                  Sub Kegiatan:
                  {detailPerjalanan?.daftarSubKegiatan?.subKegiatan}
                </Text>
              </Box>
              <Spacer />
              <Box>
                {!adaStatusDuaAtauTiga && (
                  <Button
                    onClick={() => {
                      setEditUntukValue(detailPerjalanan.untuk || "");
                      setEditSubKegiatanId(
                        detailPerjalanan?.daftarSubKegiatan?.id || null
                      );
                      setIsEditUntukOpen(true);
                    }}
                  >
                    edit
                  </Button>
                )}
              </Box>
            </Flex>
          </Container>
          <Container mt={"30px"} variant={"primary"} maxW={"1280px"} p={"30px"}>
            {detailPerjalanan?.personils?.map((item, index) => {
              return (
                <>
                  <Box
                    borderRadius={"5px"}
                    border={"1px"}
                    borderColor={"gray.800"}
                    p={"10px"}
                    my={"15px"}
                  >
                    <HStack>
                      <Box>
                        <Text>Nama: {item.pegawai.nama}</Text>
                        <Text>Nomor SPD: {item.nomorSPD}</Text>
                      </Box>
                      <Spacer />
                      <Flex gap={2}>
                        <Button
                          variant={"primary"}
                          onClick={() => {
                            history.push(`/rampung/${item.id}`);
                          }}
                        >
                          Rampung
                        </Button>

                        {item.statusId !== 2 && item.statusId !== 3 ? (
                          <>
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                setPersonilId(item.id);
                                setPegawaiLamaId(item.pegawai.id);
                                onEditOpen();
                              }}
                            >
                              edit
                            </Button>
                            <Button
                              variant={"cancle"}
                              onClick={() => {
                                setPersonilHapusId(item.id);
                                setNamaPegawaiHapus(item.pegawai.nama);
                                onHapusOpen();
                              }}
                            >
                              X
                            </Button>
                          </>
                        ) : null}
                      </Flex>
                    </HStack>
                  </Box>
                </>
              );
            })}
          </Container>
        </Box>

        <Modal
          closeOnOverlayClick={false}
          isOpen={isEditOpen}
          onClose={onEditClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="800px">
            <ModalHeader>Edit Personil</ModalHeader>
            <ModalCloseButton />
            <Box p={"30px"}>
              <FormControl my={"10px"}>
                <FormLabel fontSize={"24px"}>Nama Pegawai</FormLabel>
                <AsyncSelect
                  loadOptions={async (inputValue) => {
                    if (!inputValue) return [];
                    try {
                      const res = await axios.get(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/pegawai/search?q=${inputValue}`
                      );

                      const filtered = res.data.result;

                      return filtered.map((val) => ({
                        value: val.id,
                        label: val.nama,
                      }));
                    } catch (err) {
                      console.error("Failed to load options:", err.message);
                      return [];
                    }
                  }}
                  placeholder="Ketik Nama Pegawai"
                  onChange={(selectedOption) => {
                    setPegawaiId(selectedOption.value);
                  }}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  chakraStyles={{
                    container: (provided) => ({
                      ...provided,
                      borderRadius: "6px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "terang",
                      border: "0px",
                      height: "60px",
                      _hover: { borderColor: "yellow.700" },
                      minHeight: "40px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      bg: state.isFocused ? "primary" : "white",
                      color: state.isFocused ? "white" : "black",
                    }),
                  }}
                />
              </FormControl>
            </Box>
            <ModalFooter pe={"30px"} pb={"30px"}>
              <Button variant={"primary"} onClick={handleEditPegawai}>
                Simpan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Hapus Personil */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isHapusOpen}
          onClose={onHapusClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="500px">
            <ModalHeader>Konfirmasi Hapus Personil</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text>
                Apakah Anda yakin ingin menghapus personil
                <Text as="span" fontWeight="bold">
                  {namaPegawaiHapus}
                </Text>
                dari perjalanan ini?
              </Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Tindakan ini tidak dapat dibatalkan.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant={"cancle"} onClick={handleHapusPersonil} mr={3}>
                Ya, Hapus
              </Button>
              <Button onClick={onHapusClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal Edit Untuk */}
        <Modal
          isOpen={isEditUntukOpen}
          onClose={() => setIsEditUntukOpen(false)}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="500px">
            <ModalHeader>Edit Perjalanan</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl mb={4}>
                <FormLabel>Untuk</FormLabel>
                <Input
                  as="textarea"
                  value={editUntukValue}
                  onChange={(e) => setEditUntukValue(e.target.value)}
                  minH="100px"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Sub Kegiatan</FormLabel>
                <Select
                  placeholder="Pilih Sub Kegiatan"
                  value={editSubKegiatanId || ""}
                  onChange={(e) => setEditSubKegiatanId(e.target.value)}
                >
                  {dataSubKegiatan &&
                    dataSubKegiatan.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.subKegiatan}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                variant={"primary"}
                onClick={async () => {
                  try {
                    await axios.post(
                      `${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/perjalanan/edit/${props.match.params.id}`,
                      {
                        untuk: editUntukValue,
                        subKegiatanId: editSubKegiatanId,
                      }
                    );
                    setIsEditUntukOpen(false);
                    fetchDataPerjalan();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Simpan
              </Button>
              <Button ml={3} onClick={() => setIsEditUntukOpen(false)}>
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default Detail;
