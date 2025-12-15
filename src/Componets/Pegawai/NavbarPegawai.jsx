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
  Icon,
  Badge,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaRoute,
  FaBell,
  FaBars,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link, useHistory, useLocation } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { BsHouseDoor, BsStar, BsEnvelope } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import LogoPena from "../../assets/penaLogo.png";
import LogoAset from "../../assets/asetLogo.png";
import LogoPegawai from "../../assets/pegawaiLogo.png";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
  performLogout,
} from "../../Redux/Reducers/auth";
import Logo from "../../assets/logo.png";
import { HiOutlineUsers } from "react-icons/hi2";
import { io } from "socket.io-client";
import LogoPerencanaan from "../../assets/perencanaanLogo.png";
import { useColorModeValues } from "../../Style/colorModeValues";
const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

// Data menu untuk mapping
const menuData = [
  {
    title: "ASN",
    icon: HiOutlineUsers,
    pathPrefix: "/kepegawaian-ASN",
    items: [
      { label: "Usulan Naik Pangkat", path: "/kepegawaian-ASN/naik-golongan" },
      { label: "Usulan Naik Jenjang", path: "/kepegawaian-ASN/naik-jenjang" },
      { label: "Data Saya", path: "/kepegawaian/profile" },
      // { label: "Laporan PJPL", path: "/kepegawaian/daftar-laporan-pjpl" },
      { label: "Laporan PJPL", path: "/kepegawaian-ASN/atasan/daftar-kontrak" },
    ],
  },
  {
    title: "PJPL",
    icon: HiOutlineUsers,
    pathPrefix: "/kepegawaian-PJPL",
    items: [{ label: "Kinerja PJPL", path: "/kepegawaian-PJPL/kinerja-PJPL" }],
  },
  {
    title: "Administrator",
    icon: HiOutlineUsers,
    pathPrefix: "/admin-pegawai",
    items: [
      { label: "Daftar Pegawai", path: "/admin-pegawai/daftar-pegawai" },
      { label: "Statistik Pegawai", path: "/admin-pegawai/statistik-pegawai" },
      {
        label: "Pejabat Verifikator",
        path: "/admin-pegawai/pejabat-verifikator",
      },

      { label: "Kontrak PJPL", path: "/admin-pegawai/kontrak-PJPL" },

      {
        label: "Daftar Naik Jenjang",
        path: "/admin-pegawai/daftar-naik-jenjang",
      },
      { label: "Pengaturan", path: "/admin-pegawai/laporan-usulan-pegawai" },
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
  const dispatch = useDispatch();
  const [jumlahNotifikasi, setJumlahNotifikasi] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accordionIndex, setAccordionIndex] = useState(-1);
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // Color mode values untuk mobile drawer (dari Style folder)
  const {
    drawerBg,
    boxBg,
    textColor,
    textColorLight,
    borderColor,
    borderColorLight,
    borderColorDark,
    hoverBg,
    hoverBgWhite,
    accordionPanelBg,
    footerBoxShadow,
  } = useColorModeValues();

  const handleLogout = () => {
    dispatch(performLogout());
    setIsDrawerOpen(false);
  };

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
  const MenuItemComponent = ({ item, onItemClick }) => {
    if (!item || !item.path || !item.label) {
      return null;
    }

    const isActive = isItemActive(item.path);

    return (
      <Link to={item.path} onClick={onItemClick}>
        <Box
          px={4}
          py={3}
          borderRadius="xl"
          bg={isActive ? "pegawai" : "transparent"}
          color={isActive ? "white" : "gray.700"}
          fontWeight={isActive ? "700" : "600"}
          fontSize="14px"
          position="relative"
          overflow="hidden"
          _hover={{
            bg: isActive ? "pegawaiGelap" : "gray.50",
            transform: "translateX(6px)",
            boxShadow: isActive
              ? "0 4px 12px rgba(185, 28, 28, 0.3)"
              : "0 2px 8px rgba(0, 0, 0, 0.08)",
            _before: {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              bg: isActive ? "white" : "pegawai",
              borderRadius: "0 4px 4px 0",
            },
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          borderLeft={isActive ? "4px solid" : "4px solid transparent"}
          borderColor={isActive ? "white" : "transparent"}
          mx={1}
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

    // State untuk hover dan klik
    const [isOpen, setIsOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Handler untuk toggle saat diklik
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newState = !isOpen;
      setIsOpen(newState);
      setIsClicked(newState);
    };

    // Handler untuk mouse enter (hover)
    const handleMouseEnter = () => {
      setIsOpen(true);
    };

    // Handler untuk mouse leave (hanya tutup jika tidak diklik)
    const handleMouseLeave = () => {
      if (!isClicked) {
        setIsOpen(false);
      }
    };

    // Handler untuk menutup saat klik di luar
    const handleClose = () => {
      setIsOpen(false);
      setIsClicked(false);
    };

    // Handler untuk menutup saat item menu diklik
    const handleItemClick = () => {
      // Tidak menutup submenu saat item diklik, biarkan user navigasi
      // Submenu akan menutup otomatis saat klik di luar (closeOnBlur)
    };

    return (
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onClose={handleClose}
        closeOnBlur={true}
      >
        <PopoverTrigger>
          <Button
            variant="ghost"
            leftIcon={<IconComponent />}
            position="relative"
            color={{
              base: "white",
              lg: isActive ? "white" : "gray.700",
            }}
            fontWeight="700"
            fontSize="15px"
            px={5}
            py={3}
            borderRadius="xl"
            bg={{
              base: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
              lg: isActive ? "pegawai" : "transparent",
            }}
            backdropFilter={{
              base: "blur(10px)",
              lg: "none",
            }}
            border="1px solid"
            borderColor={{
              base: isActive ? "rgba(255, 255, 255, 0.3)" : "transparent",
              lg: isActive ? "pegawai" : "transparent",
            }}
            boxShadow={{
              base: isActive
                ? "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                : "none",
              lg: isActive ? "0 4px 12px rgba(185, 28, 28, 0.3)" : "none",
            }}
            _hover={{
              bg: {
                base: "rgba(255, 255, 255, 0.25)",
                lg: isActive ? "pegawaiGelap" : "pegawai",
              },
              color: {
                base: "white",
                lg: "white",
              },
              transform: "translateY(-2px)",
              borderColor: {
                base: "rgba(255, 255, 255, 0.4)",
                lg: "pegawai",
              },
              boxShadow: {
                base: "0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                lg: "0 6px 16px rgba(185, 28, 28, 0.4)",
              },
            }}
            _active={{
              bg: {
                base: "rgba(255, 255, 255, 0.3)",
                lg: "pegawaiGelap",
              },
              transform: "translateY(0px)",
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _after={{
              content: '""',
              position: "absolute",
              bottom: "4px",
              left: "50%",
              transform: "translateX(-50%)",
              width: isActive ? "70%" : "0%",
              height: "3px",
              bg: {
                base: "white",
                lg: "white",
              },
              borderRadius: "full",
              boxShadow: {
                base: "0 0 8px rgba(255, 255, 255, 0.6)",
                lg: "0 0 8px rgba(255, 255, 255, 0.8)",
              },
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {menu.title}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          mt={3}
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
          backdropFilter="blur(20px)"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            bgGradient: "linear(to-r, pegawai, pegawaiGelap)",
          }}
        >
          <PopoverArrow
            bg="white"
            borderColor="gray.200"
            borderWidth="1px"
            borderTop="none"
            borderLeft="none"
          />
          <PopoverBody p={2}>
            <VStack spacing={0.5} align="stretch">
              {menu.items.map((item, index) => (
                <MenuItemComponent
                  key={index}
                  item={item}
                  onItemClick={handleItemClick}
                />
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
        {/* Header dengan Gradient dan Glassmorphism */}
        <Box
          bgGradient={{
            base: "linear(to-r, pegawai, pegawaiGelap)",
            lg: "none",
          }}
          bg={{
            lg: colorMode === "light" ? "white" : "gray.800",
          }}
          px={{ base: 4, md: 6, lg: 8 }}
          py={5}
          minH="85px"
          boxShadow={{
            base: "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
            lg:
              colorMode === "light"
                ? "0 2px 8px rgba(0, 0, 0, 0.08)"
                : "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
          position="relative"
          borderBottom={{
            base: "none",
            lg: "1px solid",
          }}
          borderColor={{
            base: "transparent",
            lg: colorMode === "light" ? "gray.200" : "gray.700",
          }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: {
              base: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
              lg: "transparent",
            },
            pointerEvents: "none",
          }}
        >
          {/* Container untuk konten navbar */}
          <Flex
            maxW="1400px"
            mx="auto"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
            flexWrap="nowrap"
          >
            {/* Left Section: Logo */}
            <Flex
              gap={4}
              alignItems="center"
              flexShrink={0}
              flex="1"
              position="relative"
              zIndex={1}
            >
              {/* Logo dan Brand */}
              <Flex gap={4} alignItems="center" flexShrink={0}>
                {" "}
                <Box
                  p={3}
                  bg="rgba(255, 255, 255, 0.2)"
                  borderRadius="xl"
                  backdropFilter="blur(20px)"
                  boxShadow="0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "scale(1.05) translateY(-2px)",
                    boxShadow:
                      "0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                    bg: "rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <Image height="42px" src={LogoPegawai} alt="Logo" />
                </Box>
                <Box
                  p={3}
                  bg="rgba(255, 255, 255, 0.2)"
                  borderRadius="xl"
                  backdropFilter="blur(20px)"
                  boxShadow="0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "scale(1.05) translateY(-2px)",
                    boxShadow:
                      "0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                    bg: "rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <Image height="42px" src={Logo} alt="Logo" />
                </Box>
                <Box display={{ base: "none", sm: "block" }}>
                  <Text
                    color={{
                      base: "white",
                      lg: colorMode === "light" ? "gray.800" : "white",
                    }}
                    fontSize={{ base: "15px", md: "17px" }}
                    fontWeight={800}
                    letterSpacing="0.3px"
                    textShadow={{
                      base: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      lg: "none",
                    }}
                  >
                    Dinas Kesehatan
                  </Text>
                  <Text
                    color={{
                      base: "whiteAlpha.900",
                      lg: colorMode === "light" ? "gray.600" : "gray.300",
                    }}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight={500}
                    letterSpacing="0.2px"
                    mt={0.5}
                  >
                    Kabupaten Paser
                  </Text>
                </Box>
              </Flex>
            </Flex>

            {/* Center Section: Menu Navigation - Hidden on mobile */}
            <Box
              display={{ base: "none", lg: "block" }}
              flex="1"
              mx={6}
              position="relative"
              zIndex={1}
            >
              <HStack spacing={1} justifyContent="center">
                {menuData.map((menu, index) => (
                  <MenuDropdown key={index} menu={menu} />
                ))}
              </HStack>
            </Box>

            {/* Right Section: User Menu (Desktop) dan Hamburger (Mobile) */}
            <HStack spacing={3} flexShrink={0} position="relative" zIndex={1}>
              {/* Color Mode Toggle - Hidden on mobile */}
              <IconButton
                display={{ base: "none", lg: "flex" }}
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
                icon={<Icon as={colorMode === "light" ? FaMoon : FaSun} />}
                size="md"
                variant="ghost"
                color={colorMode === "light" ? "gray.700" : "gray.200"}
                borderRadius="xl"
                bg={colorMode === "light" ? "gray.100" : "gray.700"}
                border="1px solid"
                borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                _hover={{
                  bg: colorMode === "light" ? "gray.200" : "gray.600",
                  transform: "scale(1.1) rotate(15deg)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  borderColor: colorMode === "light" ? "gray.300" : "gray.500",
                }}
                _active={{
                  transform: "scale(0.95) rotate(0deg)",
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              />

              {/* User Menu - Hidden on mobile, shown on desktop */}
              {isAuthenticated ? (
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      size="md"
                      color={colorMode === "light" ? "gray.700" : "gray.200"}
                      display={{ base: "none", lg: "flex" }}
                      borderRadius="xl"
                      bg={colorMode === "light" ? "gray.100" : "gray.700"}
                      border="1px solid"
                      borderColor={
                        colorMode === "light" ? "gray.200" : "gray.600"
                      }
                      px={3}
                      py={2}
                      _hover={{
                        bg: colorMode === "light" ? "gray.200" : "gray.600",
                        borderColor:
                          colorMode === "light" ? "gray.300" : "gray.500",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                      _active={{
                        bg: colorMode === "light" ? "gray.300" : "gray.500",
                        transform: "translateY(0px)",
                      }}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      <HStack spacing={3}>
                        <Box position="relative">
                          <Avatar
                            size="sm"
                            name={user[0]?.nama}
                            border="2px solid"
                            borderColor={
                              colorMode === "light" ? "gray.300" : "gray.600"
                            }
                            boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                          />
                          {jumlahNotifikasi > 0 && (
                            <Badge
                              position="absolute"
                              top="-2"
                              right="-2"
                              bg="red.500"
                              color="white"
                              fontSize="10px"
                              fontWeight="bold"
                              borderRadius="full"
                              minW="6"
                              h="6"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              boxShadow="0 2px 8px rgba(220, 38, 38, 0.4)"
                              border="2px solid white"
                              animation="pulse 2s infinite"
                            >
                              {jumlahNotifikasi > 9 ? "9+" : jumlahNotifikasi}
                            </Badge>
                          )}
                        </Box>
                        <Text
                          color={
                            colorMode === "light" ? "gray.700" : "gray.200"
                          }
                          fontSize="sm"
                          fontWeight="700"
                          letterSpacing="0.2px"
                        >
                          {user[0]?.nama}
                        </Text>
                      </HStack>
                    </MenuButton>
                    <MenuList
                      boxShadow="0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)"
                      borderRadius="2xl"
                      border="1px solid"
                      borderColor="gray.200"
                      mt={3}
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        bgGradient: "linear(to-r, pegawai, pegawaiGelap)",
                      }}
                    >
                      <Link to={"/profile"}>
                        <MenuItem
                          icon={<Avatar size="xs" name={user[0]?.nama} />}
                          _hover={{
                            bg: "gray.50",
                            transform: "translateX(4px)",
                            transition: "all 0.2s ease",
                          }}
                          borderRadius="lg"
                          transition="all 0.2s ease"
                        >
                          Profile
                        </MenuItem>
                      </Link>
                      <Link to={"/"}>
                        <MenuItem
                          icon={<Image h={"20px"} src={LogoPena} />}
                          _hover={{
                            bg: "gray.50",
                            transform: "translateX(4px)",
                            transition: "all 0.2s ease",
                          }}
                          borderRadius="lg"
                          transition="all 0.2s ease"
                        >
                          Pena
                        </MenuItem>
                      </Link>
                      <Link to={"/aset/dashboard"}>
                        <MenuItem
                          icon={<Image h={"20px"} src={LogoAset} />}
                          _hover={{
                            bg: "gray.50",
                            transform: "translateX(4px)",
                            transition: "all 0.2s ease",
                          }}
                          borderRadius="lg"
                          transition="all 0.2s ease"
                        >
                          Aset
                        </MenuItem>
                      </Link>
                      <Link to={"/pegawai/dashboard"}>
                        <MenuItem
                          icon={<Image h={"20px"} src={LogoPegawai} />}
                          _hover={{
                            bg: "gray.50",
                            transform: "translateX(4px)",
                            transition: "all 0.2s ease",
                          }}
                          borderRadius="lg"
                          transition="all 0.2s ease"
                        >
                          Kepegawaian
                        </MenuItem>
                      </Link>
                      <Link to={"/perencanaan"}>
                        <MenuItem
                          icon={<Image h={"20px"} src={LogoPerencanaan} />}
                          _hover={{
                            bg: "gray.50",
                            transform: "translateX(4px)",
                            transition: "all 0.2s ease",
                          }}
                          borderRadius="lg"
                          transition="all 0.2s ease"
                        >
                          Perencanaan
                        </MenuItem>
                      </Link>
                      <Box px={2} py={1}>
                        <Box
                          as="hr"
                          borderColor="gray.200"
                          borderWidth="1px"
                          my={1}
                        />
                      </Box>
                      <MenuItem
                        icon={<Icon as={FaSignOutAlt} />}
                        _hover={{
                          bg: "red.50",
                          color: "red.600",
                          transform: "translateX(4px)",
                          transition: "all 0.2s ease",
                        }}
                        onClick={handleLogout}
                        color="red.500"
                        fontWeight="700"
                        borderRadius="lg"
                        transition="all 0.2s ease"
                      >
                        Keluar
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <Link to="/login">
                  <Button
                    variant={"primary"}
                    size="sm"
                    display={{ base: "none", lg: "flex" }}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.2s ease"
                  >
                    Login
                  </Button>
                </Link>
              )}

              {/* Hamburger Menu Button - Visible on mobile, positioned on right */}
              <IconButton
                display={{ base: "flex", lg: "none" }}
                aria-label="Open menu"
                icon={<FaBars />}
                size="md"
                variant="ghost"
                color="white"
                onClick={() => setIsDrawerOpen(true)}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.15)",
                  transform: "scale(1.1)",
                }}
                transition="all 0.2s ease"
              />
            </HStack>
          </Flex>
        </Box>
      </Box>
      {/* Mobile Drawer Menu */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg={boxBg}>
          <DrawerCloseButton color="white" />
          <DrawerHeader
            bgGradient="linear(to-r, pegawai, pegawaiGelap)"
            color="white"
            borderBottom="1px solid"
            borderColor="rgba(0,0,0,0.1)"
          >
            <Flex gap={3} alignItems="center">
              <Image height="32px" src={Logo} alt="Logo" />
              <Box>
                <Text fontSize="14px" fontWeight={700}>
                  Dinas Kesehatan
                </Text>
                <Text fontSize="12px" opacity={0.9}>
                  Kabupaten Paser
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>

          <DrawerBody
            p={0}
            bg={drawerBg}
            display="flex"
            flexDirection="column"
            maxH="calc(100vh - 60px)"
            overflow="hidden"
          >
            {/* User Profile Section - Mobile Only */}
            {isAuthenticated ? (
              <>
                <Box
                  bgGradient="linear(to-r, pegawai, pegawaiGelap)"
                  color="white"
                  p={5}
                  borderBottom="2px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  flexShrink={0}
                >
                  <Flex gap={3} alignItems="center" mb={4}>
                    <Box position="relative">
                      <Avatar
                        size="lg"
                        name={user[0]?.nama}
                        border="3px solid"
                        borderColor="rgba(255, 255, 255, 0.4)"
                        boxShadow="0 4px 12px rgba(0,0,0,0.2)"
                      />
                      {jumlahNotifikasi > 0 && (
                        <Badge
                          position="absolute"
                          top="-2"
                          right="-2"
                          bg="red.500"
                          color="white"
                          fontSize="11px"
                          fontWeight="bold"
                          borderRadius="full"
                          minW="7"
                          h="7"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="0 2px 8px rgba(0,0,0,0.3)"
                          border="2px solid white"
                        >
                          {jumlahNotifikasi > 9 ? "9+" : jumlahNotifikasi}
                        </Badge>
                      )}
                    </Box>
                    <VStack align="start" spacing={1} flex="1">
                      <Text fontSize="lg" fontWeight={700}>
                        {user[0]?.nama || "User"}
                      </Text>
                      <Text fontSize="sm" opacity={0.9}>
                        {user[0]?.email || ""}
                      </Text>
                    </VStack>
                  </Flex>

                  {/* Profile Button */}
                  <Link to="/profile" onClick={() => setIsDrawerOpen(false)}>
                    <Button
                      w="full"
                      variant="outline"
                      colorScheme="whiteAlpha"
                      size="md"
                      leftIcon={<Avatar size="xs" name={user[0]?.nama} />}
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.25)",
                        transform: "translateY(-2px)",
                        boxShadow: "md",
                      }}
                      transition="all 0.2s ease"
                      mb={3}
                    >
                      Lihat Profile
                    </Button>
                  </Link>
                </Box>

                {/* Quick Actions Section */}
                <Box
                  p={4}
                  bg={boxBg}
                  borderBottom="1px solid"
                  borderColor={borderColor}
                  flexShrink={0}
                >
                  <Text
                    fontSize="xs"
                    fontWeight={700}
                    color={textColorLight}
                    textTransform="uppercase"
                    letterSpacing="wide"
                    mb={3}
                  >
                    Aplikasi Lain
                  </Text>
                  <SimpleGrid columns={2} spacing={2}>
                    <Link to="/" onClick={() => setIsDrawerOpen(false)}>
                      <Button
                        w="full"
                        variant="outline"
                        size="sm"
                        leftIcon={<Image h={"18px"} src={LogoPena} />}
                        _hover={{
                          bg: hoverBg,
                          borderColor: "pegawai",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s ease"
                      >
                        Pena
                      </Button>
                    </Link>
                    <Link
                      to="/aset/dashboard"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Button
                        w="full"
                        variant="outline"
                        size="sm"
                        leftIcon={<Image h={"18px"} src={LogoAset} />}
                        _hover={{
                          bg: hoverBg,
                          borderColor: "pegawai",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s ease"
                      >
                        Aset
                      </Button>
                    </Link>
                    <Link
                      to="/pegawai/dashboard"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Button
                        w="full"
                        variant="outline"
                        size="sm"
                        leftIcon={<Image h={"18px"} src={LogoPegawai} />}
                        _hover={{
                          bg: hoverBg,
                          borderColor: "pegawai",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s ease"
                      >
                        Kepegawaian
                      </Button>
                    </Link>
                    <Link
                      to="/perencanaan"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Button
                        w="full"
                        variant="outline"
                        size="sm"
                        leftIcon={<Image h={"18px"} src={LogoPerencanaan} />}
                        _hover={{
                          bg: hoverBg,
                          borderColor: "pegawai",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s ease"
                      >
                        Perencanaan
                      </Button>
                    </Link>
                  </SimpleGrid>
                </Box>
              </>
            ) : (
              <Box
                p={5}
                bg={boxBg}
                borderBottom="1px solid"
                borderColor={borderColor}
                flexShrink={0}
              >
                <Link to="/login" onClick={() => setIsDrawerOpen(false)}>
                  <Button
                    w="full"
                    variant="solid"
                    colorScheme="pegawai"
                    size="lg"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.2s ease"
                  >
                    Login
                  </Button>
                </Link>
              </Box>
            )}

            {/* Menu Navigation */}
            <Box
              bg={boxBg}
              flex="1"
              overflowY="auto"
              minH={0}
              display="flex"
              flexDirection="column"
            >
              <Box
                px={4}
                py={3}
                borderBottom="1px solid"
                borderColor={borderColor}
                flexShrink={0}
              >
                <Text
                  fontSize="xs"
                  fontWeight={700}
                  color={textColorLight}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Menu
                </Text>
              </Box>
              <Accordion
                allowToggle
                index={accordionIndex}
                onChange={(index) => {
                  // Hanya satu accordion yang bisa terbuka pada satu waktu
                  setAccordionIndex(
                    Array.isArray(index)
                      ? index.length > 0
                        ? index[0]
                        : -1
                      : index
                  );
                }}
              >
                {menuData.map((menu, index) => {
                  const IconComponent = menu.icon;
                  const isActive = isMenuActive(menu);
                  const isOpen = accordionIndex === index;

                  return (
                    <AccordionItem
                      key={index}
                      border="none"
                      borderTop="1px solid"
                      borderColor={borderColorLight}
                    >
                      <AccordionButton
                        px={4}
                        py={3.5}
                        bg={isActive ? "pegawai" : boxBg}
                        color={isActive ? "white" : textColor}
                        fontWeight="600"
                        _hover={{
                          bg: isActive ? "pegawaiGelap" : hoverBg,
                        }}
                        borderLeft={
                          isActive ? "4px solid" : "4px solid transparent"
                        }
                        borderColor={isActive ? "pegawaiGelap" : "transparent"}
                        transition="all 0.2s ease"
                      >
                        <HStack flex="1" spacing={3}>
                          <Icon
                            as={IconComponent}
                            boxSize={5}
                            color={isActive ? "white" : "pegawai"}
                          />
                          <Text textAlign="left" fontSize="sm">
                            {menu.title}
                          </Text>
                        </HStack>
                        <AccordionIcon
                          color={isActive ? "white" : textColorLight}
                        />
                      </AccordionButton>
                      <AccordionPanel pb={3} px={0} bg={accordionPanelBg}>
                        <VStack spacing={1} align="stretch" px={2}>
                          {menu.items.map((item, itemIndex) => {
                            const itemIsActive = isItemActive(item.path);
                            return (
                              <Link
                                key={itemIndex}
                                to={item.path}
                                onClick={() => setIsDrawerOpen(false)}
                              >
                                <Box
                                  px={6}
                                  py={2.5}
                                  bg={itemIsActive ? "pegawai" : "transparent"}
                                  color={itemIsActive ? "white" : textColor}
                                  fontWeight={
                                    itemIsActive ? "semibold" : "medium"
                                  }
                                  fontSize="sm"
                                  borderRadius="md"
                                  _hover={{
                                    bg: itemIsActive
                                      ? "pegawaiGelap"
                                      : hoverBgWhite,
                                    transform: "translateX(4px)",
                                    boxShadow: itemIsActive ? "none" : "sm",
                                  }}
                                  transition="all 0.2s ease"
                                  borderLeft={
                                    itemIsActive
                                      ? "3px solid"
                                      : "3px solid transparent"
                                  }
                                  borderColor={
                                    itemIsActive ? "white" : "transparent"
                                  }
                                >
                                  {item.label}
                                </Box>
                              </Link>
                            );
                          })}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Box>

            {/* Footer Section - Color Mode & Logout */}
            <Box
              borderTop="2px solid"
              borderColor={borderColorDark}
              bg={boxBg}
              boxShadow={footerBoxShadow}
              display={{ base: "block", lg: "none" }}
              flexShrink={0}
            >
              <Box p={4}>
                <HStack spacing={3}>
                  {/* Color Mode Toggle */}
                  <Button
                    flex="1"
                    variant="outline"
                    size="md"
                    leftIcon={
                      <Box
                        as="span"
                        fontSize="lg"
                        filter={
                          colorMode === "light" ? "none" : "grayscale(0%)"
                        }
                      >
                        {colorMode === "light" ? "🌙" : "☀️"}
                      </Box>
                    }
                    onClick={toggleColorMode}
                    justifyContent="center"
                    bg={colorMode === "light" ? "gray.900" : "yellow.100"}
                    color={colorMode === "light" ? "white" : "gray.800"}
                    borderColor={
                      colorMode === "light" ? "gray.700" : "yellow.300"
                    }
                    _hover={{
                      bg: colorMode === "light" ? "gray.800" : "yellow.200",
                      transform: "translateY(-2px)",
                      boxShadow: "md",
                    }}
                    transition="all 0.2s ease"
                  >
                    {colorMode === "light" ? "Gelap" : "Terang"}
                  </Button>

                  {/* Logout Button */}
                  {isAuthenticated && (
                    <Button
                      flex="1"
                      variant="outline"
                      colorScheme="red"
                      size="md"
                      leftIcon={<Icon as={FaSignOutAlt} />}
                      onClick={handleLogout}
                      _hover={{
                        bg: "red.50",
                        borderColor: "red.400",
                        transform: "translateY(-2px)",
                        boxShadow: "md",
                      }}
                      transition="all 0.2s ease"
                    >
                      Keluar
                    </Button>
                  )}
                </HStack>
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* Spacing untuk konten utama */}
      <Box h="80px" /> {/* Spacer untuk konten */}
    </>
  );
}

export default NavbarPegawai;
