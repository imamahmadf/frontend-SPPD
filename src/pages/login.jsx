import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Reducers/auth"; // Import action creator
import { useHistory } from "react-router-dom";
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
  useDisclosure,
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
      <Center bgColor={"primary"} height={"100vh"}>
        <Center
          bgColor={"white"}
          height={"50vh"}
          width={"50vw"}
          borderRadius={"8px"}
          p={"0px"}
        >
          <VStack p={"0px"}>
            <FormControl>
              <FormLabel fontSize={"24px"}>Nama Pengguna</FormLabel>
              <Input
                value={namaPengguna}
                onChange={(e) => setNamaPengguna(e.target.value)}
                bgColor={"terang"}
                height="60px"
                placeholder="isi dengan asal "
                w={"600px"}
              />
            </FormControl>
            <FormControl mt={"50px"}>
              <FormLabel fontSize={"24px"}>Password</FormLabel>
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bgColor={"terang"}
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
