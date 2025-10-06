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
  VStack,
  Image,
  Select,
  useColorMode,
  Flex,
  Divider,
} from "@chakra-ui/react";
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

  const [namaPengguna, setNamaPengguna] = useState("");
  const [password, setPassword] = useState("");
  const [pilihanAplikasi, setPilihanAplikasi] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pilihanAplikasi) {
      setError("Silakan pilih aplikasi terlebih dahulu.");
      return;
    }

    try {
      await dispatch(login(namaPengguna, password));

      await new Promise((resolve) => setTimeout(resolve, 100));

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
      setError("Email atau password salah!");
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
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                height="60px"
                w={"600px"}
                type="password"
              />
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
              <Text color="red.500" fontSize="lg" mt="2">
                {error}
              </Text>
            )}

            <Button
              mt={"10px"}
              w={"600px"}
              onClick={handleSubmit}
              variant={"primary"}
              height="60px"
            >
              Login
            </Button>
          </VStack>
        </Center>
      </Center>
    </Flex>
  );
};

export default Login;
