import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Componets/Layout";
import TambahFotoKendaraan from "../../Componets/TambahFotoKendaraan";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Select,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

function DetailKendaraanUnitKerja(props) {
  const [detailKendaraan, setDetailKendaraan] = useState([]);
  const [nomorSurat, setNomorSurat] = useState("");
  const [randomNumber, setRandomNumber] = useState(0);
  const [jenisList, setJenisList] = useState([]);

  const [seed, setSeed] = useState(null);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const fetchDataKendaraan = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/detail/${
          props.match.params.id
        }`
      );
      const result = res.data.result;
      setDetailKendaraan(result);
      setNomorSurat(res.data.resultTemplate[0]?.nomorSurat || "");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSeed = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/get/seed`
      );
      const result = res.data;
      setSeed(result);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDataKendaraan();
    fetchSeed();
  }, []);

  const editSchema = Yup.object().shape({
    noKontak: Yup.number().required("Nomor kendaraan wajib diisi"),
    noRangka: Yup.string().required("Nomor rangka wajib diisi"),
    noMesin: Yup.string().required("Nomor mesin wajib diisi"),

    jenisKendaraanId: Yup.string().required("Jenis kendaraan wajib dipilih"),

    kondisiId: Yup.string().required(""),
  });

  const handleSubmitEdit = async (values, actions) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/kendaraan/edit/${
          detailKendaraan.id
        }`,
        values
      );
      actions.setSubmitting(false);
      onEditClose();
      fetchDataKendaraan(); // refresh
    } catch (error) {
      console.error("Gagal update data kendaraan", error);
      actions.setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box>
        <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
          <Box display="flex" gap={5}>
            <Box>
              <TambahFotoKendaraan
                foto={detailKendaraan?.foto}
                id={detailKendaraan?.id}
                randomNumber={setRandomNumber}
              />
            </Box>
            <Box>
              <Text>
                Nomor Kendaraan: KT {detailKendaraan?.nomor}{" "}
                {detailKendaraan?.seri}
              </Text>
              <Text>
                Unit Kerja: {detailKendaraan?.kendaraanUK?.unitKerja || "-"}
              </Text>
              <Text>
                Jenis Kendaraan: {detailKendaraan?.jenisKendaraan?.jenis}
              </Text>
              <Text>
                Tanggal STNK:
                {detailKendaraan?.tgl_pkb &&
                  new Date(detailKendaraan?.tgl_pkb).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
              </Text>
              <Text>
                Tanggal BPKB:
                {detailKendaraan?.tg_stnk &&
                  new Date(detailKendaraan?.tg_stnk).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
              </Text>
              <Text>Nomor Rangka: {detailKendaraan?.noRangka}</Text>
              <Text>Nomor Mesin: {detailKendaraan?.noMesin}</Text>
              <Text>Kondisi: {detailKendaraan?.kondisi?.nama}</Text>
              <Text>Status: {detailKendaraan?.statusKendaraan?.status}</Text>
            </Box>
            <Spacer />
            <Box>
              <Button onClick={onEditOpen}>Edit</Button>
            </Box>
          </Box>
        </Container>

        {/* Modal Edit */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isEditOpen}
          onClose={onEditClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxWidth="800px">
            <ModalHeader>Edit Data Kendaraan</ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={{
                noKontak: detailKendaraan?.noKontak || 0,
                noRangka: detailKendaraan?.noRangka || "",
                noMesin: detailKendaraan?.noMesin || "",

                jenisKendaraanId:
                  detailKendaraan?.jenisKendaraan?.id?.toString() || "", // Penting: harus string

                kondisiId: detailKendaraan?.kondisi?.id?.toString() || "", // Penting: harus string
              }}
              validationSchema={editSchema}
              onSubmit={handleSubmitEdit}
              enableReinitialize
            >
              {(props) => (
                <Form>
                  <ModalBody pb={6}>
                    <VStack spacing={4} align="stretch">
                      <Field name="noRangka">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.noRangka && form.touched.noRangka
                            }
                          >
                            <FormLabel>Nomor Rangka</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.noRangka}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="noMesin">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.noMesin && form.touched.noMesin
                            }
                          >
                            <FormLabel>Nomor Mesin</FormLabel>
                            <Input {...field} />
                            <FormErrorMessage>
                              {form.errors.noMesin}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="jenisKendaraanId">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.jenisKendaraanId &&
                              form.touched.jenisKendaraanId
                            }
                          >
                            <FormLabel>Jenis Kendaraan</FormLabel>
                            <Select
                              placeholder="Pilih Jenis Kendaraan"
                              {...field}
                            >
                              {Array.isArray(seed?.jenis) &&
                                seed.jenis.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.jenis}
                                  </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                              {form.errors.jenisKendaraanId}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="kondisiId">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.kondisiId && form.touched.kondisiId
                            }
                          >
                            <FormLabel>Kondisi Kendaraan</FormLabel>
                            <Select
                              placeholder="Pilih Kondisi Kendaraan"
                              {...field}
                            >
                              {Array.isArray(seed?.kondisi) &&
                                seed.kondisi.map((item) => (
                                  <option
                                    key={item.id}
                                    value={item.id.toString()}
                                  >
                                    {item.nama}
                                  </option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                              {form.errors.kondisiId}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>{" "}
                      <Field name="noKontak">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.noKontak && form.touched.noKontak
                            }
                          >
                            <FormLabel>Nomor Kontak</FormLabel>
                            <Input type="number" {...field} />
                            <FormErrorMessage>
                              {form.errors.noKontak}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Simpan
                    </Button>
                    <Button onClick={onEditClose}>Batal</Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
}

export default DetailKendaraanUnitKerja;
