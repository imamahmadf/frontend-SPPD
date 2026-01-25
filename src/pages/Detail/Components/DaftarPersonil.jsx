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
  Select,
  Wrap,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiCheckCircle,
  FiUserPlus,
  FiSearch,
  FiPrinter,
} from "react-icons/fi";
import PersonilCard from "./PersonilCard";

function DaftarPersonil({
  detailPerjalanan,
  adaStatusDuaAtauTiga,
  semuaPersonilBelumAdaRincian,
  adaPersonilYangBisaDiajukan,
  adaPersonilYangBisaDicetak,
  isSubmittingPengajuan,
  isCreatingAutoBulk,
  isPrintingAll,
  onPengajuanBulk,
  onBuatOtomatisBulk,
  onCetakSemuaKwitansi,
  onTambahPersonil,
  onEditPersonil,
  onHapusPersonil,
  onSearchTemplateBPD,
  dataTemplate,
  templateId,
  setTemplateId,
  cardBg,
  borderColor,
  headerBg,
}) {
  const jumlahPersonil = detailPerjalanan?.personils?.length || 0;

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
        py={{ base: 3, md: 4 }}
        px={{ base: 4, md: 6 }}
      >
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={3}
        >
          {/* Header Title */}
          <HStack spacing={3} flexShrink={0}>
            <Flex
              bg="whiteAlpha.200"
              p={2}
              borderRadius="lg"
              align="center"
              justify="center"
            >
              <Icon as={FiUsers} color="white" boxSize={5} />
            </Flex>
            <HStack spacing={2}>
              <Heading
                color="white"
                size={{ base: "sm", md: "md" }}
              >
                Daftar Personil
              </Heading>
              <Badge
                bg="whiteAlpha.300"
                color="white"
                fontSize="xs"
                px={2}
                py={0.5}
                borderRadius="full"
              >
                {jumlahPersonil} orang
              </Badge>
            </HStack>
          </HStack>

          {/* Action Buttons - Semua tombol di samping kanan */}
          <Wrap spacing={2} justify="flex-end">
            {/* Tombol Ajukan Semua */}
            {adaPersonilYangBisaDiajukan && (
              <WrapItem>
                <Button
                  leftIcon={<FiCheckCircle />}
                  colorScheme="green"
                  onClick={onPengajuanBulk}
                  isLoading={isSubmittingPengajuan}
                  loadingText="Mengajukan..."
                  size={{ base: "sm", md: "md" }}
                  transition="all 0.2s"
                >
                  Ajukan Semua
                </Button>
              </WrapItem>
            )}

            {/* Tombol Buat Otomatis */}
            {!adaStatusDuaAtauTiga &&
              semuaPersonilBelumAdaRincian &&
              detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1 && (
                <WrapItem>
                  <Button
                    leftIcon={<FiCheckCircle />}
                    colorScheme="teal"
                    onClick={onBuatOtomatisBulk}
                    isLoading={isCreatingAutoBulk}
                    loadingText="Membuat..."
                    size={{ base: "sm", md: "md" }}
                    transition="all 0.2s"
                  >
                    Buat Otomatis
                  </Button>
                </WrapItem>
              )}

            {/* Tombol Cari Template BPD */}
            {onSearchTemplateBPD &&
              !adaStatusDuaAtauTiga &&
              semuaPersonilBelumAdaRincian &&
              detailPerjalanan.jenisPerjalanan?.tipePerjalananId !== 1 && (
                <WrapItem>
                  <Button
                    leftIcon={<FiSearch />}
                    colorScheme="purple"
                    onClick={onSearchTemplateBPD}
                    size={{ base: "sm", md: "md" }}
                    transition="all 0.2s"
                  >
                    Cari Template BPD
                  </Button>
                </WrapItem>
              )}

            {/* Tombol Tambah Personil */}
            {!adaStatusDuaAtauTiga && jumlahPersonil < 5 && (
              <WrapItem>
                <Button
                  leftIcon={<FiUserPlus />}
                  colorScheme="whiteAlpha"
                  bg="whiteAlpha.200"
                  color="white"
                  _hover={{ bg: "whiteAlpha.300" }}
                  onClick={onTambahPersonil}
                  size={{ base: "sm", md: "md" }}
                  transition="all 0.2s"
                >
                  Tambah Personil
                </Button>
              </WrapItem>
            )}

            {/* Group Cetak Kwitansi */}
            {onCetakSemuaKwitansi && adaPersonilYangBisaDicetak && (
              <WrapItem>
                <HStack spacing={2}>
                  <Select
                    size={{ base: "sm", md: "md" }}
                    bg="white"
                    borderRadius="md"
                    borderColor="gray.300"
                    w={{ base: "130px", md: "170px" }}
                    value={templateId || ""}
                    onChange={(e) => setTemplateId(e.target.value)}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "outline",
                    }}
                    fontSize="sm"
                  >
                    {dataTemplate?.map((val) => (
                      <option key={val.id} value={val.id}>
                        {val.nama}
                      </option>
                    ))}
                  </Select>
                  <Button
                    leftIcon={<FiPrinter />}
                    colorScheme="blue"
                    onClick={() => onCetakSemuaKwitansi(templateId)}
                    isLoading={isPrintingAll}
                    loadingText="Mencetak..."
                    size={{ base: "sm", md: "md" }}
                    transition="all 0.2s"
                  >
                    Cetak Semua
                  </Button>
                </HStack>
              </WrapItem>
            )}
          </Wrap>
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
