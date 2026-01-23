import React from "react";
import {
  Card,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Divider,
  Box,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiEdit3,
  FiTrash2,
  FiDollarSign,
} from "react-icons/fi";
import { useHistory } from "react-router-dom";

function PersonilCard({
  item,
  index,
  detailPerjalanan,
  onEditClick,
  onHapusClick,
  borderColor,
}) {
  const history = useHistory();

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "yellow";
      case 2:
        return "green";
      case 3:
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Card
      key={index}
      bg={useColorModeValue("gray.50", "gray.700")}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={{ base: 3, md: 4 }}
      transition="all 0.2s"
      _hover={{
        shadow: "md",
        transform: "translateY(-2px)",
      }}
    >
      <VStack spacing={4} align="stretch">
        {/* Header Personil */}
        <HStack justify="space-between" align="start">
          <HStack spacing={3}>
            <Avatar
              name={item.pegawai.nama}
              size="md"
              bg="primary"
              color="white"
              src={
                item.pegawai.profiles?.[0]?.profilePic
                  ? `${
                      import.meta.env.VITE_REACT_APP_API_BASE_URL
                    }${item.pegawai.profiles[0].profilePic}`
                  : undefined
              }
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">
                {item.pegawai.nama}
              </Text>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.500">
                  SPD: {item.nomorSPD}
                </Text>
                <Badge
                  colorScheme={getStatusColor(item.statusId)}
                  variant="subtle"
                  borderRadius="full"
                >
                  {item?.status?.statusKuitansi}
                </Badge>
              </HStack>
            </VStack>
          </HStack>
        </HStack>

        {/* Rincian Biaya Perjalanan */}
        {item.rincianBPDs && item.rincianBPDs.length > 0 && (
          <>
            <Divider />
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between" align="center">
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.600"
                  textTransform="uppercase"
                >
                  Rincian Biaya Perjalanan
                </Text>
                <Icon as={FiDollarSign} color="green.500" />
              </HStack>
              <Box
                bg={useColorModeValue("white", "gray.600")}
                borderRadius="md"
                p={3}
                border="1px"
                borderColor={borderColor}
              >
                <VStack align="stretch" spacing={2}>
                  {item.rincianBPDs.map((rincian, idx) => {
                    const subtotal = rincian.qty * rincian.nilai;
                    return (
                      <HStack
                        key={idx}
                        justify="space-between"
                        align="start"
                        pb={2}
                        borderBottom={
                          idx < item.rincianBPDs.length - 1 ? "1px" : "none"
                        }
                        borderColor={borderColor}
                      >
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            {rincian.item}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {rincian.qty} x{" "}
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(rincian.nilai)}
                          </Text>
                        </VStack>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="green.600"
                        >
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(subtotal)}
                        </Text>
                      </HStack>
                    );
                  })}
                  <Divider />
                  <HStack justify="space-between" align="center" pt={1}>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="gray.700"
                    >
                      Total Biaya
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="green.600">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(
                        item.rincianBPDs.reduce(
                          (sum, rincian) =>
                            sum + rincian.qty * rincian.nilai,
                          0
                        )
                      )}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </>
        )}

        {/* Action Buttons */}
        <Divider />
        <Flex gap={2} wrap="wrap">
          <Button
            leftIcon={<FiCheckCircle />}
            variant="primary"
            size="sm"
            onClick={() => {
              history.push(`/rampung/${item.id}`);
            }}
            _hover={{
              transform: "translateY(-1px)",
            }}
            transition="all 0.2s"
          >
            Rampung
          </Button>

          {item.statusId !== 2 && item.statusId !== 3 && (
            <>
              <Button
                leftIcon={<FiEdit3 />}
                colorScheme="primary"
                variant="outline"
                size="sm"
                onClick={() => onEditClick(item)}
                _hover={{
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
              >
                Edit
              </Button>
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => onHapusClick(item)}
                _hover={{
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
              >
                Hapus
              </Button>
            </>
          )}
        </Flex>
      </VStack>
    </Card>
  );
}

export default PersonilCard;
