import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiMapPin,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiTarget,
  FiEdit3,
  FiUser,
  FiUsers,
  FiExternalLink,
} from "react-icons/fi";
import { Spacer } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function InformasiPerjalanan({
  detailPerjalanan,
  adaStatusDuaAtauTiga,
  onEditSubKegiatanClick,
  onEditTempatClick,
  formatDateForInput,
  cardBg,
  borderColor,
  headerBg,
}) {
  const history = useHistory();
  const kwitGlobalId = detailPerjalanan?.kwitGlobalId;

  const handleGoToKwitGlobal = () => {
    if (kwitGlobalId) {
      history.push(`/perjalanan/detail-kwitansi-global/${kwitGlobalId}`);
    }
  };
  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      shadow="lg"
      borderRadius="xl"
      overflow="hidden"
      h="100%"
    >
      <CardHeader
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <HStack justify="space-between" align="center">
          <Heading size="md" display="flex" align="center" gap={2}>
            <Icon as={FiFileText} color="purple.500" />
            Informasi Perjalanan
          </Heading>
          {kwitGlobalId && (
            <Button
              colorScheme="blue"
              size="sm"
              leftIcon={<FiExternalLink />}
              onClick={handleGoToKwitGlobal}
            >
              Kwitansi Global
            </Button>
          )}
        </HStack>
      </CardHeader>
      <CardBody p={{ base: 4, md: 6, lg: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={{ base: 4, md: 6 }}>
          {/* Asal */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Asal
            </Text>
            <HStack>
              <Icon as={FiMapPin} color="primary" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.asal}
              </Text>
            </HStack>
          </VStack>

          {/* Dasar */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Dasar
            </Text>
            <HStack>
              <Icon as={FiFileText} color="purple.500" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.dasar || "-"}
              </Text>
            </HStack>
          </VStack>

          {/* Untuk */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Untuk
            </Text>
            <HStack>
              <Icon as={FiTarget} color="primary" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.untuk}
              </Text>
            </HStack>
          </VStack>

          {/* No. Surat Tugas */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              No. Surat Tugas
            </Text>
            <HStack>
              <Icon as={FiFileText} color="purple.600" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.noSuratTugas}
              </Text>
            </HStack>
          </VStack>

          {/* No. Nota Dinas */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              No. Nota Dinas
            </Text>
            <HStack>
              <Icon as={FiFileText} color="primary" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.isNotaDinas == 1
                  ? detailPerjalanan.noNotaDinas
                  : "-"}
              </Text>
            </HStack>
          </VStack>

          {/* No. Telaahan Staf */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              No. Telaahan Staf
            </Text>
            <HStack>
              <Icon as={FiFileText} color="purple.500" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.isNotaDinas
                  ? "-"
                  : detailPerjalanan.noNotaDinas}
              </Text>
            </HStack>
          </VStack>

          {/* Tanggal Pengajuan */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Tanggal Pengajuan
            </Text>
            <HStack>
              <Icon as={FiCalendar} color="primary" />
              <Text fontSize="lg" fontWeight="medium">
                {new Date(
                  detailPerjalanan.tanggalPengajuan
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </HStack>
          </VStack>

          {/* Sumber Dana */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Sumber Dana
            </Text>
            <HStack>
              <Icon as={FiDollarSign} color="purple.500" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan.bendahara?.sumberDana?.sumber}
              </Text>
            </HStack>
          </VStack>

          {/* PPTK */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              PPTK
            </Text>
            <Box
              p={3}
              bg={useColorModeValue("blue.50", "blue.900")}
              borderRadius="lg"
              border="1px"
              borderColor={useColorModeValue("blue.200", "blue.700")}
              w="full"
            >
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiUser} color="blue.500" />
                  <Text fontSize="md" fontWeight="medium">
                    {detailPerjalanan.PPTK?.pegawai_PPTK?.nama || "-"}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  NIP: {detailPerjalanan.PPTK?.pegawai_PPTK?.nip || "-"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Jabatan: {detailPerjalanan.PPTK?.jabatan || "-"}
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* KPA */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              KPA
            </Text>
            <Box
              p={3}
              bg={useColorModeValue("green.50", "green.900")}
              borderRadius="lg"
              border="1px"
              borderColor={useColorModeValue("green.200", "green.700")}
              w="full"
            >
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiUser} color="green.500" />
                  <Text fontSize="md" fontWeight="medium">
                    {detailPerjalanan.KPA?.pegawai_KPA?.nama || "-"}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  NIP: {detailPerjalanan.KPA?.pegawai_KPA?.nip || "-"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Jabatan: {detailPerjalanan.KPA?.jabatan || "-"}
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* Bendahara */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Bendahara
            </Text>
            <Box
              p={3}
              bg={useColorModeValue("orange.50", "orange.900")}
              borderRadius="lg"
              border="1px"
              borderColor={useColorModeValue("orange.200", "orange.700")}
              w="full"
            >
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiUsers} color="orange.500" />
                  <Text fontSize="md" fontWeight="medium">
                    {detailPerjalanan.bendahara?.pegawai_bendahara?.nama || "-"}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  NIP: {detailPerjalanan.bendahara?.pegawai_bendahara?.nip || "-"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Jabatan: {detailPerjalanan.bendahara?.jabatan || "-"}
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* Sub Kegiatan */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Sub Kegiatan
            </Text>
            <HStack>
              <Icon as={FiTarget} color="purple.500" />
              <Text fontSize="lg" fontWeight="medium">
                {detailPerjalanan?.daftarSubKegiatan?.subKegiatan}
              </Text>
              {!adaStatusDuaAtauTiga && (
                <Button
                  size="xs"
                  leftIcon={<FiEdit3 />}
                  colorScheme="purple"
                  variant="outline"
                  ml={2}
                  onClick={onEditSubKegiatanClick}
                  _hover={{ transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                >
                  Edit
                </Button>
              )}
            </HStack>
          </VStack>

          {/* Tujuan */}
          <VStack align="start" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.500"
              textTransform="uppercase"
            >
              Tujuan ({detailPerjalanan?.tempats?.length} tempat)
            </Text>
            <VStack
              align="start"
              flexDirection={"row"}
              spacing={3}
              w="100%"
            >
              {detailPerjalanan?.tempats?.map((tempat, index) => (
                <Box
                  key={index}
                  p={3}
                  bg={useColorModeValue("gray.50", "gray.700")}
                  borderRadius="lg"
                  border="1px"
                  borderColor={borderColor}
                  w="full"
                >
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={FiMapPin} color="primary" />
                        <Text fontSize="md" fontWeight="medium">
                          {detailPerjalanan.jenisPerjalanan?.tipePerjalananId ===
                          1
                            ? tempat.dalamKota?.nama
                            : tempat.tempat}
                        </Text>
                      </HStack>
                      <Spacer />
                      {!adaStatusDuaAtauTiga && (
                        <Button
                          size="sm"
                          leftIcon={<FiEdit3 />}
                          colorScheme="primary"
                          variant="outline"
                          onClick={() => onEditTempatClick(tempat, index)}
                          _hover={{ transform: "translateY(-1px)" }}
                          transition="all 0.2s"
                        >
                          Edit Tempat
                        </Button>
                      )}
                    </HStack>
                    <HStack spacing={4} fontSize="sm" color="gray.600">
                      <HStack>
                        <Icon as={FiCalendar} color="purple.600" />
                        <Text>
                          Berangkat:{" "}
                          {new Date(
                            tempat.tanggalBerangkat
                          ).toLocaleDateString("id-ID")}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCalendar} color="primary" />
                        <Text>
                          Pulang:{" "}
                          {new Date(
                            tempat.tanggalPulang
                          ).toLocaleDateString("id-ID")}
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}

export default InformasiPerjalanan;
