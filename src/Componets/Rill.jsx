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
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const {
    isOpen: isRillOpen,
    onOpen: onRillOpen,
    onClose: onRillClose,
  } = useDisclosure();
  const handleChange = (e, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  const handleEdit = (item) => {
    setEditMode(item.id);
    setEditedData({
      ...item,
    });
  };

  function hapusRill(val) {
    console.log(val);
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/rill/delete`, val)
      .then((res) => {
        console.log(res.data);
        setEditMode(null);
        props.randomNumber(Math.random());
        onRillClose();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const handleSave = (id) => {
    console.log(editedData);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/rill/update`,
        editedData
      )
      .then((res) => {
        setEditMode(null);
        props.randomNumber(Math.random());
        onRillClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };
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
    <Box p={0} m={0}>
      <Container p={0} m={0}>
        <Button variant={"secondary"} onClick={onRillOpen}>
          Rill
        </Button>
      </Container>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isRillOpen}
        onClose={onRillClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="1500px" bgColor={"terang"}>
          <ModalHeader>Rill </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Table variant={"primary"}>
              <Thead>
                <Tr>
                  <Th>Item</Th>
                  <Th>Nilai</Th> <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody bgColor={"secondary"}>
                {props?.data?.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      {editMode === item.id ? (
                        <Input
                          value={editedData.item}
                          onChange={(e) => handleChange(e, "item")}
                        />
                      ) : (
                        item.item
                      )}
                    </Td>{" "}
                    <Td>
                      {editMode === item.id ? (
                        <Input
                          value={editedData.nilai}
                          onChange={(e) => handleChange(e, "nilai")}
                        />
                      ) : (
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.nilai)
                      )}
                    </Td>
                    <Td>
                      {editMode === item.id ? (
                        <HStack>
                          <Button
                            colorScheme="green"
                            onClick={() => handleSave(item.id)}
                          >
                            Save
                          </Button>
                          <Button
                            colorScheme="gray"
                            onClick={() => setEditMode(null)}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      ) : (
                        <HStack>
                          <Button
                            colorScheme="blue"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              hapusRill(item);
                            }}
                          >
                            Delete
                          </Button>
                        </HStack>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {props.status === 3 || props.status === 2 ? null : (
              <HStack
                border={"1px"}
                borderRadius={"6px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                bgColor={"white"}
                spacing={4}
                p={"30px"}
                mt={"30px"}
              >
                <Input
                  placeholder="Item"
                  onChange={(e) => setItem(e.target.value)}
                />
                <Input
                  placeholder="Nilai"
                  type="number"
                  onChange={(e) => setNilai(e.target.value)}
                />
                <Button onClick={submitRill} variant={"primary"}>
                  Tambah
                </Button>
              </HStack>
            )}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Rill;
