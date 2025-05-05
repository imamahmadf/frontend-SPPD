import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  ModalCloseButton,
  Container,
  FormControl,
  Select,
  FormLabel,
  Center,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";

function Rill(props) {
  const [item, setItem] = useState("");
  const [nilai, setNilai] = useState(0);
  const {
    isOpen: isRillOpen,
    onOpen: onRillOpen,
    onClose: onRillClose,
  } = useDisclosure();

  const submitRill = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/rill/post`, {
        item,
        nilai,
        rincianBPDId: props.data[0]?.rincianBPDId,
        personilId: props.personilId,
        status: props.data[0]?.rincianBPD?.id ? 1 : 0,
        nilaiBPD: props.data[0]?.rincianBPD?.nilai || 0,
      })
      .then((res) => {
        console.log(res.data);
        props.randomNumber(Math.random());
        onRillClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Box>
      <Container>
        <Button onClick={onRillOpen}>Rill</Button>
      </Container>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isRillOpen}
        onClose={onRillClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="900px">
          <ModalHeader>Rill </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Item</Th>
                  <Th>Nilai</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props?.data?.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.item}</Td>
                    <Td>{item.nilai}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {props.status === 3 || props.status === 2 ? null : (
              <HStack spacing={4} mt={4}>
                <Input
                  placeholder="Item"
                  onChange={(e) => setItem(e.target.value)}
                />
                <Input
                  placeholder="Nilai"
                  type="number"
                  onChange={(e) => setNilai(e.target.value)}
                />
                <Button onClick={submitRill} colorScheme="blue">
                  Tambah
                </Button>
              </HStack>
            )}
          </ModalBody>
          {props.data?.[0]?.rincianBPD?.personil?.id &&
            JSON.stringify(props.data[0].rincianBPD)}

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Rill;
