import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Box,
  Center,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Image,
  Select,
  useColorMode,
  Flex,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import LogoPena from "../assets/Logo Pena.png";
import { login } from "../Redux/Reducers/auth";
import { selectIsAuthenticated, selectRole } from "../Redux/Reducers/auth";
import FotoLogin from "../assets/home.png";
import LogoDinkes from "../assets/logo.png";
import LogoPena from "../assets/penaLogo.png";
import LogoAset from "../assets/asetLogo.png";
import LogoPegawai from "../assets/pegawaiLogo.png";
import LogoPerencanaan from "../assets/perencanaanLogo.png";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const roles = useSelector(selectRole);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure();

  const [namaPengguna, setNamaPengguna] = useState("");
  const [password, setPassword] = useState("");
  const [pilihanAplikasi, setPilihanAplikasi] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error sebelumnya

    if (!pilihanAplikasi) {
      setError("Silakan pilih aplikasi terlebih dahulu.");
      toast({
        title: "Peringatan",
        description: "Silakan pilih aplikasi terlebih dahulu.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!namaPengguna || !password) {
      setError("NIP dan password harus diisi.");
      toast({
        title: "Peringatan",
        description: "NIP dan password harus diisi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(login(namaPengguna, password));

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Reset form setelah login berhasil
      setError("");
      setNamaPengguna("");
      setPassword("");

      // Tampilkan toast sukses
      toast({
        title: "Login Berhasil",
        description: "Anda berhasil masuk ke sistem.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      if (pilihanAplikasi === "pegawai") {
        history.push("/pegawai/dashboard");
      } else if (pilihanAplikasi === "aset") {
        history.push("/aset/dashboard");
      } else if (pilihanAplikasi === "pena") {
        history.push("/");
      } else if (pilihanAplikasi === "perencanaan") {
        history.push("/perencanaan");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Ambil pesan error dari response jika ada
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "NIP atau password salah!";

      setError(errorMsg);
      setErrorMessage(errorMsg);

      // Buka modal error
      onErrorModalOpen();

      // Tampilkan toast error (opsional, bisa dihapus jika hanya ingin modal)
      toast({
        title: "Login Gagal",
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    let currentRoles = roles || JSON.parse(localStorage.getItem("role"));

    if (
      Array.isArray(currentRoles) &&
      currentRoles.length === 1 &&
      (currentRoles[0].roleId === 9 || currentRoles[0].id === 9)
    ) {
      history.push("/pegawai/dashboard");
    } else if (
      Array.isArray(currentRoles) &&
      currentRoles.length === 1 &&
      (currentRoles[0].roleId === 10 || currentRoles[0].id === 10)
    ) {
      history.push("/aset/dashboard");
    } else {
      history.push("/");
    }
  }

  return (
    <Flex>
      <Box w={"50%"}>
        <Image
          h={"100%"}
          w={"100%"}
          overflow="hiden"
          objectFit="cover"
          src={FotoLogin}
        />
      </Box>{" "}
      <Center
        bgGradient="radial-gradient(circle,rgba(55, 176, 134, 1) 0%, rgba(19, 122, 106, 1) 100%)"
        height={"100vh"}
        w={"50%"}
      >
        <Center
          transform="translateY(-2px)"
          boxShadow="md"
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius={"8px"}
          p={"100px"}
        >
          <VStack p={"0px"} spacing={6}>
            <Flex>
              <Image
                height="100px"
                objectFit="cover"
                src={LogoDinkes}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                me={"20px"}
              />
              <Box>
                <Text
                  color={"rgba(35, 178, 196, 1)"}
                  fontSize={"30px"}
                  fontWeight={900}
                >
                  DINAS KESEHATAN
                </Text>
                <Text fontSize={"25px"} fontWeight={700}>
                  KABUPATEN PASER
                </Text>
              </Box>
            </Flex>
            <Divider orientation="horizontal" />
            <Flex gap={"40px"}>
              <Image
                height="40px"
                objectFit="cover"
                src={LogoPena}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                mb={"30px"}
              />
              <Image
                height="40px"
                objectFit="cover"
                src={LogoPegawai}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                mb={"30px"}
              />
              <Image
                height="40px"
                objectFit="cover"
                src={LogoAset}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                mb={"30px"}
              />{" "}
              <Image
                height="40px"
                objectFit="cover"
                src={LogoPerencanaan}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
                mb={"30px"}
              />
            </Flex>
            <FormControl>
              <FormLabel fontSize={"24px"}>Akun Pengguna</FormLabel>
              <Input
                value={namaPengguna}
                onChange={(e) => setNamaPengguna(e.target.value)}
                height="60px"
                placeholder="Masukkan NIP"
                w={"600px"}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize={"24px"}>Password</FormLabel>
              <InputGroup w={"600px"}>
                <Input
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  height="60px"
                  type={showPassword ? "text" : "password"}
                  pr="60px"
                />
                <InputRightElement height="60px" width="60px">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="md"
                    _hover={{ bg: "transparent" }}
                    color="gray.500"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel fontSize={"24px"}>Pilih Aplikasi</FormLabel>
              <Select
                placeholder="Pilih aplikasi"
                value={pilihanAplikasi}
                onChange={(e) => setPilihanAplikasi(e.target.value)}
                height="60px"
                w={"600px"}
              >
                <option value="pegawai">Kepegawaian</option>
                <option value="aset">Aset</option>
                <option value="pena">Pena</option>
                <option value="perencanaan">Perencanaan</option>
              </Select>
            </FormControl>

            {error && (
              <Alert status="error" borderRadius="md" w={"600px"}>
                <AlertIcon />
                <Text fontSize="md">{error}</Text>
              </Alert>
            )}

            <Button
              mt={"10px"}
              w={"600px"}
              onClick={handleSubmit}
              variant={"primary"}
              height="60px"
              isLoading={isLoading}
              loadingText="Memproses..."
              isDisabled={isLoading}
            >
              Login
            </Button>
          </VStack>
        </Center>
      </Center>
      {/* Modal Error Login */}
      <Modal isOpen={isErrorModalOpen} onClose={onErrorModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.500">Login Gagal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontSize="md" fontWeight="medium">
                {errorMessage ||
                  "Terjadi kesalahan saat melakukan login. Silakan coba lagi."}
              </Text>
            </Alert>
            <Text fontSize="sm" color="gray.600">
              Pastikan NIP dan password yang Anda masukkan sudah benar. Jika
              masalah masih berlanjut, silakan hubungi administrator.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onErrorModalClose} w="100%">
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Login;
