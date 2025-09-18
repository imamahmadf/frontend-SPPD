import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutPerencanaan from "../../Componets/perencanaan/LayoutPerencanaan";
import {
  Box,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Text,
  VStack,
  useColorMode,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
function DaftarProgram() {
  const [DataSuratPesanan, setDataSuratPesanan] = useState([]);
  const { colorMode } = useColorMode();
  const history = useHistory();
  async function fetchSuratPesanan() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/perencanaan/get/`
      );
      setDataSuratPesanan(res.data.result || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchSuratPesanan();
  }, []);

  return (
    <LayoutPerencanaan>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          style={{ overflowX: "auto" }}
          maxW={"1280px"}
          p={"30px"}
          borderRadius={"5px"}
          bg={colorMode === "dark" ? "gray.800" : "white"}
        >
          <Heading size="md" mb={4}>
            Daftar Program
          </Heading>

          <Accordion allowMultiple>
            {DataSuratPesanan.map((program) => (
              <AccordionItem key={program.id}>
                <AccordionButton>
                  <Flex flex="1" textAlign="left">
                    <Text fontWeight="bold">
                      {program.kode} - {program.nama}
                    </Text>
                    <Spacer />
                    <Button>detail</Button>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {program.kegiatans && program.kegiatans.length > 0 ? (
                    <Accordion allowMultiple>
                      {program.kegiatans.map((kegiatan) => (
                        <AccordionItem key={kegiatan.id}>
                          <AccordionButton>
                            <Flex flex="1" textAlign="left">
                              <Text>
                                {kegiatan.kode} - {kegiatan.nama}
                              </Text>
                              <Spacer />
                              <Button>detail</Button>
                            </Flex>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel>
                            {kegiatan.subKegPers &&
                            kegiatan.subKegPers.length > 0 ? (
                              <VStack align="start" spacing={2}>
                                {kegiatan.subKegPers.map((sub) => (
                                  <Flex
                                    key={sub.id}
                                    p={2}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    w="100%"
                                  >
                                    <Box>
                                      <Text fontWeight="semibold">
                                        {sub.kode} - {sub.nama}
                                      </Text>
                                      <Text fontSize="sm" color="gray.500">
                                        Unit Kerja:{" "}
                                        {sub.daftarUnitKerja?.unitKerja}
                                      </Text>{" "}
                                    </Box>
                                    <Spacer />
                                    <Button
                                      onClick={() =>
                                        history.push(
                                          `/perencanaan/detail-sub-kegiatan/${sub.id}`
                                        )
                                      }
                                    >
                                      Detail
                                    </Button>
                                  </Flex>
                                ))}
                              </VStack>
                            ) : (
                              <Text fontSize="sm" color="gray.400">
                                Tidak ada sub kegiatan
                              </Text>
                            )}
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <Text fontSize="sm" color="gray.400">
                      Tidak ada kegiatan
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Box>
    </LayoutPerencanaan>
  );
}

export default DaftarProgram;
