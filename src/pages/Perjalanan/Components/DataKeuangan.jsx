// src/pages/Perjalanan/components/DataKeuangan.jsx
import React from "react";
import {
  Box,
  Heading,
  HStack,
  Container,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Select as Select2 } from "chakra-react-select";

const DataKeuangan = ({ dataSeed, state, actions }) => {
  return (
    <Container
      maxW={"1280px"}
      variant={"primary"}
      pt={"30px"}
      ps={"0px"}
      mt={"30px"}
    >
      <HStack>
        <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
        <Heading color={"primary"}>Data Keuangan</Heading>
      </HStack>
      <Box p={"30px"}>
        <FormControl my={"15px"}>
          <FormLabel fontSize={"24px"}>Sumber Dana</FormLabel>
          <Select2
            options={dataSeed?.resultSumberDana?.map((val) => ({
              value: val,
              label: `${val.sumber}`,
            }))}
            placeholder="sumber dana"
            focusBorderColor="red"
            onChange={(selectedOption) => {
              actions.setDataSumberDana(selectedOption);
              actions.fetchJenisPerjalanan(selectedOption.value.id);
            }}
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

        {state.dataSumberDana?.value && (
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={state.dataSumberDana?.value?.bendaharas.map((val) => ({
                value: val,
                label: `${val.jabatan} - ${val.pegawai_bendahara.nama}`,
              }))}
              placeholder="Cari Bendahara"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                actions.setDataBendahara(selectedOption.value);
              }}
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
        )}
      </Box>
    </Container>
  );
};

export default DataKeuangan;
