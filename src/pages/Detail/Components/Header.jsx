import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FiInfo, FiEdit3 } from "react-icons/fi";

function Header({ detailPerjalanan, adaStatusDuaAtauTiga, onEditClick }) {
  return (
    <Box
      py={{ base: 4, md: 6, lg: 8 }}
      mb={{ base: 4, md: 6, lg: 8 }}
      px={{ base: 4, md: 0 }}
    >
      <Container maxW={{ base: "100%", md: "1280px" }} px={{ base: 4, md: 6 }}>
        <Flex
          align={{ base: "start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <VStack align="start" spacing={2} flex={1}>
            <Heading
              size={{ base: "md", md: "lg" }}
              display="flex"
              align="center"
              gap={3}
              flexWrap="wrap"
            >
              <Icon as={FiInfo} boxSize={{ base: 5, md: 6 }} />
              Detail Perjalanan Dinas
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} opacity={0.9}>
              Informasi lengkap perjalanan dinas dan personil
            </Text>
          </VStack>
          {!adaStatusDuaAtauTiga && (
            <Button
              leftIcon={<FiEdit3 />}
              colorScheme="whiteAlpha"
              variant="outline"
              size={{ base: "md", md: "lg" }}
              onClick={onEditClick}
              _hover={{
                bg: "whiteAlpha.200",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
              w={{ base: "full", md: "auto" }}
            >
              Edit Perjalanan
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

export default Header;
