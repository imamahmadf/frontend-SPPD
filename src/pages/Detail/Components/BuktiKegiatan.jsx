import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiFileText, FiTruck } from "react-icons/fi";
import TambahBuktiKegiatan from "../../../Componets/TambahBuktiKegiatan";

function BuktiKegiatan({
  detailPerjalanan,
  setRandomNumber,
  cardBg,
  borderColor,
  headerBg,
}) {
  const kendaraan = detailPerjalanan?.kendaraanDina;
  
  const infoBg = useColorModeValue("gray.50", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.400");

  const getStatusColor = (status) => {
    switch (status) {
      case "dipinjam":
        return "orange";
      case "tersedia":
        return "green";
      case "tidak tersedia":
        return "red";
      default:
        return "gray";
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
        <Heading size="md" display="flex" align="center" gap={2}>
          <Icon as={FiFileText} color="purple.500" />
          Bukti Kegiatan
        </Heading>
      </CardHeader>
      <CardBody p={0}>
        <TambahBuktiKegiatan
          fotoPerjalanan={detailPerjalanan?.fotoPerjalanans || []}
          id={detailPerjalanan?.id}
          status={detailPerjalanan?.personils?.[0]?.statusId || 1}
          randomNumber={setRandomNumber}
        />

        {/* Informasi Kendaraan Dinas */}
        <Divider />
        <Box p={4}>
          <HStack mb={3}>
            <Icon as={FiTruck} color="blue.500" />
            <Heading size="sm">Kendaraan Dinas</Heading>
          </HStack>

          {kendaraan ? (
            <VStack spacing={3} align="stretch">
              {/* Foto Kendaraan */}
              {kendaraan.kendaraan?.foto && (
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  border="1px"
                  borderColor={borderColor}
                >
                  <Image
                    src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}${kendaraan.kendaraan.foto}`}
                    alt={kendaraan.kendaraan?.merek || "Kendaraan"}
                    w="100%"
                    h="150px"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/300x150?text=No+Image"
                  />
                </Box>
              )}

              {/* Info Kendaraan */}
              <Box bg={infoBg} p={3} borderRadius="md">
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={labelColor}>
                      Merek/Tipe
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {kendaraan.kendaraan?.merek || "-"}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color={labelColor}>
                      Nomor Polisi
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      KT {kendaraan.kendaraan?.nomor || "-"}{" "}
                      {kendaraan.kendaraan?.seri || ""}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color={labelColor}>
                      Status
                    </Text>
                    <Badge colorScheme={getStatusColor(kendaraan.status)}>
                      {kendaraan.status || "-"}
                    </Badge>
                  </HStack>

                  {kendaraan.kmAkhir && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={labelColor}>
                        KM Akhir
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {kendaraan.kmAkhir} km
                      </Text>
                    </HStack>
                  )}

                  {kendaraan.jarak && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={labelColor}>
                        Jarak Tempuh
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {kendaraan.jarak} km
                      </Text>
                    </HStack>
                  )}

                  {kendaraan.kondisiAkhir && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={labelColor}>
                        Kondisi Akhir
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {kendaraan.kondisiAkhir}
                      </Text>
                    </HStack>
                  )}

                  {kendaraan.catatan && (
                    <Box>
                      <Text fontSize="sm" color={labelColor} mb={1}>
                        Catatan
                      </Text>
                      <Text fontSize="sm">{kendaraan.catatan}</Text>
                    </Box>
                  )}

                  {kendaraan.keterangan && (
                    <Box>
                      <Text fontSize="sm" color={labelColor} mb={1}>
                        Keterangan
                      </Text>
                      <Text fontSize="sm">{kendaraan.keterangan}</Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          ) : (
            /* Empty State - Tidak Ada Kendaraan Dinas */
            <Box
              bg={infoBg}
              p={6}
              borderRadius="lg"
              border="2px dashed"
              borderColor={borderColor}
              textAlign="center"
            >
              <Icon
                as={FiTruck}
                boxSize={10}
                color="gray.400"
                mb={3}
              />
              <Text fontSize="md" fontWeight="medium" color="gray.500" mb={1}>
                Tidak Menggunakan Kendaraan Dinas
              </Text>
              <Text fontSize="sm" color="gray.400">
                Perjalanan ini tidak menggunakan kendaraan dinas
              </Text>
            </Box>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}

export default BuktiKegiatan;
