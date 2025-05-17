import React, { useState, useEffect } from "react";
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
  ModalCloseButton,
  Container,
  HStack,
  Table,
  FormControl,
  FormLabel,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Input,
  useToast,
  Badge,
  VStack,
  Divider,
  Spacer,
  useDisclosure,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { BsEyeFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../../Redux/Reducers/auth";

function DaftarIndukUnitKerjaAdmin() {
  const [allChecked, setAllChecked] = useState(false);
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(null);
  const [dataSumberDana, setDataSumberDana] = useState(null);
  const [indukUnitKerja, setIndukUnitKerja] = useState("");
  const [kodeInduk, setKodeInduk] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [asal, setAsal] = useState("");
  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);

    if (updatedCheckedItems[index]) {
      setCheckedIds([...checkedIds, dataSumberDana[index].id]);
    } else {
      setCheckedIds(checkedIds.filter((id) => id !== dataSumberDana[index].id));
    }

    setAllChecked(updatedCheckedItems.every(Boolean));
  };
  const postIndukUnitKerja = () => {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/induk-unit-kerja/post`,
        {
          FEIndukUnitKerja: indukUnitKerja,
          kodeInduk,
          asal,
          sumberDanaId: checkedIds,
        }
      )
      .then((res) => {
        console.log(res.data);
        onClose();
        fetchDaftarIndukUnitKerja();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  async function fetchDaftarIndukUnitKerja() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/induk-unit-kerja/get`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setData(res.data.result);
        setDataSumberDana(res.data.resultSumberDana);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  useEffect(() => {
    fetchDaftarIndukUnitKerja();
  }, []);

  return (
    <Layout>
      <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container
          border={"1px"}
          borderRadius={"6px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          bgColor={"white"}
          p={"30px"}
          my={"30px"}
        >
          <Button variant={"primary"} onClick={onOpen}>
            Tambah OPD +
          </Button>
          <Table mt={"30px"} variant={"primary"}>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>OPD</Th>
                <Th>Kode</Th>
                <Th>Sumber Dana</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item, index) => (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>{item.indukUnitKerja}</Td>
                  <Td>{item.kodeInduk}</Td>
                  <Td>
                    {item.indukUKSumberDanas.map((val, idx) => (
                      <Text>{val.sumberDana.sumber}</Text>
                    ))}
                  </Td>
                  <Td>
                    <Button
                      variant={"primary"}
                      p={"0px"}
                      fontSize={"14px"}
                      onClick={() =>
                        history.push(
                          `/admin/detail-induk-unit-kerja/${item.id}`
                        )
                      }
                    >
                      <BsEyeFill />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth="900px">
          <ModalHeader>Tambah OPD</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel fontSize={"24px"}>OPD</FormLabel>
              <Input
                onChange={(e) => {
                  setIndukUnitKerja(e.target.value);
                }}
                bgColor={"terang"}
                height="60px"
                placeholder="isi dengan nama Unit Kerja"
              />
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Kode</FormLabel>
              <Input
                onChange={(e) => {
                  setKodeInduk(e.target.value);
                }}
                bgColor={"terang"}
                height="60px"
                placeholder="isi dengan Kode"
              />
            </FormControl>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Asal</FormLabel>
              <Input
                onChange={(e) => {
                  setAsal(e.target.value);
                }}
                bgColor={"terang"}
                height="60px"
                placeholder="isi dengan Kode"
              />
            </FormControl>

            <Flex>
              {dataSumberDana?.map((item, index) => (
                <Box>
                  <Checkbox
                    colorScheme="blue"
                    key={item.id}
                    isChecked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                  >
                    {item.sumber}
                  </Checkbox>
                </Box>
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
            <Button onClick={postIndukUnitKerja} variant="primary">
              Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default DaftarIndukUnitKerjaAdmin;
