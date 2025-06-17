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
  Flex,
  Avatar,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
} from "@chakra-ui/react";
import { FaRoute } from "react-icons/fa";
import Logout from "./Logout";
import { Link, useHistory } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { BsHouseDoor } from "react-icons/bs";
import { useSelector } from "react-redux";
import { BsStar } from "react-icons/bs";
import { BsEnvelope } from "react-icons/bs";
import { GoShieldLock } from "react-icons/go";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Logo from "../assets/logo.png";
import LogoPena from "../assets/Logo Pena.png";
import { HiOutlineUsers } from "react-icons/hi2";

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const { colorMode, toggleColorMode } = useColorMode();
  // console.log("Is Authenticated:", isAuthenticated);
  console.log("User Data:", user);
  const history = useHistory();

  return (
    <>
      {/* Top Navbar */}
      <Box
        position="fixed"
        top={0}
        left={isAuthenticated ? "250px" : "0px"}
        right={0}
        height="100px"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        zIndex={999}
        boxShadow="sm"
        borderBottom="1px"
        borderColor={colorMode === "dark" ? "gray.900" : "gray.200"}
        display="flex"
        alignItems="center"
        px={4}
        mx={"20px"}
      >
        <HStack spacing={4} width="100%" justifyContent="space-between">
          <Flex gap={3}>
            <Image height="60px" src={Logo} alt="Logo" />
            <Box>
              <Text fontSize={"20px"} fontWeight={700}>
                Dinas Kesehatan
              </Text>
              <Text mt={0} fontSize={"18px"}>
                Kabupaten Paser
              </Text>
            </Box>
          </Flex>
          {isAuthenticated ? (
            <HStack spacing={4}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? "🌙" : "☀️"}
              </Button>
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  <HStack>
                    <Avatar size="sm" name={user[0]?.nama} />
                    <Text>{user[0]?.nama}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <Link to={"/profile"}>
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuItem>
                    <Logout />
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <HStack spacing={4}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? "🌙" : "☀️"}
              </Button>
              <Link to="/login">
                <Button me={"20px"} variant={"primary"}>
                  Login
                </Button>
              </Link>
            </HStack>
          )}
        </HStack>
      </Box>

      {/* Sidebar */}
      {isAuthenticated ? (
        <>
          {" "}
          <Box
            position="fixed"
            top={0}
            left={0}
            height="100vh"
            bg={colorMode === "dark" ? "gray.800" : "white"}
            zIndex={1000}
            boxShadow="lg"
            borderRight="1px"
            borderColor={colorMode === "dark" ? "gray.900" : "gray.200"}
            width="250px"
            pt={"10px"}
          >
            <Container py={"15px"} maxW={"2480px"}>
              <VStack spacing={5} alignItems="flex-start">
                <VStack
                  spacing={2}
                  alignItems="center"
                  width="100%"
                  mb={"20px"}
                >
                  <Image
                    height="50px"
                    overflow="hidden"
                    objectFit="cover"
                    src={LogoPena}
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </VStack>

                <VStack spacing={4} width="100%">
                  <Box
                    as="button"
                    px={4}
                    py={2}
                    width="100%"
                    textAlign="left"
                    borderRadius="md"
                    transition="all 0.2s"
                    _hover={{
                      bg: "secondary",
                      color: "black",
                      transform: "translateX(5px)",
                      boxShadow: "md",
                    }}
                    onClick={() => history.push("/")}
                  >
                    <Text fontWeight="semibold">HOME</Text>
                  </Box>

                  {isAuthenticated ? (
                    <Accordion allowMultiple width="100%">
                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            gap={3}
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <FaRoute />

                            <Text>Perjalanan</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            <Link to="/perjalanan">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Perjalanan
                              </Box>
                            </Link>
                            <Link to="/daftar">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Perjalanan
                              </Box>
                            </Link>
                            <Link to="/rekap-perjalanan">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Rekap Perjalanan
                              </Box>
                            </Link>{" "}
                            <Link to="/kalender-kadis">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Perjalanan Kepala Dinas
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            gap={3}
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <BiWallet />
                            <Text>Keuangan</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            <Link to="/admin/keuangan/daftar-perjalanan">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Perjalanan
                              </Box>
                            </Link>
                            <Link to="/admin/keuangan/perjalanan">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Perjalanan Pegawai
                              </Box>
                            </Link>
                            <Link to="/admin/keuangan/template">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Template Keuangan
                              </Box>
                            </Link>
                            <Link to="/admin/dalam-kota">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Tujuan Dalam Kota
                              </Box>
                            </Link>
                            <Link to="/admin/keuangan/sumber-dana">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Sumber Dana
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <HiOutlineUsers /> <Text>Kepegawaian</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            <Link to="/daftar-pegawai">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Pegawai
                              </Box>
                            </Link>
                            <Link to="/statistik-pegawai">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Statistik Pegawai
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            gap={3}
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <BsStar /> <Text>Kepala Dinas</Text>
                          </HStack>

                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            {" "}
                            <Link to="/perjalanan-kadis">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Perjalanan
                              </Box>
                            </Link>
                            <Link to="/daftar/kadis">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Perjalanan
                              </Box>
                            </Link>
                            <Link to="/template-kadis">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Template Surat Tugas
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            gap={3}
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <BsHouseDoor />

                            <Text>Unit Kerja</Text>
                          </HStack>

                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            <Link to="/admin/induk-unit-kerja">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Induk Unit Kerja
                              </Box>
                            </Link>

                            <Link to="/unit-kerja/daftar-pegawai">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Pegawai
                              </Box>
                            </Link>

                            <Link to="/admin/daftar-bendahara">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Bendahara
                              </Box>
                            </Link>
                            <Link to="/admin/template">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Template Surat
                              </Box>
                            </Link>
                            <Link to="/admin/sub-kegiatan">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Sub Kegiatan
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            gap={3}
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <BsEnvelope />
                            <Text>Surat</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            <Link to="/admin/nomor-surat">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Pengaturan
                              </Box>
                            </Link>
                            <Link to="/admin/surat-keluar">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Surat Keluar
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>

                      <AccordionItem my={"20px"} border="none">
                        <AccordionButton
                          _hover={{ bg: "primary", color: "white" }}
                          borderRadius="md"
                        >
                          <HStack
                            gap={3}
                            flex="1"
                            textAlign="left"
                            fontWeight="semibold"
                          >
                            <GoShieldLock />
                            <Text>Administrator</Text>
                          </HStack>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack spacing={2} align="stretch">
                            <Link to="/admin/edit-jenis-surat">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Jenis Surat
                              </Box>
                            </Link>
                            <Link to="/admin/tambah-user">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Tambah pengguna
                              </Box>
                            </Link>
                            <Link to="/admin/daftar-user">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Pengguna
                              </Box>
                            </Link>
                            <Link to="/admin/daftar-induk-unit-kerja">
                              <Box
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                              >
                                Daftar Induk Unit Kerja
                              </Box>
                            </Link>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link to="/login" style={{ width: "100%" }}>
                      <Button variant="primary" width="100%">
                        Login
                      </Button>
                    </Link>
                  )}
                </VStack>
              </VStack>
            </Container>
          </Box>
        </>
      ) : null}

      {/* Main Content Spacing */}
    </>
  );
}

export default Navbar;
