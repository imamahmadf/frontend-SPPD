import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
  Table,
  Spacer,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Avatar,
} from "@chakra-ui/react";
import Logout from "./Logout";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Logo from "../assets/logo.png";
import LogoPena from "../assets/Logo Pena.png";

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  // console.log("Is Authenticated:", isAuthenticated);
  console.log("User Data:", user);
  const history = useHistory();

  return (
    <Box
      color={"primary"}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="white"
      zIndex={1000}
      boxShadow="lg"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Container py={"15px"} maxW={"2480px"}>
        <HStack gap={5} alignItems="center">
          <HStack spacing={2}>
            <Image
              height="50px"
              overflow="hidden"
              objectFit="cover"
              src={Logo}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            />
            {/* <Box fontWeight={500} color={"gelap"} me={"10px"}>
              <Text>Dinas Kesehatan</Text>
              <Text>Kabupaten Paser</Text>
            </Box> */}
            <Image
              height="50px"
              overflow="hidden"
              objectFit="cover"
              src={LogoPena}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            />
          </HStack>

          <Spacer />

          <HStack spacing={4}>
            <Box
              as="button"
              px={4}
              py={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{
                bg: "secondary",
                color: "black",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              onClick={() => history.push("/")}
            >
              <Text fontWeight="semibold">HOME</Text>
            </Box>

            {isAuthenticated ? (
              <>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    _hover={{ bg: "gray.100" }}
                    _active={{ bg: "gray.200" }}
                  >
                    PERJALANAN
                  </MenuButton>
                  <MenuList
                    color={"black"}
                    boxShadow="xl"
                    borderRadius="lg"
                    border="none"
                  >
                    <Link to={"/perjalanan"}>
                      <MenuItem
                        _hover={{ bg: "gray.100" }}
                        transition="all 0.2s"
                      >
                        Perjalanan
                      </MenuItem>
                    </Link>
                    <Link to={"/daftar"}>
                      <MenuItem
                        _hover={{ bg: "gray.100" }}
                        transition="all 0.2s"
                      >
                        Daftar Perjalanan
                      </MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton as={Button}>Keuangan</MenuButton>
                  <MenuList color={"black"}>
                    <Link to={"/admin/keuangan/daftar-perjalanan"}>
                      <MenuItem>Daftar</MenuItem>
                    </Link>
                    <Link to={"/admin/keuangan/perjalanan"}>
                      <MenuItem>Perjalanan</MenuItem>
                    </Link>
                    <Link to={"/admin/keuangan/template"}>
                      <MenuItem>Template</MenuItem>
                    </Link>
                    <Link to={"/admin/dalam-kota"}>
                      <MenuItem>Daftar Dalam Kota</MenuItem>
                    </Link>
                    <Link to={"/admin/keuangan/sumber-dana"}>
                      <MenuItem>Sumber Dana</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton as={Button}>Kepegawaian</MenuButton>
                  <MenuList color={"black"}>
                    <Link to={"/daftar-pegawai"}>
                      <MenuItem>Daftar Pegawai</MenuItem>
                    </Link>
                    <Link to={"/statistik-pegawai"}>
                      <MenuItem>Statistik Pegawai</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton as={Button}>ADMIN</MenuButton>
                  <MenuList color={"black"}>
                    <Link to={"/admin/induk-unit-kerja"}>
                      <MenuItem>Induk Unit Kerja</MenuItem>
                    </Link>{" "}
                    <Link to={"/admin/daftar-bendahara"}>
                      <MenuItem>Daftar Bendahara</MenuItem>
                    </Link>
                    <Link to={"/admin/template"}>
                      <MenuItem>Template</MenuItem>
                    </Link>
                    <Link to={"/admin/sub-kegiatan"}>
                      <MenuItem>Sub Kegiatan</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton as={Button}>SURAT</MenuButton>
                  <MenuList color={"black"}>
                    <Link to={"/admin/nomor-surat"}>
                      <MenuItem>Pengaturan</MenuItem>
                    </Link>{" "}
                    <Link to={"/admin/surat-keluar"}>
                      <MenuItem>Daftar Surat Keluar</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton as={Button}>ADMIN PUSAT</MenuButton>
                  <MenuList color={"black"}>
                    <Link to={"/admin/edit-jenis-surat"}>
                      <MenuItem>Jenis Surat</MenuItem>
                    </Link>
                    <Link to={"/admin/tambah-user"}>
                      <MenuItem>Pengaturan Pengguna</MenuItem>
                    </Link>
                    <Link to={"/admin/daftar-user"}>
                      <MenuItem>Daftar Pengguna</MenuItem>
                    </Link>

                    <Link to={"/admin/daftar-induk-unit-kerja"}>
                      <MenuItem>Daftar Induk Unit Kerja</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>

                <Menu bgColor={"white"}>
                  <MenuButton py={"auto"} bgColor={"white"} as={Button}>
                    <Avatar h={"40px"} w={"40px"} /> {user[0].nama}
                  </MenuButton>
                  <MenuList color={"black"}>
                    <Link to={"/profile"}>
                      <MenuItem>Profile</MenuItem>
                    </Link>
                    <MenuItem>
                      <Logout />
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <Link to={"/login"}>
                <Button variant={"primary"}>Login</Button>
              </Link>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}

export default Navbar;
