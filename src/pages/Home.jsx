import React from "react";
import {
  Box,
  Text,
  Button,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { keyframes, css } from "@emotion/react";
import {
  FaFileAlt,
  FaUsers,
  FaCar,
  FaChartLine,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";
import Layout from "../Componets/Layout";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../Redux/Reducers/auth";
import FotoDinkes from "../assets/dinkes.jpg";
import { getSEOConfig } from "../config/seoConfig";
import { useHistory } from "react-router-dom";

// Animasi keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// CSS untuk animasi
const fadeInAnimation = css`
  animation: ${fadeIn} 1s ease-out;
`;

const fadeInAnimationDelay1 = css`
  animation: ${fadeIn} 1.2s ease-out;
`;

const fadeInAnimationDelay2 = css`
  animation: ${fadeIn} 1.4s ease-out;
`;

const slideInAnimation = (delay) => css`
  animation: ${slideIn} ${0.6 + delay * 0.1}s ease-out;
`;

const floatAnimation = css`
  animation: ${float} 2s ease-in-out infinite;
`;

const floatAnimationFast = css`
  animation: ${float} 1.5s ease-in-out infinite;
`;

function Home() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const history = useHistory();

  const features = [
    {
      icon: FaFileAlt,
      title: "Surat Perjalanan Dinas",
      description: "Kelola surat perjalanan dinas dengan mudah dan efisien",
      color: "primary",
    },
    {
      icon: FaUsers,
      title: "Manajemen Pegawai",
      description: "Sistem terintegrasi untuk pengelolaan data pegawai",
      color: "pegawai",
    },
    {
      icon: FaCar,
      title: "Kendaraan Dinas",
      description: "Monitoring dan pengelolaan kendaraan dinas",
      color: "aset",
    },
    {
      icon: FaChartLine,
      title: "Perencanaan",
      description: "Perencanaan dan penganggaran yang terstruktur",
      color: "perencanaan",
    },
    {
      icon: FaBuilding,
      title: "Unit Kerja",
      description: "Manajemen unit kerja dan struktur organisasi",
      color: "ungu",
    },
    {
      icon: FaClipboardList,
      title: "Laporan",
      description: "Laporan dan rekapitulasi data yang komprehensif",
      color: "primary",
    },
  ];

  return (
    <Layout seoProps={getSEOConfig("home")} noPaddingTop={true}>
      <Box minHeight="100vh" position="relative" overflow="hidden">
        {/* Hero Section dengan Background */}
        <Box
          height={{ base: "100vh", md: "90vh" }}
          backgroundImage={`url(${FotoDinkes})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundAttachment="fixed"
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Gradient Overlay halus dengan gelap terang */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.6) 100%)"
          />

          {/* Pattern Overlay untuk efek visual */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            opacity="0.1"
            backgroundImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
            backgroundSize="40px 40px"
          />

          {/* Content Hero */}
          <Container maxW="container.xl" position="relative" zIndex={2}>
            <VStack spacing={8} textAlign="center" py={20}>
              <Box css={fadeInAnimation}>
                <Text
                  color="white"
                  fontWeight={900}
                  fontSize={{ base: "2.5rem", md: "4rem", lg: "5rem" }}
                  lineHeight="1.2"
                  mb={4}
                  textShadow="2px 4px 8px rgba(0,0,0,0.3)"
                  letterSpacing="wide"
                >
                  SELAMAT DATANG DI
                </Text>
                <Text
                  color="white"
                  fontWeight={900}
                  fontSize={{ base: "3rem", md: "5rem", lg: "6rem" }}
                  lineHeight="1.2"
                  bgGradient="linear-gradient(90deg, #fff 0%, #cbfaea 100%)"
                  bgClip="text"
                  textShadow="2px 4px 8px rgba(0,0,0,0.3)"
                  letterSpacing="wide"
                >
                  PENA
                </Text>
              </Box>

              <Box css={fadeInAnimationDelay1} maxW="600px">
                <Text
                  color="white"
                  fontSize={{ base: "lg", md: "xl" }}
                  opacity={0.95}
                  lineHeight="1.8"
                  textShadow="1px 2px 4px rgba(0,0,0,0.3)"
                >
                  Sistem Informasi Terintegrasi untuk Pengelolaan Surat
                  Perjalanan Dinas, Kepegawaian, dan Administrasi Dinas
                  Kesehatan
                </Text>
              </Box>

              {!isAuthenticated && (
                <Box css={fadeInAnimationDelay2} pt={4}>
                  <HStack spacing={4} justify="center" flexWrap="wrap">
                    <Button
                      variant="primary"
                      size="lg"
                      px={8}
                      py={6}
                      fontSize="lg"
                      onClick={() => history.push("/login")}
                      _hover={{
                        transform: "translateY(-3px)",
                        boxShadow: "xl",
                      }}
                      transition="all 0.3s"
                    >
                      Login
                    </Button>
                  </HStack>
                </Box>
              )}
            </VStack>
          </Container>

          {/* Scroll Indicator */}
          <Box
            position="absolute"
            bottom="30px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
            css={floatAnimation}
          >
            <Box
              width="30px"
              height="50px"
              border="2px solid white"
              borderRadius="25px"
              position="relative"
              opacity={0.8}
            >
              <Box
                width="4px"
                height="10px"
                bg="white"
                borderRadius="2px"
                position="absolute"
                top="8px"
                left="50%"
                transform="translateX(-50%)"
                css={floatAnimationFast}
              />
            </Box>
          </Box>
        </Box>

        {/* Features Section */}
        <Box bg="background" py={20} position="relative">
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <Box
                textAlign="center"
                css={css`
                  animation: ${fadeIn} 0.8s ease-out;
                `}
              >
                <Text
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight={800}
                  color="primary"
                  mb={4}
                >
                  Fitur Utama
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="gray.600"
                  maxW="600px"
                  mx="auto"
                >
                  Sistem PENA menyediakan berbagai fitur lengkap untuk mendukung
                  operasional Dinas Kesehatan
                </Text>
              </Box>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={8}
                width="100%"
              >
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    p={8}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "2xl",
                    }}
                    css={slideInAnimation(index)}
                    borderTop="4px solid"
                    borderColor={feature.color}
                  >
                    <VStack spacing={4} align="stretch">
                      <Icon
                        as={feature.icon}
                        w={12}
                        h={12}
                        color={feature.color}
                      />
                      <Text fontSize="xl" fontWeight={700} color="gray.800">
                        {feature.title}
                      </Text>
                      <Text fontSize="md" color="gray.600" lineHeight="1.7">
                        {feature.description}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Footer Section */}
      </Box>
    </Layout>
  );
}

export default Home;
