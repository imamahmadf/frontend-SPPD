import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import ReactPaginate from "react-paginate";
import "../../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
import { BsXCircle } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
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
  Th,
  Td,
  Flex,
  Textarea,
  Input,
  Spacer,
  Select,
} from "@chakra-ui/react";
import Loading from "../../Componets/Logout";
import { useSelector } from "react-redux";

function DaftarUserAdmin() {
  const [dataUser, setDataUser] = useState(null);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]); // Tambahkan state baru untuk menyimpan role pengguna yang dipilih
  const [availableRoles, setAvailableRoles] = useState([]);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const deleteRole = async () => {
    await axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/user/delete/user-role?userId=${currentUserId}&id=${selectedRole}`
      )
      .then((res) => {
        // console.log(res.data.result);
        // console.log(selectedRole);
        fetchDataUser();
        setAvailableRoles([]);
        onDeleteClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addUserRole = async () => {
    await axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/user/post/user-role?userId=${currentUserId}&roleId=${selectedRole}`
      )
      .then((res) => {
        // console.log(res.data.result);
        fetchDataUser();
        setSelectedRole("");
        setAvailableRoles([]);
        onAddClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  async function fetchRole() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-role`)
      .then((res) => {
        console.log(res.data, "GET ROLLEEEEE");
        setRole(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataUser() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get/user`)
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataUser(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  useEffect(() => {
    fetchDataUser();
    fetchRole();
  }, []);
  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
          <Container
            border={"1px"}
            borderRadius={"6px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            bgColor={"white"}
            p={"30px"}
          >
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Nama</Th>
                  <Th>Nama Pengguna</Th>
                  <Th>Unit Kerja</Th>
                  <Th>Role</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataUser?.map((user, index) => (
                  <Tr>
                    <Td>{index + 1}</Td>
                    <Td>{user.nama}</Td>
                    <Td>{user.namaPengguna}</Td>
                    <Td>{user.profiles[0].unitKerja_profile.unitKerja}</Td>
                    <Td>
                      <Text>
                        {user?.userRoles?.map((val) => (
                          <Text>{val.role.nama}</Text>
                        ))}
                      </Text>
                    </Td>
                    <Td>
                      {/* <Button>Hapus</Button> */}
                      <Flex gap={3}>
                        <Center
                          onClick={() => {
                            setCurrentUserId(user?.id);
                            onAddOpen();
                          }}
                          borderRadius={"5px"}
                          as="button"
                          h="35px"
                          w="35px"
                          fontSize="14px"
                          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                          color="white"
                          _hover={{
                            bg: "black",
                          }}
                          bg="primary"
                          // onClick={onOpen}
                        >
                          <BsPlusCircle />
                        </Center>{" "}
                        <Center
                          onClick={() => {
                            setCurrentUserId(user?.id);
                            setAvailableRoles(user.userRoles || []);
                            onDeleteOpen();
                          }}
                          borderRadius={"5px"}
                          as="button"
                          h="35px"
                          w="35px"
                          fontSize="14px"
                          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                          color="white"
                          _hover={{
                            bg: "black",
                          }}
                          bg="danger"
                        >
                          <BsXCircle />
                        </Center>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Container>
        </Box>
      )}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pilih Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            <Select
              placeholder="Pilih role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {role.map((roleItem) => (
                <option key={roleItem.id} value={roleItem.id}>
                  {roleItem.nama}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={addUserRole}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={onAddClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pilih Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Pilih role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {availableRoles.map(
                (
                  roleItem // Gunakan availableRoles
                ) => (
                  <option key={roleItem.id} value={roleItem.id}>
                    {roleItem.role.nama}
                  </option>
                )
              )}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={deleteRole}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default DaftarUserAdmin;
