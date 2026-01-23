import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
  Flex,
  HStack,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiCheckCircle,
  FiUserPlus,
} from "react-icons/fi";
import PersonilCard from "./PersonilCard";

function DaftarPersonil({
  detailPerjalanan,
  adaStatusDuaAtauTiga,
  semuaPersonilBelumAdaRincian,
  adaPersonilYangBisaDiajukan,
  isSubmittingPengajuan,
  isCreatingAutoBulk,
  onPengajuanBulk,
  onBuatOtomatisBulk,
  onTambahPersonil,
  onEditPersonil,
  onHapusPersonil,
  cardBg,
  borderColor,
  headerBg,
}) {
  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      shadow="lg"
      borderRadius="xl"
      overflow="hidden"
    >
      <CardHeader
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading
            color={"white"}
            size={{ base: "sm", md: "md" }}
            display="flex"
            align="center"
            gap={2}
            flexWrap="wrap"
          >
            <Icon as={FiUsers} color="white" />
            Daftar Personil ({detailPerjalanan?.personils?.length} orang)
          </Heading>
          <HStack spacing={2} flexWrap="wrap">
            {/* Tombol Ajukan untuk Semua Personil */}
            {adaPersonilYangBisaDiajukan && (
              <Button
                leftIcon={<FiCheckCircle />}
                variant={"primary"}
                onClick={onPengajuanBulk}
                isLoading={isSubmittingPengajuan}
                loadingText="Mengajukan..."
                size={{ base: "sm", md: "md" }}
                transition="all 0.2s"
                colorScheme="green"
              >
                Ajukan Semua
              </Button>
            )}
            {/* Tombol Buat Otomatis Semua */}
            {!adaStatusDuaAtauTiga &&
              semuaPersonilBelumAdaRincian &&
              detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1 && (
                <Button
                  leftIcon={<FiCheckCircle />}
                  variant={"primary"}
                  onClick={onBuatOtomatisBulk}
                  isLoading={isCreatingAutoBulk}
                  loadingText="Membuat..."
                  size={{ base: "sm", md: "md" }}
                  transition="all 0.2s"
                >
                  Buat Otomatis
                </Button>
              )}
            {!adaStatusDuaAtauTiga &&
              detailPerjalanan?.personils?.length < 5 && (
                <Button
                  leftIcon={<FiUserPlus />}
                  variant={"primary"}
                  onClick={onTambahPersonil}
                  size={{ base: "sm", md: "md" }}
                  transition="all 0.2s"
                >
                  Tambah Personil
                </Button>
              )}
          </HStack>
        </Flex>
      </CardHeader>
      <CardBody p={{ base: 4, md: 6 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 6 }}>
          {detailPerjalanan?.personils?.map((item, index) => (
            <PersonilCard
              key={index}
              item={item}
              index={index}
              detailPerjalanan={detailPerjalanan}
              onEditClick={onEditPersonil}
              onHapusClick={onHapusPersonil}
              borderColor={borderColor}
            />
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}

export default DaftarPersonil;
