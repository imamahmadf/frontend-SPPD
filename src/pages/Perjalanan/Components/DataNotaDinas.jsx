// src/pages/Perjalanan/components/DataNotaDinas.jsx
import React from "react";
import {
  Box,
  Heading,
  HStack,
  Container,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import { Select as Select2 } from "chakra-react-select";

const DataNotaDinas = ({ dataSeed, state, actions, dataKlasifikasi }) => {
  return (
    <Container maxW={"1280px"} variant={"primary"} pt={"30px"} ps={"0px"}>
      <HStack>
        <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
        <Heading color={"primary"}>Data Nota Dinas</Heading>
      </HStack>
      <Box p={"30px"}>
        <FormControl my={"30px"}>
          <FormLabel fontSize={"24px"}>Klasifikasi</FormLabel>
          <Select2
            options={dataSeed.resultKlasifikasi?.map((val) => ({
              value: val,
              label: `${val.kode}-${val.namaKlasifikasi}`,
            }))}
            placeholder="Cari Klasifikasi"
            onChange={(selectedOption) => {
              actions.setKlasifikasi(selectedOption);
              actions.fetchDataKodeKlasifikasi(selectedOption.value.id);
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

        {dataKlasifikasi[0] && (
          <FormControl my={"30px"}>
            <FormLabel fontSize={"24px"}>Kode Klasifikasi</FormLabel>
            <Select2
              options={dataKlasifikasi.map((val) => ({
                value: val,
                label: `${val.kode} - ${val.kegiatan}`,
              }))}
              placeholder="Pilih Klasifikasi"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                actions.setDataKodeKlasifikasi(selectedOption);
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

        <FormControl my={"30px"}>
          <FormLabel fontSize={"24px"}>Untuk</FormLabel>
          <Textarea
            onChange={(e) => actions.setUntuk(e.target.value)}
            placeholder="isi dengan tujuan perjalanan dinas"
            backgroundColor={"terang"}
            p={"20px"}
            minHeight={"160px"}
          />
        </FormControl>

        <FormControl my={"30px"}>
          <FormLabel fontSize={"24px"}>Dasar</FormLabel>
          <Textarea
            onChange={(e) => actions.setDasar(e.target.value)}
            placeholder="isi dengan telaah staff atau undangan"
            backgroundColor={"terang"}
            p={"20px"}
            minHeight={"160px"}
          />
        </FormControl>

        <Flex gap={4}>
          <Checkbox
            isChecked={state.isSrikandi === 1}
            onChange={(e) => actions.setIsSrikandi(e.target.checked ? 1 : 0)}
          >
            Srikandi
          </Checkbox>
          <Checkbox
            isChecked={state.isNotaDinas === 1}
            onChange={(e) => actions.setIsNotaDinas(e.target.checked ? 1 : 0)}
          >
            Nota Dinas
          </Checkbox>
        </Flex>
      </Box>
    </Container>
  );
};

export default DataNotaDinas;
