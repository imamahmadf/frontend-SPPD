import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Reducers/auth"; // Import action creator
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoPena from "../assets/Logo Pena.png";
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
} from "@chakra-ui/react";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";

const Login = () => {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const [namaPengguna, setNamaPengguna] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(namaPengguna, password));
      history.push("/");
    } catch (err) {
      setError("Email atau password salah!");
    }
  };

  if (isAuthenticated) {
    history.push("/");
  }

  return (
    <>
      <Center
        bgGradient="radial-gradient(circle,rgba(55, 176, 134, 1) 0%, rgba(19, 122, 106, 1) 100%)"
        height={"100vh"}
      >
        <Center
          transform="translateY(-2px)"
          boxShadow="md"
          bgColor={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius={"8px"}
          p={"100px"}
        >
          {" "}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? "🌙" : "☀️"}
          </Button>
          <VStack p={"0px"}>
            {" "}
            <Image
              height="150px"
              overflow="hidden"
              objectFit="cover"
              src={LogoPena}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
              mb={"50px"}
            />
            <FormControl>
              <FormLabel fontSize={"24px"}>Akun Pengguna</FormLabel>
              <Input
                value={namaPengguna}
                onChange={(e) => setNamaPengguna(e.target.value)}
                variant={"primary"}
                height="60px"
                placeholder="masukkan NIP"
                w={"600px"}
              />
            </FormControl>
            <FormControl mt={"50px"}>
              <FormLabel fontSize={"24px"}>Password</FormLabel>
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant={"primary"}
                height="60px"
                w={"100%"}
                type="password"
              />
            </FormControl>
            <Button
              mt={"30px"}
              w={"100%"}
              onClick={handleSubmit}
              variant={"primary"}
              h={"60px"}
            >
              Login
            </Button>
          </VStack>
        </Center>
      </Center>
    </>
  );
};

export default Login;
