import React from "react";
import {
  Box,
  Heading,
  HStack,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Select as Select2 } from "chakra-react-select";
import { useFormikContext, getIn } from "formik";

const DataKeuangan = ({ dataSeed, actions }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const sumberDanaError = getIn(errors, "sumberDana");
  const sumberDanaTouched = getIn(touched, "sumberDana");

  const bendaharaError = getIn(errors, "bendahara");
  const bendaharaTouched = getIn(touched, "bendahara");

  return (
    <Container maxW="1280px" variant="primary" pt="30px" ps="0px" mt="30px">
      <HStack>
        <Box bgColor="primary" width="30px" height="30px" />
        <Heading color="primary">Data Keuangan</Heading>
      </HStack>
      <Box p="30px">
        {/* Sumber Dana */}
        <FormControl
          my="15px"
          isInvalid={!!sumberDanaError && sumberDanaTouched}
        >
          <FormLabel fontSize="24px">Sumber Dana</FormLabel>
          <Select2
            name="sumberDana"
            options={dataSeed?.resultSumberDana?.map((val) => ({
              value: val,
              label: `${val.sumber}`,
            }))}
            placeholder="Pilih Sumber Dana"
            value={values.sumberDana}
            onChange={(selectedOption) => {
              setFieldValue("sumberDana", selectedOption);
              setFieldValue("bendahara", null); // reset bendahara jika ganti sumber dana
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
          <FormErrorMessage>{sumberDanaError}</FormErrorMessage>
        </FormControl>

        {/* Bendahara */}
        {values.sumberDana?.value && (
          <FormControl
            isInvalid={!!bendaharaError && bendaharaTouched}
            mt="20px"
          >
            <FormLabel fontSize="24px">Bendahara</FormLabel>
            <Select2
              name="bendahara"
              options={values.sumberDana?.value?.bendaharas?.map((val) => ({
                value: val,
                label: `${val.jabatan} - ${val.pegawai_bendahara.nama}`,
              }))}
              placeholder="Pilih Bendahara"
              value={values.bendahara}
              onChange={(selectedOption) =>
                setFieldValue("bendahara", selectedOption)
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
            <FormErrorMessage>{bendaharaError}</FormErrorMessage>
          </FormControl>
        )}
      </Box>
    </Container>
  );
};

export default DataKeuangan;
