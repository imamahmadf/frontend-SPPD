import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
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
  Spacer,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  Divider,
} from "@chakra-ui/react";
import { FaRoute } from "react-icons/fa";
import Logout from "./Logout";
import { Link, useHistory, useLocation } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { BsHouseDoor, BsStar, BsEnvelope } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoShieldLock } from "react-icons/go";
import { BiCar } from "react-icons/bi";
import LogoPena from "../assets/penaLogo.png";
import LogoAset from "../assets/asetLogo.png";
import LogoPegawai from "../assets/pegawaiLogo.png";
import LogoPerencanaan from "../assets/perencanaanLogo.png";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Logo from "../assets/logo.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { io } from "socket.io-client";
import { FiMenu } from "react-icons/fi";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

// Data menu untuk mapping
const menuData = [
  {
    title: "Kendaraan",
    icon: BiCar,
    pathPrefix: "/kendaraan",
    items: [
      { label: "Kendaraan Saya", path: "/kendaraan/kendaraan-saya" },
      { label: "Perjalanan", path: "/kendaraan/perjalanan" },
      {
        label: "Daftar Perjalanan",
        path: "/kendaraan/daftar-perjalanan-kendaraan",
      },
      { label: "Admin Kendaraan", path: "/kendaraan/daftar-kendaraan" },
    ],
  },
  {
    title: "Perjalanan",
    icon: FaRoute,
    pathPrefix: "/perjalanan",
    items: [
      { label: "Perjalanan", path: "/perjalanan" },
      { label: "Daftar Perjalanan", path: "/perjalanan/daftar" },
      { label: "Kwitansi Global", path: "/perjalanan/kwitansi-global" },
      { label: "Rekap Perjalanan", path: "/perjalanan/rekap" },
      { label: "Perjalanan Kepala Dinas", path: "/perjalanan/kalender-kadis" },
    ],
  },
  {
    title: "Keuangan",
    icon: BiWallet,
    pathPrefix: "/keuangan",
    items: [
      {
        label: "Daftar Kwitansi Global",
        path: "/keuangan/daftar-kwitansi-global",
      },
      { label: "Daftar Perjalanan", path: "/keuangan/daftar-perjalanan" },
      { label: "Perjalanan Pegawai", path: "/keuangan/perjalanan-pegawai" },
      { label: "Template Keuangan", path: "/keuangan/template" },
      { label: "Daftar Tujuan Dalam Kota", path: "/keuangan/dalam-kota" },
      { label: "Sumber Dana", path: "/keuangan/sumber-dana" },
    ],
  },
  // {
  //   title: "Kepegawaian",
  //   icon: HiOutlineUsers,
  //   pathPrefix: "/kepegawaian",
  //   items: [
  //     { label: "Daftar Pegawai", path: "/kepegawaian/daftar-pegawai" },
  //     { label: "Statistik Pegawai", path: "/kepegawaian/statistik-pegawai" },
  //     { label: "Data Saya", path: "/kepegawaian/profile" },
  //     { label: "Usulan Pegawai", path: "/kepegawaian/usulan" },
  //   ],
  // },
  {
    title: "Kepala Dinas",
    icon: BsStar,
    pathPrefix: "/kepala-dinas",
    items: [
      { label: "Perjalanan", path: "/kepala-dinas/perjalanan-kadis" },
      { label: "Daftar Perjalanan", path: "/kepala-dinas/daftar-kadis" },
      { label: "Template Surat Tugas", path: "/kepala-dinas/template-kadis" },
    ],
  },
  {
    title: "Unit Kerja",
    icon: BsHouseDoor,
    pathPrefix: "/unit-kerja",
    items: [
      { label: "Induk Unit Kerja", path: "/unit-kerja/induk-unit-kerja" },
      { label: "Daftar Pegawai", path: "/unit-kerja/daftar-pegawai" },
      { label: "Daftar Bendahara", path: "/unit-kerja/daftar-bendahara" },
      { label: "Template Surat", path: "/unit-kerja/template" },
      { label: "Sub Kegiatan", path: "/unit-kerja/sub-kegiatan" },
    ],
  },
  {
    title: "Surat",
    icon: BsEnvelope,
    pathPrefix: "/surat",
    items: [
      { label: "Pengaturan", path: "/surat/nomor" },
      { label: "Daftar Surat Keluar", path: "/surat/surat-keluar" },
      { label: "Daftar SPPD", path: "/surat/sppd" },
    ],
  },
  {
    title: "Administrator",
    icon: GoShieldLock,
    pathPrefix: "/admin",
    items: [
      { label: "Jenis Surat", path: "/admin/edit-jenis-surat" },
      { label: "Tambah pengguna", path: "/admin/tambah-user" },
      { label: "Daftar Pengguna", path: "/admin/daftar-user" },
      {
        label: "Daftar Induk Unit Kerja",
        path: "/admin/daftar-induk-unit-kerja",
      },
    ],
  },
];

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const { colorMode, toggleColorMode } = useColorMode();
  const history = useHistory();
  const location = useLocation();
  const [jumlahNotifikasi, setJumlahNotifikasi] = useState(0);
  const {
    isOpen: isMobileMenuOpen,
    onOpen: openMobileMenu,
    onClose: closeMobileMenu,
  } = useDisclosure();
  const headerSpacerHeight = useBreakpointValue({ base: "120px", md: "140px" });

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

  // Fungsi untuk mengecek apakah menu sedang aktif
  const isMenuActive = (menu) => {
    if (!menu.pathPrefix) return false;
    return location.pathname.startsWith(menu.pathPrefix);
  };

  // Fungsi untuk mengecek apakah item menu sedang aktif
  const isItemActive = (itemPath) => {
    return location.pathname === itemPath;
  };

  // Komponen untuk menu item
  const MenuItemComponent = ({ item }) => {
    if (!item || !item.path || !item.label) {
      return null;
    }

    const isActive = isItemActive(item.path);

    return (
      <Link to={item.path}>
        <Box
          px={3}
          py={2}
          _hover={{ bg: "gray.100" }}
          borderRadius="md"
          borderBottom={isActive ? "2px solid" : "none"}
          borderColor={isActive ? "primary" : "transparent"}
          fontWeight={isActive ? "semibold" : "normal"}
        >
          {item.label}
        </Box>
      </Link>
    );
  };

  // Komponen untuk menu dropdown
  const MenuDropdown = ({ menu }) => {
    if (!menu || !menu.title || !menu.items || !Array.isArray(menu.items)) {
      return null;
    }

    const IconComponent = menu.icon;
    const isActive = isMenuActive(menu);

    // State untuk hover
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        // Chakra UI Popover tidak punya onOpen, jadi kita atur manual
      >
        <PopoverTrigger>
          <Button
            variant="ghost"
            leftIcon={<IconComponent />}
            position="relative"
            _hover={{ bg: "primary", color: "white" }}
            _after={{
              content: '""',
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: isActive ? "80%" : "0%",
              height: "3px",
              bg: "primary",
              transition: "width 0.2s ease-in-out",
            }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {menu.title}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          mt={1}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <PopoverArrow />
          <PopoverBody p={2}>
            <VStack spacing={1} align="stretch">
              {menu.items.map((item, index) => (
                <MenuItemComponent key={index} item={item} />
              ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <>
      {/* Main Navbar */}
      <Box position="fixed" top={0} left={0} right={0} zIndex={999}>
        {/* Header Oranye */}
        <Box
          bg="primary"
          px={4}
          py={4}
          height={{ base: "auto", md: "100px" }}
          boxShadow="sm"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* Atas: Logo dan User */}
          <Flex
            width="95vw"
            justifyContent="center"
            alignItems="center"
            height={{ base: "auto", md: "180px" }}
          >
            {/* Logo dan Brand */}
            <Flex gap={3} alignItems="center">
              <Image height="40px" src={Logo} alt="Logo" />
              <Box>
                <Text color={"white"} fontSize={"16px"} fontWeight={700}>
                  Dinas Kesehatan
                </Text>
                <Text color={"white"} mt={0} fontSize={"14px"}>
                  Kabupaten Paser
                </Text>
              </Box>
            </Flex>
            <Spacer />
            {/* User Menu dan Actions */}
            <HStack spacing={4}>
              {/* Tombol Hamburger untuk Mobile */}
              {isAuthenticated && (
                <IconButton
                  aria-label="Buka menu"
                  icon={<FiMenu />}
                  display={{ base: "inline-flex", md: "none" }}
                  onClick={openMobileMenu}
                  colorScheme="whiteAlpha"
                  variant="ghost"
                />
              )}
              <Button onClick={toggleColorMode} size="sm">
                {colorMode === "light" ? "🌙" : "☀️"}
              </Button>

              {isAuthenticated ? (
                <Box display={{ base: "none", md: "block" }}>
                  <Menu>
                    <MenuButton as={Button} variant="ghost" size="sm">
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
                        <Text color={"white"} fontSize="sm">
                          {user[0]?.nama}
                        </Text>
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      <Link to={"/profile"}>
                        <MenuItem>
                          <Avatar me={"10px"} w={"20px"} h={"20px"} />
                          Profile
                        </MenuItem>
                      </Link>
                      <Link to={"/"}>
                        <MenuItem>
                          <Image me={"10px"} h={"20px"} src={LogoPena} />
                          Pena
                        </MenuItem>
                      </Link>
                      <Link to={"/aset/dashboard"}>
                        <MenuItem>
                          <Image me={"10px"} h={"20px"} src={LogoAset} />
                          Aset
                        </MenuItem>
                      </Link>
                      <Link to={"/pegawai/dashboard"}>
                        <MenuItem>
                          <Image me={"10px"} h={"20px"} src={LogoPegawai} />
                          Kepegawaian
                        </MenuItem>
                      </Link>
                      <Link to={"/perencanaan"}>
                        <MenuItem>
                          <Image me={"10px"} h={"20px"} src={LogoPerencanaan} />
                          perencanaan
                        </MenuItem>
                      </Link>
                      <MenuItem>
                        <Logout />
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              ) : (
                <Box display={{ base: "none", md: "block" }}>
                  <Link to="/login">
                    <Button variant={"primary"} size="sm">
                      Login
                    </Button>
                  </Link>
                </Box>
              )}
            </HStack>
          </Flex>

          {/* Bawah: Menu Putih */}
          {isAuthenticated && (
            <Box
              bg="white"
              boxShadow="md"
              borderRadius="md"
              px={6}
              py={3}
              width="95vw"
              mx="auto"
              mt={"20px"} // Jarak dari header ke menu
              display={{ base: "none", md: "flex" }}
              alignItems="center"
              justifyContent="center"
            >
              <HStack spacing={6}>
                {menuData.map((menu, index) => (
                  <MenuDropdown key={index} menu={menu} />
                ))}
              </HStack>
            </Box>
          )}
          {/* Drawer Menu Mobile */}
          {isAuthenticated && (
            <Drawer
              placement="left"
              onClose={closeMobileMenu}
              isOpen={isMobileMenuOpen}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
                <DrawerBody>
                  <VStack align="stretch" spacing={4}>
                    {menuData.map((menu, idx) => (
                      <Box key={idx}>
                        <Text fontWeight="bold" mb={2}>
                          {menu.title}
                        </Text>
                        <VStack align="stretch" spacing={1}>
                          {menu.items?.map((item, i) => (
                            <Link
                              key={i}
                              to={item.path}
                              onClick={closeMobileMenu}
                            >
                              <Box
                                px={3}
                                py={2}
                                borderRadius="md"
                                bg={
                                  isItemActive(item.path)
                                    ? "gray.100"
                                    : "transparent"
                                }
                                _hover={{ bg: "gray.100" }}
                              >
                                {item.label}
                              </Box>
                            </Link>
                          ))}
                        </VStack>
                        {idx !== menuData.length - 1 && <Divider mt={3} />}
                      </Box>
                    ))}
                    <Divider />
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Akun
                      </Text>
                      <VStack align="stretch" spacing={1}>
                        <Link to={"/profile"} onClick={closeMobileMenu}>
                          <Box
                            px={3}
                            py={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100" }}
                          >
                            Profile
                          </Box>
                        </Link>
                        <Link to={"/"} onClick={closeMobileMenu}>
                          <Box
                            px={3}
                            py={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100" }}
                          >
                            Pena
                          </Box>
                        </Link>
                        <Link to={"/aset/dashboard"} onClick={closeMobileMenu}>
                          <Box
                            px={3}
                            py={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100" }}
                          >
                            Aset
                          </Box>
                        </Link>
                        <Link
                          to={"/pegawai/dashboard"}
                          onClick={closeMobileMenu}
                        >
                          <Box
                            px={3}
                            py={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100" }}
                          >
                            Kepegawaian
                          </Box>
                        </Link>
                        <Link to={"/perencanaan"} onClick={closeMobileMenu}>
                          <Box
                            px={3}
                            py={2}
                            borderRadius="md"
                            _hover={{ bg: "gray.100" }}
                          >
                            Perencanaan
                          </Box>
                        </Link>
                        <Box px={3} py={2} borderRadius="md">
                          <Logout />
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          )}
        </Box>
      </Box>
      {/* Spacing untuk konten utama */}
      <Box height={headerSpacerHeight} /> {/* Spacer untuk konten */}
    </>
  );
}

export default Navbar;
