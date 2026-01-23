import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";
import TambahBuktiKegiatan from "../../../Componets/TambahBuktiKegiatan";

function BuktiKegiatan({
  detailPerjalanan,
  setRandomNumber,
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
      </CardBody>
    </Card>
  );
}

export default BuktiKegiatan;
