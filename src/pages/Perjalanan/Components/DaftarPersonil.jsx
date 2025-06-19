// src/pages/Perjalanan/components/DaftarPersonil.jsx
import React from "react";
import {
  Box,
  Heading,
  HStack,
  Container,
  FormControl,
  FormLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import { Select as Select2 } from "chakra-react-select";
import { useField, useFormikContext } from "formik";

const DaftarPersonil = ({
  dataPegawai,
  selectedPegawai,
  handleSelectChange,
}) => {
  return (
    <Container
      maxW={"1280px"}
      variant={"primary"}
      pt={"30px"}
      ps={"0px"}
      my={"30px"}
    >
      <HStack>
        <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
        <Heading color={"primary"}>Daftar Personil</Heading>
      </HStack>
      <SimpleGrid columns={2} spacing={4} p={"30px"}>
        {[0, 1, 2, 3, 4].map((index) => (
          <FormControl key={index} my={index < 2 ? "15px" : ""}>
            <FormLabel fontSize={"24px"}>Personil {index + 1}</FormLabel>
            <Select2
              options={dataPegawai.result
                ?.filter((val) => val.profesiId !== 1)
                .map((val) => ({
                  value: val,
                  label: `${val.nama}`,
                }))}
              placeholder="Cari Nama Pegawai"
              focusBorderColor="red"
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, index)
              }
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  borderRadius: "6px",
                }),
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "terang",
                  border: "0px",
                  height: "60px",
                  _hover: {
                    borderColor: "yellow.700",
                  },
                  minHeight: "40px",
                }),
                option: (provided, state) => ({
                  ...provided,
                  bg: state.isFocused ? "primary" : "white",
                  color: state.isFocused ? "white" : "black",
                }),
              }}
            />
          </FormControl>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default DaftarPersonil;
