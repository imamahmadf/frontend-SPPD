import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import Foto from "../../assets/add_photo.png";
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
  Tfoot,
  Divider,
  Flex,
  Textarea,
  Tooltip,
  Input,
  Spacer,
  useToast,
  useColorMode,
  VStack,
  Checkbox,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Icon,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDisclosure } from "@chakra-ui/react";
import { BsEyeFill } from "react-icons/bs";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaBoxes,
  FaBuilding,
  FaInfoCircle,
  FaPlus,
  FaList,
  FaTag,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import { MdDescription, MdAttachMoney, MdInventory2 } from "react-icons/md";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";
import LayoutAset from "../../Componets/Aset/LayoutAset";

function PageSectionHeader({ number, title, subtitle, colorMode }) {
  return (
    <Box mb={{ base: 5, md: 8 }}>
      <Flex align="center" gap={{ base: 3, md: 4 }}>
        <Box
          bgColor="aset"
          color="white"
          w={{ base: "40px", md: "56px" }}
          h={{ base: "40px", md: "56px" }}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          fontSize={{ base: "lg", md: "2xl" }}
          boxShadow="md"
          flexShrink={0}
        >
          {number}
        </Box>
        <Box flex={1} minW={0}>
          <Heading
            size={{ base: "md", md: "xl" }}
            color={colorMode === "dark" ? "white" : "gray.800"}
            mb={1}
            lineHeight="short"
          >
            {title}
          </Heading>
          <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
            {subtitle}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

function StatCard({ colorMode, icon, label, value, help, compactValue }) {
  return (
    <Box
      bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
      p={{ base: 3, md: 4 }}
      borderRadius="12px"
      borderLeft="4px solid"
      borderColor="aset"
      boxShadow="sm"
      minW={0}
    >
      <Stat>
        <StatLabel fontSize="xs" color="gray.600" noOfLines={1}>
          <Icon as={icon} mr={1} color="aset" />
          {label}
        </StatLabel>
        <StatNumber
          fontSize={
            compactValue
              ? { base: "sm", md: "lg" }
              : { base: "lg", md: "2xl" }
          }
          color={colorMode === "dark" ? "white" : "gray.800"}
          wordBreak="break-word"
          lineHeight="short"
        >
          {value}
        </StatNumber>
        <StatHelpText
          fontSize="xs"
          color="gray.500"
          mb={0}
          display={{ base: "none", md: "block" }}
        >
          {help}
        </StatHelpText>
      </Stat>
    </Box>
  );
}

function MobileModalFooter({
  onCancel,
  onSubmit,
  isLoading,
  isDisabled,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  loadingText = "Menyimpan",
  submitColorScheme,
  leftIcon,
}) {
  return (
    <ModalFooter
      flexDir={{ base: "column-reverse", md: "row" }}
      gap={2}
      px={{ base: 4, md: 6 }}
    >
      <Button
        variant="ghost"
        onClick={onCancel}
        w={{ base: "full", md: "auto" }}
        isDisabled={isLoading}
        minH="44px"
      >
        {cancelLabel}
      </Button>
      <Button
        variant={submitColorScheme ? undefined : "primary"}
        colorScheme={submitColorScheme}
        onClick={onSubmit}
        isLoading={isLoading}
        loadingText={loadingText}
        isDisabled={isDisabled}
        w={{ base: "full", md: "auto" }}
        minH="44px"
        leftIcon={isLoading ? undefined : leftIcon}
      >
        {submitLabel}
      </Button>
    </ModalFooter>
  );
}

function BarjasPickCards({
  items,
  isSelected,
  getJumlah,
  onToggle,
  onJumlahChange,
  isDisabled,
  formatRupiah,
  colorMode,
}) {
  return (
    <VStack spacing={3} align="stretch" display={{ base: "flex", md: "none" }}>
      {items.map((item) => {
        const selected = isSelected(item.id);
        const qty = getJumlah(item.id);
        return (
          <Box
            key={item.id}
            p={3}
            borderWidth="1px"
            borderRadius="12px"
            borderColor={selected ? "aset" : colorMode === "dark" ? "gray.600" : "gray.200"}
            bgColor={
              selected
                ? colorMode === "dark"
                  ? "gray.700"
                  : "blue.50"
                : "transparent"
            }
          >
            <Flex gap={3} align="flex-start">
              <Checkbox
                mt={1}
                isChecked={selected}
                onChange={() => onToggle(item.id, Number(item?.jumlah || 1))}
                colorScheme="green"
                isDisabled={isDisabled}
                size="lg"
              />
              <Box flex={1} minW={0}>
                <Text fontWeight="semibold" wordBreak="break-word">
                  {item?.nama || "-"}
                </Text>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  {item?.jenisBarja?.jenis || "-"} •{" "}
                  {formatRupiah(Number(item?.harga || 0))}
                </Text>
                <Flex gap={3} align="center">
                  <FormControl maxW="120px">
                    <FormLabel fontSize="xs" mb={1}>
                      Jumlah
                    </FormLabel>
                    <Input
                      height="40px"
                      type="text"
                      inputMode="numeric"
                      value={qty}
                      onChange={(e) => {
                        const digits = e.target.value
                          .toString()
                          .replace(/[^0-9]/g, "");
                        const parsed = digits ? parseInt(digits, 10) : 0;
                        onJumlahChange(item.id, parsed || 0, Number(item?.jumlah || 1));
                      }}
                      isDisabled={isDisabled || !selected}
                    />
                  </FormControl>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Subtotal
                    </Text>
                    <Text fontWeight="bold" color="aset" fontSize="sm">
                      {formatRupiah(Number(item?.harga || 0) * Number(qty || 0))}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
}

function DetailSP(props) {
  const [dataDokumen, setDataDokumen] = useState([]);
  const history = useHistory();
  const [dataJenisBarjas, setDataJenisBarjas] = useState(null);
  const [dataJenisDokumen, setDataJenisDokumen] = useState(null); 
  const [dataAkunBelanja, setDataAkunBelanja] = useState(null);
  const toast = useToast();
  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    fallback;
  const { colorMode, toggleColorMode } = useColorMode();
  const [jenisDokumenId, setJenisDokumenId] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [dokumenEdit, setDokumenEdit] = useState(null);
  const [tanggalEditValue, setTanggalEditValue] = useState("");
  const [nomorEditValue, setNomorEditValue] = useState("");
  const [jenisDokumenEditId, setJenisDokumenEditId] = useState(null);
  const [selectedBarjasEdit, setSelectedBarjasEdit] = useState([]);
  const [isSavingDokumen, setIsSavingDokumen] = useState(false);
  const [daftarBarjas, setDaftarBarjas] = useState([
    {
      jenisBarjasId: null,
      nama: "",
      harga: 0,
      jumlah: 1,
      SPId: props.match.params.id,
    },
  ]);
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();
  const {
    isOpen: isPilihBarjasOpen,
    onOpen: onPilihBarjasOpen,
    onClose: onPilihBarjasClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditDokumenOpen,
    onOpen: onEditDokumenOpen,
    onClose: onEditDokumenClose,
  } = useDisclosure();
  const {
    isOpen: isEditBarjasOpen,
    onOpen: onEditBarjasOpen,
    onClose: onEditBarjasClose,
  } = useDisclosure();
  const [selectedBarjas, setSelectedBarjas] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [barjasEdit, setBarjasEdit] = useState(null);
  const [isSavingBarjas, setIsSavingBarjas] = useState(false);
  const {
    isOpen: isEditSPOpen,
    onOpen: onEditSPOpen,
    onClose: onEditSPClose,
  } = useDisclosure();
  const [spEdit, setSpEdit] = useState(null);
  const [isSavingSP, setIsSavingSP] = useState(false);
  const [isAddingBarjas, setIsAddingBarjas] = useState(false);
  const [isAddingDokumen, setIsAddingDokumen] = useState(false);
  const [isDeletingBarjas, setIsDeletingBarjas] = useState(false);
  const {
    isOpen: isDeleteDokumenOpen,
    onOpen: onDeleteDokumenOpen,
    onClose: onDeleteDokumenClose,
  } = useDisclosure();
  const [dokumenToDelete, setDokumenToDelete] = useState(null);
  const [isDeletingDokumen, setIsDeletingDokumen] = useState(false);

  const toDateInputValue = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const openEditDokumen = (dokumen) => {
    setDokumenEdit(dokumen);
    setTanggalEditValue(toDateInputValue(dokumen?.tanggal));
    setNomorEditValue(dokumen?.nomor || "");
    setJenisDokumenEditId(dokumen?.jenisDokumenBarjasId || null);
    setSelectedBarjasEdit(
      (dokumen?.itemDokumenBarjas || []).map((it) => ({
        id: it.barjasId,
        jumlah: Number(it?.jumlah || 1),
      })),
    );
    onEditDokumenOpen();
  };

  const closeEditDokumen = () => {
    if (isSavingDokumen) return;
    onEditDokumenClose();
    setDokumenEdit(null);
    setTanggalEditValue("");
    setNomorEditValue("");
    setJenisDokumenEditId(null);
    setSelectedBarjasEdit([]);
  };

  const isBarjasEditSelected = (barjasId) =>
    selectedBarjasEdit.some((b) => b.id === barjasId);

  const getBarjasEditJumlah = (barjasId) => {
    const found = selectedBarjasEdit.find((b) => b.id === barjasId);
    return found?.jumlah ?? 1;
  };

  const setBarjasEditJumlah = (barjasId, jumlah) => {
    setSelectedBarjasEdit((prev) =>
      prev.map((b) => (b.id === barjasId ? { ...b, jumlah } : b)),
    );
  };

  const handleToggleBarjasEdit = (barjasId, defaultJumlah = 1) => {
    setSelectedBarjasEdit((prev) => {
      if (prev.some((b) => b.id === barjasId)) {
        return prev.filter((b) => b.id !== barjasId);
      }
      return [...prev, { id: barjasId, jumlah: defaultJumlah }];
    });
  };

  const daftarBarjasEdit = (() => {
    const map = new Map();
    (dataDokumen?.barjas || []).forEach((item) => map.set(item.id, item));
    (dokumenEdit?.itemDokumenBarjas || []).forEach((it) => {
      if (!map.has(it.barjasId) && it.barja) {
        map.set(it.barjasId, it.barja);
      }
    });
    return Array.from(map.values());
  })();

  const handleSelectAllBarjasEdit = () => {
    if (selectedBarjasEdit.length === daftarBarjasEdit.length) {
      setSelectedBarjasEdit([]);
    } else {
      setSelectedBarjasEdit(
        daftarBarjasEdit.map((item) => {
          const existing = selectedBarjasEdit.find((b) => b.id === item.id);
          return {
            id: item.id,
            jumlah: existing?.jumlah ?? Number(item?.jumlah || 1),
          };
        }),
      );
    }
  };

  const submitEditDokumen = () => {
    if (!dokumenEdit?.id) {
      toast({
        title: "Data belum lengkap",
        description: "Data dokumen tidak valid",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!jenisDokumenEditId) {
      toast({
        title: "Data belum lengkap",
        description: "Jenis surat wajib dipilih",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!nomorEditValue.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Nomor dokumen wajib diisi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!tanggalEditValue) {
      toast({
        title: "Data belum lengkap",
        description: "Tanggal surat wajib diisi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (selectedBarjasEdit.length === 0) {
      toast({
        title: "Data belum lengkap",
        description: "Pilih minimal satu barang dan jasa",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (isSavingDokumen) return;
    setIsSavingDokumen(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/edit/dokumen`,
        {
          id: dokumenEdit.id,
          tanggal: tanggalEditValue,
          nomor: nomorEditValue.trim(),
          jenisDokumenBarjasId: jenisDokumenEditId,
          barjasData: selectedBarjasEdit.map((b) => ({
            barjasId: b.id,
            jumlah: b.jumlah,
          })),
        },
      )
      .then(async () => {
        toast({
          title: "Berhasil!",
          description: "Dokumen berhasil diupdate.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchDataDokumen();
        onEditDokumenClose();
        setDokumenEdit(null);
        setTanggalEditValue("");
        setNomorEditValue("");
        setJenisDokumenEditId(null);
        setSelectedBarjasEdit([]);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal menyimpan",
          description: getErrorMessage(err, "Dokumen gagal diupdate."),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSavingDokumen(false);
      });
  };

  async function fetchDataDokumen() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/dokumen/${
          props.match.params.id
        }`,
      )
      .then((res) => {
        setDataDokumen(res.data.result);

        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal memuat data",
          description: getErrorMessage(
            err,
            "Data surat pesanan gagal dimuat. Coba muat ulang halaman.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }
  const handlePilihBarjas = () => {
    // Validasi form sebelum membuka modal
    if (!jenisDokumenId) {
      toast({
        title: "Data belum lengkap",
        description: "Pilih jenis surat terlebih dahulu",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!tanggal) {
      toast({
        title: "Data belum lengkap",
        description: "Pilih tanggal terlebih dahulu",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // Reset selected barjas dan buka modal
    setSelectedBarjas([]);
    onPilihBarjasOpen();
  };

  const isBarjasSelected = (barjasId) =>
    selectedBarjas.some((b) => b.id === barjasId);

  const getBarjasJumlah = (barjasId) => {
    const found = selectedBarjas.find((b) => b.id === barjasId);
    return found?.jumlah ?? 1;
  };

  const setBarjasJumlah = (barjasId, jumlah) => {
    setSelectedBarjas((prev) =>
      prev.map((b) => (b.id === barjasId ? { ...b, jumlah } : b)),
    );
  };

  const handleToggleBarjas = (barjasId, defaultJumlah = 1) => {
    setSelectedBarjas((prev) => {
      if (prev.some((b) => b.id === barjasId)) {
        return prev.filter((b) => b.id !== barjasId);
      } else {
        return [...prev, { id: barjasId, jumlah: defaultJumlah }];
      }
    });
  };

  const handleSelectAllBarjas = () => {
    if (selectedBarjas.length === (dataDokumen?.barjas?.length || 0)) {
      setSelectedBarjas([]);
    } else {
      setSelectedBarjas(
        (dataDokumen?.barjas || []).map((item) => ({
          id: item.id,
          jumlah: Number(item?.jumlah || 1),
        })),
      );
    }
  };

  const tambahDokumen = () => {
    if (isAddingDokumen) return;
    if (selectedBarjas.length === 0) {
      toast({
        title: "Data belum lengkap",
        description: "Pilih minimal satu barang dan jasa",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsAddingDokumen(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/barjas/post/tambah-dokumen`,
        {
          SPId: props.match.params.id,
          jenisDokumenBarjasId: jenisDokumenId,
          tanggal,
          indukUnitKerjaId: user[0]?.unitKerja_profile?.indukUnitKerja?.id,
          barjasData: selectedBarjas.map((b) => ({
            barjasId: b.id,
            jumlah: b.jumlah,
          })),
        },
      )
      .then(async (res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil",
          description: "Dokumen barang dan jasa berhasil ditambahkan.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchDataDokumen();
        onPilihBarjasClose();
        setSelectedBarjas([]);
        setJenisDokumenId(null);
        setTanggal("");
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal menyimpan",
          description: getErrorMessage(
            err,
            "Dokumen barang dan jasa gagal ditambahkan.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsAddingDokumen(false);
      });
  };

  const tambahBarjas = () => {
    if (isAddingBarjas) return;
    const itemKosong = daftarBarjas.findIndex(
      (item) =>
        !item.jenisBarjasId ||
        !String(item.nama || "").trim() ||
        !Number(item.jumlah) ||
        !Number(item.harga),
    );
    if (itemKosong !== -1) {
      toast({
        title: "Data belum lengkap",
        description: `Lengkapi jenis, nama, jumlah, dan harga pada item ${
          itemKosong + 1
        }.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsAddingBarjas(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/post/barjas`,
        {
          data: daftarBarjas,
        },
      )
      .then(async (res) => {
        console.log(res.status, res.data, "tessss");
        toast({
          title: "Berhasil",
          description: "Barang dan jasa berhasil disimpan.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchDataDokumen();
        setDaftarBarjas([
          {
            jenisBarjasId: null,
            nama: "",
            harga: 0,
            jumlah: 1,
            SPId: props.match.params.id,
          },
        ]);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal menyimpan",
          description: getErrorMessage(
            err,
            "Barang dan jasa gagal disimpan.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsAddingBarjas(false);
      });
  };

  async function fetchSeed() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/seed-detail`,
      )
      .then((res) => {
        setDataJenisBarjas(res.data.resultJenisBarjas);
        setDataJenisDokumen(res.data.resultJenisDokumenBarjas);
        setDataAkunBelanja(res.data.resultAkunBelanja);

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal memuat data",
          description: getErrorMessage(
            err,
            "Data master gagal dimuat. Coba muat ulang halaman.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    fetchDataDokumen();
    fetchSeed();
  }, []);

  const handleBarjasChange = (index, field, value) => {
    setDaftarBarjas((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addBarjasRow = () => {
    setDaftarBarjas((prev) => [
      ...prev,
      {
        jenisBarjasId: null,
        nama: "",
        harga: 0,
        jumlah: 1,
        SPId: props.match.params.id,
      },
    ]);
  };

  const removeBarjasRow = (index) => {
    setDaftarBarjas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteBarjas = (item) => {
    setItemToDelete(item);
    onDeleteOpen();
  };

  const handleDeleteDokumen = (dokumen) => {
    setDokumenToDelete(dokumen);
    onDeleteDokumenOpen();
  };

  const openEditBarjas = (item) => {
    setBarjasEdit({
      id: item.id,
      nama: item?.nama || "",
      jenisBarjasId: item?.jenisBarjasId || item?.jenisBarja?.id || null,
      jumlah: Number(item?.jumlah || 0),
      harga: Number(item?.harga || 0),
    });
    onEditBarjasOpen();
  };

  const closeEditBarjas = () => {
    if (isSavingBarjas) return;
    onEditBarjasClose();
    setBarjasEdit(null);
  };

  const handleBarjasEditChange = (field, value) => {
    setBarjasEdit((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const submitEditBarjas = () => {
    if (!barjasEdit?.id) {
      toast({
        title: "Data belum lengkap",
        description: "Data item tidak valid",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!barjasEdit.jenisBarjasId) {
      toast({
        title: "Data belum lengkap",
        description: "Jenis barang dan jasa wajib dipilih",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!barjasEdit.nama?.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Nama barang dan jasa wajib diisi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (isSavingBarjas) return;
    setIsSavingBarjas(true);
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/edit/barjas`, {
        id: barjasEdit.id,
        nama: barjasEdit.nama.trim(),
        jenisBarjasId: barjasEdit.jenisBarjasId,
        jumlah: Number(barjasEdit.jumlah || 0),
        harga: Number(barjasEdit.harga || 0),
      })
      .then(async () => {
        toast({
          title: "Berhasil!",
          description: "Data barang dan jasa berhasil diupdate.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchDataDokumen();
        onEditBarjasClose();
        setBarjasEdit(null);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal menyimpan",
          description: getErrorMessage(
            err,
            "Data barang dan jasa gagal diupdate.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSavingBarjas(false);
      });
  };

  const openEditSP = () => {
    const unitKerjaNama =
      dataDokumen?.subKegPer?.daftarUnitKerja?.unitKerja || "";
    const subKegNama = dataDokumen?.subKegPer?.nama || "";
    setSpEdit({
      id: dataDokumen?.id,
      nomor: dataDokumen?.nomor || "",
      tanggal: toDateInputValue(dataDokumen?.tanggal),
      rekananId: dataDokumen?.rekananId || dataDokumen?.rekanan?.id || null,
      rekananLabel: dataDokumen?.rekanan?.nama || "",
      akunBelanjaId:
        dataDokumen?.akunBelanjaId || dataDokumen?.akunBelanja?.id || null,
      subKegPerId:
        dataDokumen?.subKegPerId || dataDokumen?.subKegPer?.id || null,
      subKegPerLabel:
        subKegNama && unitKerjaNama
          ? `${subKegNama} - ${unitKerjaNama}`
          : subKegNama || "",
      unitKerjaId:
        dataDokumen?.unitKerjaId || dataDokumen?.subKegPer?.unitKerjaId || null,
    });
    onEditSPOpen();
  };

  const closeEditSP = () => {
    if (isSavingSP) return;
    onEditSPClose();
    setSpEdit(null);
  };

  const handleSPEditChange = (field, value) => {
    setSpEdit((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const submitEditSP = () => {
    if (!spEdit?.id) {
      toast({
        title: "Data belum lengkap",
        description: "Data surat pesanan tidak valid",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!spEdit.nomor?.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Nomor surat wajib diisi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!spEdit.tanggal) {
      toast({
        title: "Data belum lengkap",
        description: "Tanggal surat wajib diisi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!spEdit.akunBelanjaId) {
      toast({
        title: "Data belum lengkap",
        description: "Akun belanja wajib dipilih",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!spEdit.subKegPerId) {
      toast({
        title: "Data belum lengkap",
        description: "Sub kegiatan wajib dipilih",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (isSavingSP) return;
    setIsSavingSP(true);
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/edit/sp`, {
        id: spEdit.id,
        nomor: spEdit.nomor.trim(),
        tanggal: spEdit.tanggal,
        rekananId: spEdit.rekananId,
        akunBelanjaId: spEdit.akunBelanjaId,
        subKegPerId: spEdit.subKegPerId,
        unitKerjaId: spEdit.unitKerjaId,
      })
      .then(async () => {
        toast({
          title: "Berhasil!",
          description: "Informasi surat pesanan berhasil diupdate.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchDataDokumen();
        onEditSPClose();
        setSpEdit(null);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal menyimpan",
          description: getErrorMessage(
            err,
            "Informasi surat pesanan gagal diupdate.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSavingSP(false);
      });
  };

  const confirmDeleteBarjas = () => {
    if (!itemToDelete || isDeletingBarjas) return;

    setIsDeletingBarjas(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/delete/barjas`,
        {
          id: itemToDelete.id,
        },
      )
      .then(async () => {
        toast({
          title: "Berhasil!",
          description: "Item berhasil dihapus.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchDataDokumen();
        onDeleteClose();
        setItemToDelete(null);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Gagal menghapus",
          description: getErrorMessage(
            err,
            "Barang dan jasa gagal dihapus.",
          ),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsDeletingBarjas(false);
      });
  };

  const confirmDeleteDokumen = () => {
    if (!dokumenToDelete?.id || isDeletingDokumen) return;

    setIsDeletingDokumen(true);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/delete/dokumen`,
        { id: dokumenToDelete.id },
      )
      .then(async () => {
        toast({
          title: "Berhasil!",
          description: "Dokumen berhasil dihapus.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        if (dokumenEdit?.id === dokumenToDelete.id) {
          closeEditDokumen();
        }
        await fetchDataDokumen();
        onDeleteDokumenClose();
        setDokumenToDelete(null);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal menghapus",
          description: getErrorMessage(err, "Dokumen gagal dihapus."),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsDeletingDokumen(false);
      });
  };

  const formatRupiah = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseRupiah = (str) => {
    if (!str) return 0;
    const onlyDigits = str.toString().replace(/[^0-9]/g, "");
    return onlyDigits ? parseInt(onlyDigits, 10) : 0;
  };
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const selectPortalProps = {
    menuPosition: "fixed",
    menuPortalTarget:
      typeof document !== "undefined" ? document.body : undefined,
    styles: {
      menuPortal: (base) => ({ ...base, zIndex: 20000 }),
    },
    chakraStyles: {
      menuPortal: (provided) => ({ ...provided, zIndex: 20000 }),
    },
  };

  const getIndukUnitKerjaId = () =>
    user[0]?.unitKerja_profile?.indukUnitKerja?.id ||
    user[0]?.unitKerja_profile?.id ||
    "";

  const loadSubKegiatanOptions = async (inputValue = "") => {
    try {
      const indukId = getIndukUnitKerjaId();
      const params = new URLSearchParams({
        q: String(inputValue || "").trim(),
      });
      if (indukId) params.set("indukUnitKerjaId", String(indukId));
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/barjas/get/sub-kegiatan/search?${params.toString()}`,
      );
      return (res.data.result || []).map((val) => ({
        value: val.id,
        label: `${val.nama}${
          val.daftarUnitKerja?.unitKerja
            ? ` - ${val.daftarUnitKerja.unitKerja}`
            : ""
        }`,
        unitKerjaId: val.unitKerjaId || val.daftarUnitKerja?.id || null,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const formatTanggalIndo = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString(
        "id-ID",
        isMobile
          ? { day: "numeric", month: "short", year: "numeric" }
          : {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            },
      );
    } catch (_) {
      return iso;
    }
  };
  const totalBerjalan = (daftarBarjas || []).reduce(
    (sum, it) => sum + Number(it?.harga || 0) * Number(it?.jumlah || 0),
    0,
  );

  // Hitung statistik
  const totalDokumen = dataDokumen?.dokumenBarjas?.length || 0;
  const totalItemBarjas = dataDokumen?.barjas?.length || 0;
  const totalNominal = (dataDokumen?.barjas || []).reduce(
    (sum, it) => sum + Number(it?.harga || 0) * Number(it?.jumlah || 0),
    0,
  );
  const totalJumlahBarang = (dataDokumen?.barjas || []).reduce(
    (sum, it) => sum + Number(it?.jumlah || 0),
    0,
  );
  const isMutating =
    isAddingBarjas ||
    isAddingDokumen ||
    isDeletingBarjas ||
    isDeletingDokumen ||
    isSavingDokumen ||
    isSavingBarjas ||
    isSavingSP;
  const mutatingLabel = isDeletingBarjas || isDeletingDokumen
    ? "Menghapus data..."
    : isAddingBarjas || isAddingDokumen
      ? "Menyimpan data..."
      : "Menyimpan perubahan...";

  return (
    <>
      <LayoutAset>
        {/* Bagian 1: Informasi Surat Pesanan */}
        <Box
          pb={{ base: 6, md: 12 }}
          px={{ base: 3, md: "30px" }}
          position="relative"
          overflowX="hidden"
        >
          <Container
            bgColor={colorMode === "dark" ? "gray.900" : "white"}
            maxW="1280px"
            p={{ base: 4, md: 8 }}
            borderRadius={{ base: "16px", md: "12px" }}
          >
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Icon as={FaArrowLeft} />}
              onClick={() => history.push("/barjas/daftar-dokumen-sp")}
              mb={{ base: 4, md: 6 }}
              px={0}
              color="gray.600"
              minH="40px"
            >
              Kembali ke daftar
            </Button>
            <PageSectionHeader
              number="1"
              title="Informasi Surat Pesanan"
              subtitle="Ringkasan dan statistik surat pesanan"
              colorMode={colorMode}
            />
            {/* Statistik Ringkas */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 2, md: 4 }} mb={6}>
              <StatCard
                colorMode={colorMode}
                icon={FaFileAlt}
                label="Dokumen"
                value={totalDokumen}
                help="Dokumen Barjas"
              />
              <StatCard
                colorMode={colorMode}
                icon={MdInventory2}
                label="Item"
                value={totalItemBarjas}
                help="Barang & Jasa"
              />
              <StatCard
                colorMode={colorMode}
                icon={FaBoxes}
                label="Jumlah"
                value={totalJumlahBarang.toLocaleString("id-ID")}
                help="Total Unit"
              />
              <StatCard
                colorMode={colorMode}
                icon={MdAttachMoney}
                label="Nominal"
                value={formatRupiah(totalNominal).replace("Rp", "").trim()}
                help="Nilai Total"
                compactValue
              />
            </SimpleGrid>

            {/* Ringkasan Surat Card */}
            <Box
              bgColor={{
                base: "transparent",
                md: colorMode === "dark" ? "gray.800" : "white",
              }}
              p={{ base: 0, md: 6 }}
              borderRadius="12px"
              boxShadow={{ base: "none", md: "md" }}
              mb={0}
              borderLeft={{ base: "none", md: "4px solid" }}
              borderColor="aset"
            >
              <Flex
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                mb={4}
                gap={3}
                flexWrap="wrap"
              >
                <Flex align="center" minW={0} flex="1">
                  <Icon as={FaInfoCircle} color="aset" mr={2} boxSize={5} />
                  <Heading size={{ base: "sm", md: "md" }} color="aset">
                    Data Surat Pesanan
                  </Heading>
                </Flex>
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<Icon as={FaEdit} />}
                  onClick={openEditSP}
                  w={{ base: "full", sm: "auto" }}
                  minH="44px"
                >
                  Edit Data
                </Button>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box
                  p={3}
                  borderRadius="8px"
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={FaFileAlt} color="aset" mr={2} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="semibold"
                      textTransform="uppercase"
                    >
                      Nomor Surat
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                    wordBreak="break-word"
                  >
                    {dataDokumen?.nomor || "-"}
                  </Text>
                </Box>
                <Box
                  p={3}
                  borderRadius="8px"
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={FaCalendarAlt} color="aset" mr={2} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="semibold"
                      textTransform="uppercase"
                    >
                      Tanggal Surat
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                  >
                    {formatTanggalIndo(dataDokumen?.tanggal)}
                  </Text>
                </Box>
                <Box
                  p={3}
                  borderRadius="8px"
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={FaTag} color="aset" mr={2} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="semibold"
                      textTransform="uppercase"
                    >
                      Akun Belanja
                    </Text>
                  </Flex>
                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    fontWeight="bold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                    wordBreak="break-word"
                  >
                    {dataDokumen?.akunBelanja?.akun || "-"}
                  </Text>
                </Box>
                <Box
                  p={3}
                  borderRadius="8px"
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={MdDescription} color="aset" mr={2} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="semibold"
                      textTransform="uppercase"
                    >
                      Sub Kegiatan
                    </Text>
                  </Flex>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                    noOfLines={2}
                  >
                    {dataDokumen?.subKegPer?.nama || "-"}
                  </Text>
                </Box>
                <Box
                  p={3}
                  borderRadius="8px"
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={FaBuilding} color="aset" mr={2} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="semibold"
                      textTransform="uppercase"
                    >
                      Rekanan
                    </Text>
                  </Flex>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                  >
                    {dataDokumen?.rekanan?.nama || "-"}
                  </Text>
                </Box>
                <Box
                  p={3}
                  borderRadius="8px"
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={FaBuilding} color="aset" mr={2} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontWeight="semibold"
                      textTransform="uppercase"
                    >
                      Unit Kerja
                    </Text>
                  </Flex>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                  >
                    {dataDokumen?.subKegPer?.daftarUnitKerja?.unitKerja || "-"}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Container>
        </Box>

        {/* Bagian 2: Input Barang dan Jasa + Daftar Barang dan Jasa */}
        <Box
          bgColor={colorMode === "dark" ? "gray.900" : "terang"}
          pb={{ base: 6, md: 12 }}
          px={{ base: 3, md: "30px" }}
          pt={{ base: 6, md: 12 }}
          position="relative"
          overflowX="hidden"
        >
          <Container
            bgColor={colorMode === "dark" ? "gray.900" : "white"}
            maxW="1280px"
            borderRadius={{ base: "16px", md: "12px" }}
            p={{ base: 4, md: 12 }}
          >
            <PageSectionHeader
              number="2"
              title="Barang dan Jasa"
              subtitle="Input dan kelola daftar barang dan jasa"
              colorMode={colorMode}
            />
            {/* Form Input Barang dan Jasa */}
            <Box
              bgColor={colorMode === "dark" ? "gray.800" : "white"}
              p={{ base: 4, md: 6 }}
              borderRadius="12px"
              boxShadow="md"
              mb={6}
              borderTop="4px solid"
              borderColor="aset"
            >
              <Flex align="center" mb={4}>
                <Icon as={MdInventory2} color="aset" mr={2} boxSize={5} />
                <Heading size={{ base: "sm", md: "md" }} color="aset">
                  Input Barang dan Jasa
                </Heading>
              </Flex>

              {daftarBarjas.map((item, index) => (
                <Box
                  key={index}
                  mt={index > 0 ? 4 : 0}
                  p={4}
                  borderWidth="2px"
                  borderRadius="12px"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  bg={colorMode === "dark" ? "gray.700" : "terang"}
                >
                  <Flex align="center" mb={4} justify="space-between">
                    <Flex align="center">
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        mr={2}
                        fontSize="md"
                        p={2}
                        borderRadius="md"
                      >
                        Item {index + 1}
                      </Badge>
                    </Flex>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Jenis Barang dan Jasa
                      </FormLabel>
                      <Select2
                        {...selectPortalProps}
                        value={
                          item.jenisBarjasId
                            ? {
                                value: item.jenisBarjasId,
                                label:
                                  dataJenisBarjas?.find(
                                    (v) => v.id === item.jenisBarjasId,
                                  )?.jenis || "",
                              }
                            : null
                        }
                        options={dataJenisBarjas?.map((val) => ({
                          value: val.id,
                          label: `${val.jenis}`,
                        }))}
                        placeholder="Pilih jenis..."
                        focusBorderColor="aset"
                        onChange={(selectedOption) => {
                          handleBarjasChange(
                            index,
                            "jenisBarjasId",
                            selectedOption?.value || null,
                          );
                        }}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                        chakraStyles={{
                          container: (provided) => ({
                            ...provided,
                            borderRadius: "8px",
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor:
                              colorMode === "dark" ? "gray.600" : "white",
                            border: "1px solid",
                            borderColor:
                              colorMode === "dark" ? "gray.500" : "gray.200",
                            height: "48px",
                            _hover: {
                              borderColor: "aset",
                            },
                            minHeight: "48px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            bg: state.isFocused ? "aset" : "white",
                            color: state.isFocused ? "white" : "black",
                          }),
                        }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Nama Barang dan Jasa
                      </FormLabel>
                      <Input
                        bgColor={colorMode === "dark" ? "gray.600" : "white"}
                        height="48px"
                        type="text"
                        value={item.nama}
                        onChange={(e) =>
                          handleBarjasChange(index, "nama", e.target.value)
                        }
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.200"
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Jumlah
                      </FormLabel>
                      <Input
                        bgColor={colorMode === "dark" ? "gray.600" : "white"}
                        height="48px"
                        type="text"
                        inputMode="numeric"
                        value={item.jumlah ?? 0}
                        onChange={(e) => {
                          const digits = e.target.value
                            .toString()
                            .replace(/[^0-9]/g, "");
                          const parsed = digits ? parseInt(digits, 10) : 0;
                          handleBarjasChange(index, "jumlah", parsed);
                        }}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.200"
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                        Harga Satuan
                      </FormLabel>
                      <Input
                        bgColor={colorMode === "dark" ? "gray.600" : "white"}
                        height="48px"
                        type="text"
                        inputMode="numeric"
                        value={formatRupiah(item.harga)}
                        onChange={(e) => {
                          const parsed = parseRupiah(e.target.value);
                          handleBarjasChange(index, "harga", parsed);
                        }}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={
                          colorMode === "dark" ? "gray.500" : "gray.200"
                        }
                      />
                    </FormControl>
                  </SimpleGrid>

                  {daftarBarjas.length > 1 && (
                    <Flex mt={4} justify="flex-end">
                      <Button
                        variant="danger"
                        onClick={() => removeBarjasRow(index)}
                        size="sm"
                        w={{ base: "full", md: "auto" }}
                        minH="40px"
                      >
                        Hapus Item
                      </Button>
                    </Flex>
                  )}
                </Box>
              ))}

              <Divider my={{ base: 4, md: 6 }} />
              <VStack spacing={3} align="stretch">
                {daftarBarjas.length > 0 && (
                  <Box
                    p={3}
                    borderRadius="10px"
                    bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                  >
                    <Flex justify="space-between" align="center" gap={2}>
                      <Text fontSize="sm" color="gray.600">
                        Total item baru
                      </Text>
                      <Text fontWeight="bold" color="aset">
                        {formatRupiah(totalBerjalan)}
                      </Text>
                    </Flex>
                  </Box>
                )}
                <Flex
                  gap={3}
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                >
                  <Button
                    onClick={addBarjasRow}
                    variant="secondary"
                    w={{ base: "full", md: "auto" }}
                    minH="44px"
                    leftIcon={<Icon as={FaPlus} />}
                    isDisabled={isAddingBarjas}
                  >
                    Tambah Item Baru
                  </Button>
                  <Button
                    variant="primary"
                    onClick={tambahBarjas}
                    w={{ base: "full", md: "auto" }}
                    minH="44px"
                    isLoading={isAddingBarjas}
                    loadingText="Menyimpan"
                  >
                    Simpan Semua Item
                  </Button>
                </Flex>
              </VStack>
            </Box>

            {/* Tabel Daftar Barang dan Jasa */}
            <Box
              bgColor={{
                base: "transparent",
                md: colorMode === "dark" ? "gray.800" : "white",
              }}
              p={{ base: 0, md: 6 }}
              borderRadius="12px"
              boxShadow={{ base: "none", md: "md" }}
              borderTop={{ base: "none", md: "4px solid" }}
              borderColor="aset"
            >
              <Flex
                align="center"
                justify="space-between"
                mb={4}
                gap={2}
                flexWrap="wrap"
              >
                <Flex align="center" minW={0}>
                  <Icon as={FaList} color="aset" mr={2} boxSize={5} />
                  <Heading size={{ base: "sm", md: "md" }} color="aset">
                    Daftar Barang dan Jasa
                  </Heading>
                </Flex>
                {totalItemBarjas > 0 && (
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    fontSize="sm"
                    p={2}
                    borderRadius="md"
                  >
                    {totalItemBarjas} Item
                  </Badge>
                )}
              </Flex>
              <VStack
                spacing={3}
                align="stretch"
                display={{ base: "flex", md: "none" }}
              >
                {dataDokumen?.barjas?.length > 0 ? (
                  <>
                    {dataDokumen.barjas.map((item, index) => (
                      <Box
                        key={item.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="12px"
                        borderColor={
                          colorMode === "dark" ? "gray.600" : "gray.200"
                        }
                        bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                      >
                        <Flex justify="space-between" align="start" mb={2} gap={2}>
                          <Box minW={0}>
                            <Text fontSize="xs" color="gray.500">
                              Item {index + 1} • {item?.jenisBarja?.jenis || "-"}
                            </Text>
                            <Text fontWeight="bold" wordBreak="break-word">
                              {item?.nama || "-"}
                            </Text>
                          </Box>
                        </Flex>
                        <SimpleGrid columns={2} spacing={3} mb={3}>
                          <Box>
                            <Text fontSize="xs" color="gray.500">
                              Jumlah
                            </Text>
                            <Text fontWeight="semibold">
                              {Number(item?.jumlah || 0).toLocaleString("id-ID")}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">
                              Harga
                            </Text>
                            <Text fontWeight="semibold">
                              {formatRupiah(Number(item?.harga || 0))}
                            </Text>
                          </Box>
                          <Box gridColumn="1 / -1">
                            <Text fontSize="xs" color="gray.500">
                              Subtotal
                            </Text>
                            <Text fontWeight="bold" color="aset">
                              {formatRupiah(
                                Number(item?.harga || 0) *
                                  Number(item?.jumlah || 0),
                              )}
                            </Text>
                          </Box>
                        </SimpleGrid>
                        <Flex gap={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            color="aset"
                            flex="1"
                            onClick={() => openEditBarjas(item)}
                            leftIcon={<Icon as={FaEdit} />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            flex="1"
                            onClick={() => handleDeleteBarjas(item)}
                            leftIcon={<Icon as={FaTrash} />}
                          >
                            Hapus
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                    <Box
                      p={3}
                      borderRadius="10px"
                      bgColor={colorMode === "dark" ? "gray.700" : "blue.50"}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="bold">Total</Text>
                        <Text fontWeight="bold" color="aset">
                          {formatRupiah(totalNominal)}
                        </Text>
                      </Flex>
                    </Box>
                  </>
                ) : (
                  <VStack spacing={2} py={6}>
                    <Icon as={MdInventory2} boxSize={10} color="gray.400" />
                    <Text color="gray.500" fontWeight="medium" textAlign="center">
                      Belum ada data barang dan jasa
                    </Text>
                  </VStack>
                )}
              </VStack>
              <Box display={{ base: "none", md: "block" }} overflowX="auto">
              <Table variant="aset" size="sm">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>Nama</Th>
                    <Th>Jenis</Th>
                    <Th isNumeric>Jumlah</Th>
                    <Th isNumeric>Harga Satuan</Th>
                    <Th isNumeric>Subtotal</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataDokumen?.barjas?.length > 0 ? (
                    dataDokumen.barjas.map((item, index) => (
                      <Tr key={item.id}>
                        <Td>{index + 1}</Td>
                        <Td>{item?.nama || "-"}</Td>
                        <Td>{item?.jenisBarja?.jenis || "-"}</Td>
                        <Td isNumeric>
                          {Number(item?.jumlah || 0).toLocaleString("id-ID")}
                        </Td>
                        <Td isNumeric>
                          {formatRupiah(Number(item?.harga || 0))}
                        </Td>
                        <Td isNumeric fontWeight="semibold">
                          {formatRupiah(
                            Number(item?.harga || 0) *
                              Number(item?.jumlah || 0),
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Button
                              size="sm"
                              variant="ghost"
                              color="aset"
                              onClick={() => openEditBarjas(item)}
                              leftIcon={<Icon as={FaEdit} />}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDeleteBarjas(item)}
                              leftIcon={<Icon as={FaTrash} />}
                            >
                              Hapus
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={8}>
                        <VStack spacing={2}>
                          <Icon
                            as={MdInventory2}
                            boxSize={10}
                            color="gray.400"
                          />
                          <Text
                            color="gray.500"
                            fontSize="md"
                            fontWeight="medium"
                          >
                            Belum ada data barang dan jasa
                          </Text>
                          <Text color="gray.400" fontSize="sm">
                            Tambahkan barang dan jasa menggunakan form di atas
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td
                      colSpan={5}
                      textAlign="right"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      Total
                    </Td>
                    <Td
                      isNumeric
                      fontWeight="bold"
                      fontSize="lg"
                      color="aset"
                      bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                    >
                      {formatRupiah(totalNominal)}
                    </Td>
                    <Td />
                  </Tr>
                </Tfoot>
              </Table>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Bagian 3: Tambah Dokumen Barang dan Jasa + Daftar Dokumen */}
        <Box
          pt={{ base: 6, md: 12 }}
          px={{ base: 3, md: "30px" }}
          pb={{ base: "calc(24px + env(safe-area-inset-bottom))", md: 12 }}
          position="relative"
          overflowX="hidden"
        >
          <Container
            borderRadius={{ base: "16px", md: "12px" }}
            bgColor={colorMode === "dark" ? "gray.900" : "white"}
            maxW="1280px"
            p={{ base: 4, md: 8 }}
          >
            <PageSectionHeader
              number="3"
              title="Dokumen Barang dan Jasa"
              subtitle="Kelola dan tambahkan dokumen barang dan jasa"
              colorMode={colorMode}
            />
            {/* Form Tambah Dokumen */}
            <Box
              bgColor={colorMode === "dark" ? "gray.800" : "white"}
              p={{ base: 4, md: 6 }}
              borderRadius="12px"
              boxShadow="md"
              mb={6}
              borderTop="4px solid"
              borderColor="aset"
            >
              <Flex align="center" mb={4}>
                <Icon as={FaPlus} color="aset" mr={2} boxSize={5} />
                <Heading size={{ base: "sm", md: "md" }} color="aset">
                  Tambah Dokumen
                </Heading>
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="md" fontWeight="medium" mb={2}>
                    Jenis Surat
                  </FormLabel>
                  <Select2
                    {...selectPortalProps}
                    options={dataJenisDokumen?.map((val) => ({
                      value: val.id,
                      label: `${val.jenis}`,
                    }))}
                    placeholder="Pilih jenis surat..."
                    focusBorderColor="aset"
                    onChange={(selectedOption) => {
                      setJenisDokumenId(selectedOption?.value || null);
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        borderRadius: "8px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        backgroundColor:
                          colorMode === "dark" ? "gray.700" : "terang",
                        border: "1px solid",
                        borderColor:
                          colorMode === "dark" ? "gray.600" : "gray.200",
                        height: "48px",
                        _hover: {
                          borderColor: "aset",
                        },
                        minHeight: "48px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        bg: state.isFocused ? "aset" : "white",
                        color: state.isFocused ? "white" : "black",
                      }),
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="md" fontWeight="medium" mb={2}>
                    Tanggal
                  </FormLabel>
                  <Input
                    bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                    height="48px"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    borderRadius="8px"
                    border="1px solid"
                    borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                  />
                </FormControl>
              </SimpleGrid>
              <Button
                onClick={handlePilihBarjas}
                variant="primary"
                mt={4}
                w={{ base: "full", md: "auto" }}
                minH="44px"
                leftIcon={<Icon as={FaPlus} />}
                isDisabled={isAddingDokumen}
              >
                Tambah Dokumen
              </Button>
            </Box>

            {/* Daftar Dokumen Card */}
            <Box>
              <Flex
                align="center"
                justify="space-between"
                mb={4}
                gap={2}
                flexWrap="wrap"
              >
                <Flex align="center">
                  <Icon as={FaList} color="aset" mr={2} boxSize={5} />
                  <Heading size={{ base: "sm", md: "md" }} color="aset">
                    Daftar Dokumen
                  </Heading>
                </Flex>
                {totalDokumen > 0 && (
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    fontSize="md"
                    p={2}
                    borderRadius="md"
                  >
                    {totalDokumen} Dokumen
                  </Badge>
                )}
              </Flex>
              {dataDokumen?.dokumenBarjas?.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {dataDokumen.dokumenBarjas.map((item, index) => {
                    const totalJumlahBarang = (
                      item?.itemDokumenBarjas || []
                    ).reduce((sum, it) => sum + Number(it?.jumlah || 0), 0);
                    const totalNominal = (item?.itemDokumenBarjas || []).reduce(
                      (sum, it) =>
                        sum +
                        Number(it?.jumlah || 0) * Number(it?.barja?.harga || 0),
                      0,
                    );
                    return (
                      <Box
                        key={item.id}
                        bgColor={colorMode === "dark" ? "gray.800" : "white"}
                        p={4}
                        borderRadius="12px"
                        boxShadow="md"
                        borderLeft="4px solid"
                        borderColor="aset"
                        _hover={{
                          boxShadow: { md: "lg" },
                        }}
                      >
                        <Flex
                          justify="space-between"
                          align="start"
                          mb={3}
                          gap={2}
                          wrap="wrap"
                        >
                          <Badge
                            colorScheme="gray"
                            variant="subtle"
                            fontSize="sm"
                            p={1}
                            maxW="70%"
                            whiteSpace="normal"
                          >
                            {item?.jenisDokumenBarja?.jenis || "-"}
                          </Badge>
                          <Badge colorScheme="gray" variant="solid" fontSize="xs">
                            #{index + 1}
                          </Badge>
                          <HStack spacing={2} w={{ base: "full", sm: "auto" }}>
                            <Button
                              size="sm"
                              variant="outline"
                              color="aset"
                              leftIcon={<Icon as={FaEdit} />}
                              onClick={() => openEditDokumen(item)}
                              minH="40px"
                              flex="1"
                              isDisabled={isDeletingDokumen}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              leftIcon={<Icon as={FaTrash} />}
                              onClick={() => handleDeleteDokumen(item)}
                              minH="40px"
                              flex="1"
                              isDisabled={isDeletingDokumen}
                            >
                              Hapus
                            </Button>
                          </HStack>
                        </Flex>

                        <VStack align="stretch" spacing={3}>
                          <Box>
                            <Text fontSize="xs" color="gray.600" mb={1}>
                              Nomor Dokumen
                            </Text>
                            <Text
                              fontSize="md"
                              fontWeight="semibold"
                              wordBreak="break-word"
                            >
                              {item?.nomor || "-"}
                            </Text>
                          </Box>

                          <SimpleGrid columns={2} spacing={3}>
                            <Box>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                Tanggal Surat
                              </Text>
                              <Text fontSize="sm">
                                {item?.tanggal
                                  ? new Date(item?.tanggal).toLocaleDateString(
                                      "id-ID",
                                      {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )
                                  : "-"}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                Tanggal Input
                              </Text>
                              <Text fontSize="sm">
                                {item?.createdAt
                                  ? new Date(
                                      item?.createdAt,
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "-"}
                              </Text>
                            </Box>
                          </SimpleGrid>

                          <Divider />

                          <SimpleGrid columns={3} spacing={2}>
                            <Box>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                Jumlah Item
                              </Text>
                              <Text
                                fontSize={{ base: "md", md: "lg" }}
                                fontWeight="bold"
                                color="aset"
                              >
                                {item?.itemDokumenBarjas?.length || 0}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                Jumlah Barang
                              </Text>
                              <Text
                                fontSize={{ base: "md", md: "lg" }}
                                fontWeight="bold"
                                color="aset"
                              >
                                {totalJumlahBarang.toLocaleString("id-ID")}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                Nominal
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="aset"
                                wordBreak="break-word"
                              >
                                {formatRupiah(totalNominal)}
                              </Text>
                            </Box>
                          </SimpleGrid>

                          {item?.itemDokumenBarjas?.length > 0 && (
                            <>
                              <Divider />
                              <Box>
                                <Text fontSize="xs" color="gray.600" mb={2}>
                                  Rincian Item
                                </Text>
                                <VStack align="stretch" spacing={1}>
                                  {item.itemDokumenBarjas.map((it, idx) => {
                                    const nama = it?.barja?.nama ?? "-";
                                    const qty = Number(
                                      it?.jumlah || 0,
                                    ).toLocaleString("id-ID");
                                    return (
                                      <Text
                                        key={idx}
                                        fontSize="xs"
                                        color="gray.700"
                                        noOfLines={1}
                                      >
                                        • {nama} ({qty})
                                      </Text>
                                    );
                                  })}
                                </VStack>
                              </Box>
                            </>
                          )}
                        </VStack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              ) : (
                <Box
                  bgColor={colorMode === "dark" ? "gray.800" : "white"}
                  p={8}
                  borderRadius="12px"
                  boxShadow="md"
                  textAlign="center"
                >
                  <VStack spacing={2}>
                    <Icon as={FaFileAlt} boxSize={10} color="gray.400" />
                    <Text color="gray.500" fontSize="md" fontWeight="medium">
                      Belum ada dokumen
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Tambahkan dokumen baru menggunakan form di atas
                    </Text>
                  </VStack>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </LayoutAset>

      {/* Modal Edit Dokumen */}
      <Modal
        isOpen={isEditDokumenOpen}
        onClose={closeEditDokumen}
        isCentered
        size={{ base: "full", md: "4xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          maxH={{ base: "100dvh", md: "90vh" }}
          m={0}
          borderRadius={{ base: 0, md: "md" }}
        >
          <ModalHeader fontSize={{ base: "md", md: "lg" }}>
            Edit Dokumen
          </ModalHeader>
          <ModalCloseButton isDisabled={isSavingDokumen} />
          <ModalBody pb={6} overflowY="auto">
            <VStack align="stretch" spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Jenis Surat</FormLabel>
                  <Select2
                    {...selectPortalProps}
                    options={dataJenisDokumen?.map((val) => ({
                      value: val.id,
                      label: `${val.jenis}`,
                    }))}
                    value={
                      jenisDokumenEditId
                        ? {
                            value: jenisDokumenEditId,
                            label:
                              dataJenisDokumen?.find(
                                (val) => val.id === jenisDokumenEditId,
                              )?.jenis || "-",
                          }
                        : null
                    }
                    placeholder="Pilih jenis surat..."
                    focusBorderColor="aset"
                    isDisabled={isSavingDokumen}
                    onChange={(selectedOption) => {
                      setJenisDokumenEditId(selectedOption?.value || null);
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tanggal Surat</FormLabel>
                  <Input
                    type="date"
                    value={tanggalEditValue}
                    onChange={(e) => setTanggalEditValue(e.target.value)}
                    isDisabled={isSavingDokumen}
                    bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Nomor Dokumen</FormLabel>
                <Input
                  value={nomorEditValue}
                  onChange={(e) => setNomorEditValue(e.target.value)}
                  isDisabled={isSavingDokumen}
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                  placeholder="Masukkan nomor dokumen"
                />
              </FormControl>

              {daftarBarjasEdit.length > 0 ? (
                <>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Text fontSize="sm" fontWeight="semibold">
                      Rincian Barang dan Jasa
                    </Text>
                    <Checkbox
                      isChecked={
                        selectedBarjasEdit.length ===
                          daftarBarjasEdit.length &&
                        daftarBarjasEdit.length > 0
                      }
                      onChange={handleSelectAllBarjasEdit}
                      colorScheme="green"
                      isDisabled={isSavingDokumen}
                    >
                      Pilih Semua
                    </Checkbox>
                  </Flex>
                  <BarjasPickCards
                    items={daftarBarjasEdit}
                    isSelected={isBarjasEditSelected}
                    getJumlah={getBarjasEditJumlah}
                    onToggle={handleToggleBarjasEdit}
                    onJumlahChange={(id, parsed, fallback) => {
                      if (isBarjasEditSelected(id)) {
                        setBarjasEditJumlah(id, parsed);
                      } else {
                        handleToggleBarjasEdit(id, parsed || fallback);
                      }
                    }}
                    isDisabled={isSavingDokumen}
                    formatRupiah={formatRupiah}
                    colorMode={colorMode}
                  />
                  <Box
                    display={{ base: "none", md: "block" }}
                    borderWidth="1px"
                    borderRadius="8px"
                    borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                    overflowX="auto"
                  >
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th width="50px" />
                          <Th>Nama</Th>
                          <Th>Jenis</Th>
                          <Th isNumeric>Jumlah Dipilih</Th>
                          <Th isNumeric>Harga Satuan</Th>
                          <Th isNumeric>Subtotal</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {daftarBarjasEdit.map((item) => (
                          <Tr key={item.id}>
                            <Td>
                              <Checkbox
                                isChecked={isBarjasEditSelected(item.id)}
                                onChange={() =>
                                  handleToggleBarjasEdit(
                                    item.id,
                                    Number(item?.jumlah || 1),
                                  )
                                }
                                colorScheme="green"
                                isDisabled={isSavingDokumen}
                              />
                            </Td>
                            <Td fontWeight="medium">{item?.nama || "-"}</Td>
                            <Td>{item?.jenisBarja?.jenis || "-"}</Td>
                            <Td isNumeric>
                              <Input
                                height="32px"
                                maxW="100px"
                                ml="auto"
                                type="text"
                                inputMode="numeric"
                                value={getBarjasEditJumlah(item.id)}
                                onChange={(e) => {
                                  const digits = e.target.value
                                    .toString()
                                    .replace(/[^0-9]/g, "");
                                  const parsed = digits
                                    ? parseInt(digits, 10)
                                    : 0;
                                  if (isBarjasEditSelected(item.id)) {
                                    setBarjasEditJumlah(item.id, parsed);
                                  } else {
                                    handleToggleBarjasEdit(
                                      item.id,
                                      parsed || 1,
                                    );
                                  }
                                }}
                                isDisabled={
                                  isSavingDokumen ||
                                  !isBarjasEditSelected(item.id)
                                }
                              />
                            </Td>
                            <Td isNumeric>
                              {formatRupiah(Number(item?.harga || 0))}
                            </Td>
                            <Td isNumeric fontWeight="semibold">
                              {formatRupiah(
                                Number(item?.harga || 0) *
                                  Number(getBarjasEditJumlah(item.id) || 0),
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  <Text fontSize="sm" color="gray.600">
                    Terpilih: {selectedBarjasEdit.length} dari{" "}
                    {daftarBarjasEdit.length} item
                  </Text>
                </>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Belum ada data barang dan jasa pada SP ini
                </Text>
              )}
            </VStack>
          </ModalBody>
          <MobileModalFooter
            onCancel={closeEditDokumen}
            onSubmit={submitEditDokumen}
            isLoading={isSavingDokumen}
          />
        </ModalContent>
      </Modal>

      {/* Modal Pilih Barjas */}
      <Modal
        isOpen={isPilihBarjasOpen}
        onClose={() => {
          if (isAddingDokumen) return;
          onPilihBarjasClose();
        }}
        size={{ base: "full", md: "4xl" }}
        isCentered
        scrollBehavior="inside"
        closeOnOverlayClick={!isAddingDokumen}
        closeOnEsc={!isAddingDokumen}
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          maxH={{ base: "100dvh", md: "90vh" }}
          m={0}
          borderRadius={{ base: 0, md: "md" }}
        >
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaList} color="aset" mr={2} boxSize={5} />
              <Heading size="md" color="aset">
                Pilih Barang dan Jasa
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton isDisabled={isAddingDokumen} />
          <ModalBody pb={6} overflowY="auto">
            {dataDokumen?.barjas?.length > 0 ? (
              <>
                <Flex
                  mb={4}
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    p={2}
                    borderRadius="md"
                  >
                    <Icon as={FaInfoCircle} mr={1} />
                    Pilih barang dan jasa yang akan ditambahkan ke dokumen
                  </Badge>
                  <Checkbox
                    isChecked={
                      selectedBarjas.length === dataDokumen.barjas.length &&
                      dataDokumen.barjas.length > 0
                    }
                    onChange={handleSelectAllBarjas}
                    colorScheme="green"
                    size="lg"
                  >
                    Pilih Semua
                  </Checkbox>
                </Flex>
                <BarjasPickCards
                  items={dataDokumen.barjas}
                  isSelected={isBarjasSelected}
                  getJumlah={getBarjasJumlah}
                  onToggle={handleToggleBarjas}
                  onJumlahChange={(id, parsed, fallback) => {
                    if (isBarjasSelected(id)) {
                      setBarjasJumlah(id, parsed);
                    } else {
                      handleToggleBarjas(id, parsed || fallback);
                    }
                  }}
                  formatRupiah={formatRupiah}
                  colorMode={colorMode}
                />
                <Box
                  display={{ base: "none", md: "block" }}
                  borderWidth="1px"
                  borderRadius="8px"
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                  overflowX="auto"
                >
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th width="50px">
                          <Checkbox
                            isChecked={
                              selectedBarjas.length ===
                                dataDokumen.barjas.length &&
                              dataDokumen.barjas.length > 0
                            }
                            onChange={handleSelectAllBarjas}
                            colorScheme="green"
                          />
                        </Th>
                        <Th>No</Th>
                        <Th>Nama</Th>
                        <Th>Jenis</Th>
                        <Th isNumeric>Jumlah</Th>
                        <Th isNumeric>Jumlah Dipilih</Th>
                        <Th isNumeric>Harga Satuan</Th>
                        <Th isNumeric>Subtotal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dataDokumen.barjas.map((item, index) => (
                        <Tr
                          key={item.id}
                          bgColor={
                            isBarjasSelected(item.id)
                              ? colorMode === "dark"
                                ? "gray.700"
                                : "gray.50"
                              : "transparent"
                          }
                          _hover={{
                            bgColor:
                              colorMode === "dark" ? "gray.700" : "gray.50",
                          }}
                          cursor="pointer"
                          onClick={() =>
                            handleToggleBarjas(
                              item.id,
                              Number(item?.jumlah || 1),
                            )
                          }
                        >
                          <Td onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              isChecked={isBarjasSelected(item.id)}
                              onChange={() =>
                                handleToggleBarjas(
                                  item.id,
                                  Number(item?.jumlah || 1),
                                )
                              }
                              colorScheme="green"
                            />
                          </Td>
                          <Td>{index + 1}</Td>
                          <Td fontWeight="medium">{item?.nama || "-"}</Td>
                          <Td>{item?.jenisBarja?.jenis || "-"}</Td>
                          <Td isNumeric>
                            {Number(item?.jumlah || 0).toLocaleString("id-ID")}
                          </Td>
                          <Td isNumeric onClick={(e) => e.stopPropagation()}>
                            <Input
                              height="32px"
                              maxW="100px"
                              type="text"
                              inputMode="numeric"
                              value={getBarjasJumlah(item.id)}
                              onChange={(e) => {
                                const digits = e.target.value
                                  .toString()
                                  .replace(/[^0-9]/g, "");
                                const parsed = digits
                                  ? parseInt(digits, 10)
                                  : 0;
                                if (isBarjasSelected(item.id)) {
                                  setBarjasJumlah(item.id, parsed);
                                } else {
                                  handleToggleBarjas(item.id, parsed || 1);
                                }
                              }}
                              isDisabled={!isBarjasSelected(item.id)}
                            />
                          </Td>
                          <Td isNumeric>
                            {formatRupiah(Number(item?.harga || 0))}
                          </Td>
                          <Td isNumeric fontWeight="semibold">
                            {formatRupiah(
                              Number(item?.harga || 0) *
                                Number(item?.jumlah || 0),
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <Box
                  mt={4}
                  p={4}
                  bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                  borderRadius="8px"
                  borderLeft="4px solid"
                  borderColor="aset"
                >
                  <Flex
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Text fontSize="md" fontWeight="semibold">
                      <Icon as={FaCheckCircle} color="aset" mr={2} />
                      Barang dan Jasa Terpilih:{" "}
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        fontSize="md"
                        ml={2}
                      >
                        {selectedBarjas.length} dari {dataDokumen.barjas.length}
                      </Badge>
                    </Text>
                    {selectedBarjas.length > 0 && (
                      <Text fontSize="sm" color="gray.600">
                        Total:{" "}
                        {formatRupiah(
                          selectedBarjas.reduce((sum, b) => {
                            const item = dataDokumen.barjas.find(
                              (bar) => bar.id === b.id,
                            );
                            return (
                              sum +
                              Number(item?.harga || 0) * Number(b.jumlah || 0)
                            );
                          }, 0),
                        )}
                      </Text>
                    )}
                  </Flex>
                </Box>
              </>
            ) : (
              <Center py={8}>
                <VStack spacing={3}>
                  <Icon as={MdInventory2} boxSize={12} color="gray.400" />
                  <Text color="gray.500" fontSize="md" fontWeight="medium">
                    Belum ada data barang dan jasa
                  </Text>
                  <Text color="gray.400" fontSize="sm" textAlign="center">
                    Tambahkan barang dan jasa terlebih dahulu melalui form Input
                    Barang dan Jasa
                  </Text>
                </VStack>
              </Center>
            )}
          </ModalBody>
          <MobileModalFooter
            onCancel={onPilihBarjasClose}
            onSubmit={tambahDokumen}
            isLoading={isAddingDokumen}
            isDisabled={selectedBarjas.length === 0}
            submitLabel={`Simpan (${selectedBarjas.length})`}
            loadingText="Menyimpan"
            leftIcon={<Icon as={FaPlus} />}
          />
        </ModalContent>
      </Modal>

      {/* Modal Edit Surat Pesanan */}
      <Modal
        isOpen={isEditSPOpen}
        onClose={closeEditSP}
        isCentered
        size={{ base: "full", md: "4xl" }}
        scrollBehavior="inside"
        trapFocus={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          maxH={{ base: "100dvh", md: "90vh" }}
          m={0}
          borderRadius={{ base: 0, md: "md" }}
        >
          <ModalHeader fontSize={{ base: "md", md: "lg" }}>
            Edit Informasi Surat Pesanan
          </ModalHeader>
          <ModalCloseButton isDisabled={isSavingSP} />
          <ModalBody pb={6} overflowY="auto">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Nomor Surat</FormLabel>
                <Input
                  value={spEdit?.nomor || ""}
                  onChange={(e) => handleSPEditChange("nomor", e.target.value)}
                  isDisabled={isSavingSP}
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tanggal Surat</FormLabel>
                <Input
                  type="date"
                  value={spEdit?.tanggal || ""}
                  onChange={(e) =>
                    handleSPEditChange("tanggal", e.target.value)
                  }
                  isDisabled={isSavingSP}
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Akun Belanja</FormLabel>
                <Select2
                  {...selectPortalProps}
                  options={dataAkunBelanja?.map((val) => ({
                    value: val.id,
                    label: val.akun,
                  }))}
                  placeholder="Pilih akun belanja..."
                  isDisabled={isSavingSP}
                  value={
                    spEdit?.akunBelanjaId
                      ? {
                          value: spEdit.akunBelanjaId,
                          label:
                            dataAkunBelanja?.find(
                              (v) => v.id === spEdit.akunBelanjaId,
                            )?.akun || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSPEditChange(
                      "akunBelanjaId",
                      selectedOption?.value || null,
                    )
                  }
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rekanan</FormLabel>
                <AsyncSelect
                  {...selectPortalProps}
                  loadOptions={async (inputValue) => {
                    if (!inputValue) return [];
                    try {
                      const res = await axios.get(
                        `${
                          import.meta.env.VITE_REACT_APP_API_BASE_URL
                        }/barjas/get/rekanan/search?q=${inputValue}`,
                      );
                      return (res.data.result || []).map((val) => ({
                        value: val.id,
                        label: val.nama,
                      }));
                    } catch (err) {
                      console.error(err);
                      return [];
                    }
                  }}
                  placeholder="Ketik nama rekanan..."
                  isDisabled={isSavingSP}
                  value={
                    spEdit?.rekananId
                      ? {
                          value: spEdit.rekananId,
                          label: spEdit.rekananLabel || "Rekanan",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setSpEdit((prev) =>
                      prev
                        ? {
                            ...prev,
                            rekananId: selectedOption?.value || null,
                            rekananLabel: selectedOption?.label || "",
                          }
                        : prev,
                    );
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </FormControl>
              <FormControl
                gridColumn={{ base: "1 / -1", md: "1 / -1" }}
                isInvalid={Boolean(spEdit && !spEdit.subKegPerId)}
              >
                <FormLabel>Sub Kegiatan</FormLabel>
                <AsyncSelect
                  {...selectPortalProps}
                  key={`subkeg-${isEditSPOpen ? "open" : "closed"}`}
                  defaultOptions
                  cacheOptions
                  isClearable
                  isSearchable
                  filterOption={null}
                  loadOptions={loadSubKegiatanOptions}
                  placeholder="Ketik nama sub kegiatan..."
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? "Sub kegiatan tidak ditemukan"
                      : "Ketik nama sub kegiatan"
                  }
                  loadingMessage={() => "Mencari sub kegiatan..."}
                  isDisabled={isSavingSP}
                  value={
                    spEdit?.subKegPerId
                      ? {
                          value: spEdit.subKegPerId,
                          label: spEdit.subKegPerLabel || "Sub Kegiatan",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setSpEdit((prev) =>
                      prev
                        ? {
                            ...prev,
                            subKegPerId: selectedOption?.value || null,
                            subKegPerLabel: selectedOption?.label || "",
                            unitKerjaId:
                              selectedOption?.unitKerjaId ?? null,
                          }
                        : prev,
                    );
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                <Text fontSize="xs" color="gray.500" mt={2}>
                  Klik, lalu ketik nama sub kegiatan untuk mengganti data.
                </Text>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <MobileModalFooter
            onCancel={closeEditSP}
            onSubmit={submitEditSP}
            isLoading={isSavingSP}
          />
        </ModalContent>
      </Modal>

      {/* Modal Edit Barang dan Jasa */}
      <Modal
        isOpen={isEditBarjasOpen}
        onClose={closeEditBarjas}
        isCentered
        size={{ base: "full", md: "xl" }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          maxH={{ base: "100dvh", md: "90vh" }}
          m={0}
          borderRadius={{ base: 0, md: "md" }}
        >
          <ModalHeader>Edit Barang dan Jasa</ModalHeader>
          <ModalCloseButton isDisabled={isSavingBarjas} />
          <ModalBody pb={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Jenis Barang dan Jasa</FormLabel>
                <Select2
                  {...selectPortalProps}
                  value={
                    barjasEdit?.jenisBarjasId
                      ? {
                          value: barjasEdit.jenisBarjasId,
                          label:
                            dataJenisBarjas?.find(
                              (v) => v.id === barjasEdit.jenisBarjasId,
                            )?.jenis || "",
                        }
                      : null
                  }
                  options={dataJenisBarjas?.map((val) => ({
                    value: val.id,
                    label: `${val.jenis}`,
                  }))}
                  placeholder="Pilih jenis..."
                  focusBorderColor="aset"
                  isDisabled={isSavingBarjas}
                  onChange={(selectedOption) => {
                    handleBarjasEditChange(
                      "jenisBarjasId",
                      selectedOption?.value || null,
                    );
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nama Barang dan Jasa</FormLabel>
                <Input
                  value={barjasEdit?.nama || ""}
                  onChange={(e) =>
                    handleBarjasEditChange("nama", e.target.value)
                  }
                  isDisabled={isSavingBarjas}
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Jumlah</FormLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={barjasEdit?.jumlah ?? 0}
                  onChange={(e) => {
                    const digits = e.target.value
                      .toString()
                      .replace(/[^0-9]/g, "");
                    const parsed = digits ? parseInt(digits, 10) : 0;
                    handleBarjasEditChange("jumlah", parsed);
                  }}
                  isDisabled={isSavingBarjas}
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Harga Satuan</FormLabel>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatRupiah(barjasEdit?.harga)}
                  onChange={(e) => {
                    handleBarjasEditChange("harga", parseRupiah(e.target.value));
                  }}
                  isDisabled={isSavingBarjas}
                  bgColor={colorMode === "dark" ? "gray.700" : "terang"}
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <MobileModalFooter
            onCancel={closeEditBarjas}
            onSubmit={submitEditBarjas}
            isLoading={isSavingBarjas}
          />
        </ModalContent>
      </Modal>

      {/* Modal Konfirmasi Hapus Barjas */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          if (isDeletingBarjas) return;
          onDeleteClose();
        }}
        isCentered
        size="md"
        closeOnOverlayClick={!isDeletingBarjas}
        closeOnEsc={!isDeletingBarjas}
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="12px"
          mx={4}
        >
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaTrash} color="red.500" mr={2} boxSize={5} />
              <Heading size="md">Konfirmasi Hapus</Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton isDisabled={isDeletingBarjas} />
          <ModalBody pb={6}>
            <Text mb={4}>Apakah Anda yakin ingin menghapus item berikut?</Text>
            {itemToDelete && (
              <Box
                p={4}
                bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                borderRadius="8px"
                mb={4}
              >
                <VStack align="stretch" spacing={2}>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Nama Barang/Jasa
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {itemToDelete?.nama || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Jenis
                    </Text>
                    <Text fontSize="sm">
                      {itemToDelete?.jenisBarja?.jenis || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Jumlah
                    </Text>
                    <Text fontSize="sm">
                      {Number(itemToDelete?.jumlah || 0).toLocaleString(
                        "id-ID",
                      )}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Subtotal
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="aset">
                      {formatRupiah(
                        Number(itemToDelete?.harga || 0) *
                          Number(itemToDelete?.jumlah || 0),
                      )}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            )}
            <Text fontSize="sm" color="red.500" fontWeight="medium">
              Tindakan ini tidak dapat dibatalkan.
            </Text>
          </ModalBody>
          <MobileModalFooter
            onCancel={() => {
              if (isDeletingBarjas) return;
              onDeleteClose();
            }}
            onSubmit={confirmDeleteBarjas}
            isLoading={isDeletingBarjas}
            submitLabel="Hapus"
            loadingText="Menghapus"
            submitColorScheme="red"
            leftIcon={<Icon as={FaTrash} />}
          />
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteDokumenOpen}
        onClose={() => {
          if (isDeletingDokumen) return;
          onDeleteDokumenClose();
          setDokumenToDelete(null);
        }}
        isCentered
        size="md"
        closeOnOverlayClick={!isDeletingDokumen}
        closeOnEsc={!isDeletingDokumen}
      >
        <ModalOverlay />
        <ModalContent
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="12px"
          mx={4}
        >
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaTrash} color="red.500" mr={2} boxSize={5} />
              <Heading size="md">Hapus Dokumen</Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton isDisabled={isDeletingDokumen} />
          <ModalBody pb={6}>
            <Text mb={4}>
              Apakah Anda yakin ingin menghapus dokumen berikut?
            </Text>
            {dokumenToDelete && (
              <Box
                p={4}
                bgColor={colorMode === "dark" ? "gray.700" : "gray.50"}
                borderRadius="8px"
                mb={4}
              >
                <VStack align="stretch" spacing={2}>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Jenis Surat
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      {dokumenToDelete?.jenisDokumenBarja?.jenis || "-"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Nomor Dokumen
                    </Text>
                    <Text fontSize="sm">{dokumenToDelete?.nomor || "-"}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Tanggal Surat
                    </Text>
                    <Text fontSize="sm">
                      {dokumenToDelete?.tanggal
                        ? new Date(dokumenToDelete.tanggal).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            )}
            <Text fontSize="sm" color="red.500" fontWeight="medium">
              Dokumen dan rincian item di dalamnya akan dihapus. Daftar barang
              dan jasa pada surat pesanan tetap ada. Tindakan ini tidak dapat
              dibatalkan.
            </Text>
          </ModalBody>
          <MobileModalFooter
            onCancel={() => {
              if (isDeletingDokumen) return;
              onDeleteDokumenClose();
              setDokumenToDelete(null);
            }}
            onSubmit={confirmDeleteDokumen}
            isLoading={isDeletingDokumen}
            submitLabel="Hapus"
            loadingText="Menghapus"
            submitColorScheme="red"
            leftIcon={<Icon as={FaTrash} />}
          />
        </ModalContent>
      </Modal>

      {isMutating && (
        <Flex
          position="fixed"
          inset={0}
          zIndex={40000}
          bg="blackAlpha.500"
          align="center"
          justify="center"
          direction="column"
          gap={3}
        >
          <Spinner size="xl" thickness="4px" color="white" />
          <Text color="white" fontWeight="medium">
            {mutatingLabel}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default DetailSP;
