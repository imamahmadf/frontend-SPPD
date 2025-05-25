import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";

import { Link, useHistory } from "react-router-dom";
import { Box, Text, Button, Container } from "@chakra-ui/react";

function Detail(props) {
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
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
        <Box pt={"140px"} bgColor={"rgba(249, 250, 251, 1)"} pb={"40px"}>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            p={"30px"}
          >
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
                    <Text>{item.total}</Text>
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
