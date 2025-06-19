// src/pages/Perjalanan/Perjalanan.jsx
import React from "react";
import { Box, Container, useToast, Center, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux } from "../../Redux/Reducers/auth";
import { useHistory } from "react-router-dom";
import Layout from "../../Componets/Layout";
import Loading from "../../Componets/Loading";
import usePerjalananData from "./hooks/usePerjalananData";
import DataNotaDinas from "./Components/DataNotaDinas";
import DaftarPersonil from "./Components/DaftarPersonil";
import TandaTangan from "./Components/TandaTangan";
import DataKeuangan from "./Components/DataKeuangan";
import DataPerjalanan from "./Components/DataPerjalanan";
import PreviewPersonil from "./Components/PreviewPersonil";
import SubmitButton from "./Components/SubmitButton";
import { Formik } from "formik";
import * as Yup from "yup";

function Perjalanan() {
  const user = useSelector(userRedux);
  const history = useHistory();
  const toast = useToast();
  const initialValues = {
    notaDinas: "",
    personil: [null, null, null, null, null], // Untuk 5 orang
    tandaTangan: {
      kepala: "",
      pptk: "",
      kpa: "",
    },
    // Tambahkan field lain sesuai form lainnya
  };

  const validationSchema = Yup.object().shape({
    notaDinas: Yup.string().required("Nota Dinas wajib diisi"),
    personil: Yup.array()
      .of(Yup.object().nullable())
      .min(1, "Minimal 1 personil dipilih"),
    tandaTangan: Yup.object().shape({
      kepala: Yup.string().required("Kepala wajib diisi"),
      pptk: Yup.string().required("PPTK wajib diisi"),
      kpa: Yup.string().required("KPA wajib diisi"),
    }),
    // Tambah validasi lain
  });

  const {
    state,
    actions,
    isLoading,
    dataTemplate,
    selectedPegawai,
    dataSeed,
    dataKota,
    perjalananKota,
  } = usePerjalananData(user);

  if (isLoading) return <Loading />;

  if (!dataTemplate.templateNotaDinas) {
    return (
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
          <Center minH={"80vh"}>
            <Button
              onClick={() => history.push("/admin/template")}
              variant={"primary"}
            >
              Upload Template Surat
            </Button>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Layout>
      <Box bgColor={"secondary"} pb={"40px"} px={"30px"}>
        <DataNotaDinas
          dataSeed={dataSeed}
          state={state}
          actions={actions}
          dataKlasifikasi={state.dataKlasifikasi}
        />

        <DaftarPersonil
          dataPegawai={state.dataPegawai}
          selectedPegawai={selectedPegawai}
          handleSelectChange={actions.handleSelectChange}
        />

        <TandaTangan dataSeed={dataSeed} state={state} actions={actions} />

        <DataKeuangan dataSeed={dataSeed} state={state} actions={actions} />

        {state.dataSumberDana && (
          <DataPerjalanan
            dataSeed={dataSeed}
            state={state}
            actions={actions}
            dataKota={dataKota}
            perjalananKota={perjalananKota}
          />
        )}

        {selectedPegawai.length > 0 && (
          <PreviewPersonil selectedPegawai={selectedPegawai} />
        )}

        <SubmitButton actions={actions} isLoading={isLoading} />
      </Box>
    </Layout>
  );
}

export default Perjalanan;
