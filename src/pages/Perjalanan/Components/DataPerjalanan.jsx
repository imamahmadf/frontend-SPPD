import React from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  HStack,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Select as Select2 } from "chakra-react-select";

const DataPerjalanan = ({
  state,
  actions,
  dataKota,
  dataSeed,
  perjalananKota,
}) => {
  return (
    <Container
      variant={"primary"}
      maxW={"1280px"}
      pt={"30px"}
      ps={"0px"}
      my={"30px"}
    >
      <HStack>
        <Box bgColor={"primary"} width={"30px"} height={"30px"}></Box>
        <Heading color={"primary"}>Data Perjalanan Dinas</Heading>
      </HStack>
      {/* {JSON.stringify(jenisPelayananKesehatan)} */}

      <Box p={"30px"}>
        <FormControl my={"15px"}>
          <FormLabel fontSize={"24px"}>Jenis Perjalanan</FormLabel>
          <Select2
            options={state.dataJenisPerjalanan?.map((val) => {
              return {
                value: val,
                label: `${val.jenis}`,
              };
            })}
            placeholder="Jenis Perjalanan"
            focusBorderColor="red"
            onChange={(selectedOption) => {
              actions.setJenisPerjalanan(selectedOption);
            }}
            components={{
              DropdownIndicator: () => null, // Hilangkan tombol panah
              IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
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
        {state.jenisPerjalanan?.value?.jenis?.includes("Pelayanan") ? (
          <FormControl my={"30px"}>
            <FormLabel fontSize={"24px"}>Jenis Pelayanan Kesehatan</FormLabel>
            <Select2
              options={dataSeed.resultPelayananKesehatan.map((val) => {
                return {
                  value: val.id,
                  label: `${val.jenis}`,
                };
              })}
              placeholder="Jenis Perjalanan"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                actions.setJenisPelayananKesehatan(selectedOption.value);
              }}
              components={{
                DropdownIndicator: () => null, // Hilangkan tombol panah
                IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
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
        ) : null}

        {state.jenisPerjalanan?.value?.tipePerjalananId === 2 ? (
          <Flex my={"30px"} gap={4} direction="column">
            {perjalananKota?.map((item, index) => (
              <Flex key={index} gap={4}>
                <FormControl>
                  <FormLabel fontSize={"24px"}>Nama Kota</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    value={item.kota}
                    onChange={(e) =>
                      actions.handlePerjalananChange(
                        index,
                        "kota",
                        e.target.value
                      )
                    }
                    placeholder="Masukkan Kota"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"24px"}>Tanggal Berangkat</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    type="date"
                    defaultValue={item.tanggalBerangkat}
                    onChange={(e) =>
                      actions.handlePerjalananChange(
                        index,
                        "tanggalBerangkat",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"24px"}>Tanggal Pulang</FormLabel>
                  <Input
                    height={"60px"}
                    bgColor={"terang"}
                    type="date"
                    defaultValue={item.tanggalPulang}
                    onChange={(e) =>
                      actions.handlePerjalananChange(
                        index,
                        "tanggalPulang",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
              </Flex>
            ))}
            <Button
              p={"25px"}
              mt={"15px"}
              variant={"secondary"}
              onClick={actions.addPerjalanan}
            >
              Tambah Kota
            </Button>
          </Flex>
        ) : state.jenisPerjalanan?.value?.tipePerjalananId === 1 ? (
          <Box>
            {dataKota.map((item, index) => {
              return (
                <Flex key={index} gap={4}>
                  <FormControl border={0} bgColor={"white"}>
                    <FormLabel fontSize={"24px"}>Tujuan</FormLabel>
                    <Select2
                      options={dataSeed?.resultDalamKota?.map((val) => {
                        return {
                          value: { id: val.id, nama: val.nama },
                          label: `${val.nama}`,
                        };
                      })}
                      placeholder="Pilih Tujuan"
                      focusBorderColor="red"
                      value={
                        item.dataDalamKota
                          ? {
                              value: item.dataDalamKota,
                              label: dataSeed.resultDalamKota.find(
                                (val) => val.id === item.dataDalamKota.id
                              )?.nama,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        actions.handleDalamKotaChange(
                          index,
                          "dataDalamKota",
                          selectedOption.value
                        )
                      }
                      components={{
                        DropdownIndicator: () => null, // Hilangkan tombol panah
                        IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
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
                  <FormControl>
                    <FormLabel fontSize={"24px"}>Tanggal berangkat</FormLabel>
                    <Input
                      height={"60px"}
                      bgColor={"terang"}
                      type="date"
                      defaultValue={item.tanggalBerangkat}
                      onChange={(e) =>
                        actions.handleDalamKotaChange(
                          index,
                          "tanggalBerangkat",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize={"24px"}>Tanggal Pulang</FormLabel>
                    <Input
                      height={"60px"}
                      bgColor={"terang"}
                      type="date"
                      defaultValue={item.tanggalPulang}
                      onChange={(e) =>
                        actions.handleDalamKotaChange(
                          index,
                          "tanggalPulang",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                </Flex>
              );
            })}

            {dataKota.length > 2 ? null : (
              <Button
                p={"25px"}
                mt={"15px"}
                variant={"secondary"}
                onClick={actions.addDataKota}
              >
                Tambah Kota
              </Button>
            )}
          </Box>
        ) : null}

        <FormControl my={"30px"}>
          <FormLabel fontSize={"24px"}> Sub Kegiatan</FormLabel>
          <Select2
            options={dataSeed?.resultDaftarSubKegiatan?.map((val) => {
              return {
                value: val,
                label: `${val.subKegiatan} - ${val.kodeRekening}`,
              };
            })}
            placeholder="Cari Kegiatan"
            focusBorderColor="red"
            onChange={(selectedOption) => {
              actions.setDataSubKegiatan(selectedOption);
            }}
            components={{
              DropdownIndicator: () => null, // Hilangkan tombol panah
              IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
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
        {/* {JSON.stringify(dataKota)} */}
        {state.dataKegiatan?.value && (
          <>
            <FormControl my={"30px"}>
              <FormLabel fontSize={"24px"}>Sub Kegiatan</FormLabel>
              <Select2
                options={state.dataKegiatan?.value?.subKegiatan.map((val) => {
                  return {
                    value: val,
                    label: `${val.subKegiatan} - ${val.kodeRekening}`,
                  };
                })}
                placeholder="Cari Sub Kegiatan"
                focusBorderColor="red"
                onChange={(selectedOption) => {
                  setDataSubKegiatan(selectedOption);
                }}
                components={{
                  DropdownIndicator: () => null, // Hilangkan tombol panah
                  IndicatorSeparator: () => null, // Kalau mau sekalian hilangkan garis vertikal
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
          </>
        )}
        {state.dataSubKegiatan.value ? (
          <Text>{`Kode Rekening: ${state.dataSubKegiatan?.value?.kodeRekening}${state.jenisPerjalanan?.value?.kodeRekening}`}</Text>
        ) : null}

        <Flex mt={"40px"} gap={4}>
          <FormControl>
            <FormLabel fontSize={"24px"}>Tanggal Pengajuan</FormLabel>
            <Input
              defaultValue={state.tanggalPengajuan}
              type="date"
              height={"60px"}
              variant={"primary"}
              onChange={(e) => actions.handleChange(e, "pengajuan")}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize={"24px"}>Asal</FormLabel>
            <Input
              onChange={(e) => {
                setAsal(e.target.value);
              }}
              defaultValue={state.asal}
              height={"60px"}
              variant={"primary"}
            />
          </FormControl>
        </Flex>
      </Box>
    </Container>
  );
};

export default DataPerjalanan;
