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
} from "@chakra-ui/react";
import { FaRoute } from "react-icons/fa";
import Logout from "../Logout";
import { Link, useHistory, useLocation } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { BsHouseDoor, BsStar, BsEnvelope } from "react-icons/bs";
import { useSelector } from "react-redux";
import LogoPena from "../../assets/penaLogo.png";
import LogoAset from "../../assets/asetLogo.png";
import LogoPegawai from "../../assets/pegawaiLogo.png";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../../Redux/Reducers/auth";
import Logo from "../../assets/logo.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { io } from "socket.io-client";
import LogoPerencanaan from "../../assets/perencanaanLogo.png";
const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

// Data menu untuk mapping
const menuData = [
  {
    title: "Kepegawaian",
    icon: HiOutlineUsers,
    pathPrefix: "/kepegawaian",
    items: [
      { label: "Daftar Pegawai", path: "/kepegawaian/daftar-pegawai" },
      { label: "Statistik Pegawai", path: "/kepegawaian/statistik-pegawai" },
      { label: "Data Saya", path: "/kepegawaian/profile" },
      { label: "Usulan Pegawai", path: "/kepegawaian/usulan" },
      {
        label: "Daftar Naik Jenjang",
        path: "/kepegawaian/daftar-naik-jenjang",
      },
      { label: "Pengaturan", path: "/kepegawaian/laporan-usulan-pegawai" },
    ],
  },
];

function NavbarPegawai() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const { colorMode, toggleColorMode } = useColorMode();
  const history = useHistory();
  const location = useLocation();
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
          borderColor={isActive ? "pegawai" : "transparent"}
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
            color={"white"}
            _hover={{ bg: "pegawai", color: "white" }}
            _after={{
              content: '""',
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: isActive ? "80%" : "0%",
              height: "3px",
              bg: "pegawai",
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
          bg="pegawai"
          px={4}
          py={4}
          height="100px"
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
            height="180px"
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
              <Button onClick={toggleColorMode} size="sm">
                {colorMode === "light" ? "🌙" : "☀️"}
              </Button>

              {isAuthenticated ? (
                <>
                  <Box>
                    <HStack spacing={6}>
                      {menuData.map((menu, index) => (
                        <MenuDropdown key={index} menu={menu} />
                      ))}
                    </HStack>
                  </Box>
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
                </>
              ) : (
                <Link to="/login">
                  <Button variant={"primary"} size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </HStack>
          </Flex>
        </Box>
      </Box>
      {/* Spacing untuk konten utama */}
      <Box /> {/* Spacer untuk konten */}
    </>
  );
}

export default NavbarPegawai;
