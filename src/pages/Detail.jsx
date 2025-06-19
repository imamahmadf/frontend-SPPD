import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";

import { Link, useHistory } from "react-router-dom";
import { Box, Text, Button, Container } from "@chakra-ui/react";

function Detail(props) {
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const daftarTempat = detailPerjalanan.tempats?.map(
    (tempat, index) =>
      `${
        detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1
          ? tempat.dalamKota.nama
          : tempat.tempat
      }${index < detailPerjalanan.tempats.length - 1 ? `, ` : ``}`
  );
  async function fetchDataPerjalan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/detail-perjalanan/${props.match.params.id}`
      )
      .then((res) => {
        setDetailPerjalanan(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const history = useHistory();

  useEffect(() => {
    fetchDataPerjalan();
  }, []);
  return (
    <>
      <Layout>
        <Box>
          <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
            <Box>
              <Text>Asal: {detailPerjalanan.asal}</Text>
              <Text>Dasar: {detailPerjalanan.dasar || "-"}</Text>{" "}
              <Text>No. Surat Tugas: {detailPerjalanan.noSuratTugas}</Text>{" "}
              <Text>
                No. Nota Dinas:{" "}
                {detailPerjalanan.isNotaDinas
                  ? detailPerjalanan.noNotaDinas
                  : "-"}
              </Text>{" "}
              <Text>
                No. Telaahan Staf:{" "}
                {detailPerjalanan.isNotaDinas
                  ? "-"
                  : detailPerjalanan.noNotaDinas}
              </Text>
              <Text>
                Tanggal Pengajuan:
                {new Date(detailPerjalanan.tanggalPengajuan).toLocaleDateString(
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
                Tanggal Berangkat:{" "}
                {new Date(
                  detailPerjalanan.tempats?.[0]?.tanggalBerangkat
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Text>
                Tanggal Pulang:{" "}
                {new Date(
                  detailPerjalanan.tempats?.[
                    detailPerjalanan.tempats?.length - 1
                  ]?.tanggalPulang
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Text>
                Sumber Dana: {detailPerjalanan.bendahara?.sumberDana?.sumber}
              </Text>
              <Text>Tujuan: {daftarTempat}</Text>
            </Box>
          </Container>
          <Container variant={"primary"} maxW={"1280px"} p={"30px"}>
            {detailPerjalanan?.personils?.map((item, index) => {
              return (
                <>
                  <Box
                    bgColor={"primary"}
                    borderRadius={"5px"}
                    color={"white"}
                    p={"10px"}
                    m={"15px"}
                  >
                    <Text>{item.pegawai.nama}</Text>

                    <Button
                      onClick={() => {
                        history.push(`/rampung/${item.id}`);
                      }}
                    >
                      {" "}
                      Rampung
                    </Button>
                  </Box>
                </>
              );
            })}
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default Detail;
