import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Container,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Avatar,
  VStack,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
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
import { BiCar } from "react-icons/bi";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Logo from "../assets/logo.png";
import LogoPena from "../assets/Logo Pena.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { io } from "socket.io-client";
const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const { colorMode, toggleColorMode } = useColorMode();
  // console.log("Is Authenticated:", isAuthenticated);
  console.log("User Data:", user);
  const history = useHistory();
  const [jumlahNotifikasi, setJumlahNotifikasi] = useState(0);

  useEffect(() => {
    socket.on("notifikasi:terbaru", (data) => {
      console.log("📡 Notifikasi baru diterima di React:", data);
      if (data.count !== undefined) {
        console.log("🧠 Update state jumlahNotifikasi ke:", data.count);
        setJumlahNotifikasi(data.count);
      }
    });

    return () => {
      socket.off("notifikasi:terbaru");
    };
  }, []);

  useEffect(() => {
    socket.on("notifikasi:terbaru", (data) => {
      console.log("📡 Notifikasi baru:", data);
      if (data.count !== undefined) {
        setJumlahNotifikasi(data.count);
      }
    });

    return () => {
      socket.off("notifikasi:terbaru");
    };
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="80px"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        zIndex={999}
        boxShadow="sm"
        borderBottom="1px"
        borderColor={colorMode === "dark" ? "gray.900" : "gray.200"}
        display="flex"
        alignItems="center"
        px={4}
      >
        <HStack spacing={4} width="100%" justifyContent="space-between">
          {/* Logo dan Brand */}
          <Flex gap={3} alignItems="center">
            <Image height="50px" src={Logo} alt="Logo" />
            <Box>
              <Text fontSize={"18px"} fontWeight={700}>
                Dinas Kesehatan
              </Text>
              <Text mt={0} fontSize={"16px"}>
                Kabupaten Paser
              </Text>
            </Box>
          </Flex>

          {/* Navigation Menu */}
          {isAuthenticated && (
            <HStack spacing={2} flex={1} justifyContent="center">
              {/* Perjalanan */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<FaRoute />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Perjalanan
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/perjalanan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Perjalanan
                        </Box>
                      </Link>
                      <Link to="/daftar">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Perjalanan
                        </Box>
                      </Link>
                      <Link to="/rekap-perjalanan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Rekap Perjalanan
                        </Box>
                      </Link>
                      <Link to="/kalender-kadis">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Perjalanan Kepala Dinas
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Keuangan */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<BiWallet />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Keuangan
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/admin/keuangan/daftar-perjalanan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Perjalanan
                        </Box>
                      </Link>
                      <Link to="/admin/keuangan/perjalanan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Perjalanan Pegawai
                        </Box>
                      </Link>
                      <Link to="/admin/keuangan/template">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Template Keuangan
                        </Box>
                      </Link>
                      <Link to="/admin/dalam-kota">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Tujuan Dalam Kota
                        </Box>
                      </Link>
                      <Link to="/admin/keuangan/sumber-dana">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Sumber Dana
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Kepegawaian */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<HiOutlineUsers />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Kepegawaian
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/daftar-pegawai">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Pegawai
                        </Box>
                      </Link>
                      <Link to="/statistik-pegawai">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Statistik Pegawai
                        </Box>
                      </Link>
                      <Link to="/kepegawaian/profile">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Data Saya
                        </Box>
                      </Link>
                      <Link to="/pegawai/usulan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Usulan Pegawai
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Kepala Dinas */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<BsStar />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Kepala Dinas
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/perjalanan-kadis">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Perjalanan
                        </Box>
                      </Link>
                      <Link to="/daftar/kadis">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Perjalanan
                        </Box>
                      </Link>
                      <Link to="/template-kadis">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Template Surat Tugas
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Unit Kerja */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<BsHouseDoor />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Unit Kerja
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/admin/induk-unit-kerja">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Induk Unit Kerja
                        </Box>
                      </Link>
                      <Link to="/unit-kerja/daftar-pegawai">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Pegawai
                        </Box>
                      </Link>
                      <Link to="/admin/daftar-bendahara">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Bendahara
                        </Box>
                      </Link>
                      <Link to="/admin/template">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Template Surat
                        </Box>
                      </Link>
                      <Link to="/admin/sub-kegiatan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Sub Kegiatan
                        </Box>
                      </Link>
                      <Link to="/sijaka/kendaraan/unit-kerja">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Aset Kendaraan
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Surat */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<BsEnvelope />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Surat
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/admin/nomor-surat">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Pengaturan
                        </Box>
                      </Link>
                      <Link to="/admin/surat-keluar">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Surat Keluar
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Administrator */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<GoShieldLock />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Administrator
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/admin/edit-jenis-surat">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Jenis Surat
                        </Box>
                      </Link>
                      <Link to="/admin/tambah-user">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Tambah pengguna
                        </Box>
                      </Link>
                      <Link to="/admin/daftar-user">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Pengguna
                        </Box>
                      </Link>
                      <Link to="/admin/daftar-induk-unit-kerja">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Induk Unit Kerja
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              {/* Aset Kendaraan */}
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button
                    variant="ghost"
                    leftIcon={<BiCar />}
                    _hover={{ bg: "primary", color: "white" }}
                  >
                    Aset Kendaraan
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody p={2}>
                    <VStack spacing={1} align="stretch">
                      <Link to="/sijaka/daftar-kendaraan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Daftar Kendaraan
                        </Box>
                      </Link>
                      <Link to="/sijaka/daftar-kendaraan">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          Surat Pengantar
                        </Box>
                      </Link>
                      <Link to="/sijaka/template">
                        <Box
                          px={3}
                          py={2}
                          _hover={{ bg: "gray.100" }}
                          borderRadius="md"
                        >
                          template Surat
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          )}

          {/* User Menu dan Actions */}
          <HStack spacing={4}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? "🌙" : "☀️"}
            </Button>

            {isAuthenticated ? (
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  <HStack>
                    <Box position="relative">
                      <Avatar size="sm" name={user[0]?.nama} />
                      {jumlahNotifikasi > 0 && (
                        <Box
                          position="absolute"
                          top="-1"
                          right="-1"
                          bg="red.500"
                          color="white"
                          fontSize="xs"
                          fontWeight="bold"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          minW="5"
                          h="5"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {jumlahNotifikasi}
                        </Box>
                      )}
                    </Box>
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
            ) : (
              <Link to="/login">
                <Button variant={"primary"}>Login</Button>
              </Link>
            )}
          </HStack>
        </HStack>
      </Box>

      {/* Spacing untuk konten utama */}
      <Box height="80px" />
    </>
  );
}

export default Navbar;
