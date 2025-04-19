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
  Image,
  ModalCloseButton,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Textarea,
  Input,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import Layout from "../Componets/Layout";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";

function Perjalanan() {
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState([]);
  const [tanggalPengajuan, setTanggalPengajuan] = useState("");
  // const [inputEndDate, setInputEndDate] = useState("");
  const [dataSeed, setDataSeed] = useState([]);
  const [untuk, setUntuk] = useState("");
  const [asal, setAsal] = useState(user[0]?.unitKerja_profile?.asal);
  const [dataTtdNotaDinas, setDataTtdNotaDinas] = useState(null);
  const [dataTtdSuratTugas, setDataTtdSuratTugas] = useState(null);
  const [dataPPTK, setDataPPTK] = useState(null);
  const [dataKPA, setDataKPA] = useState(null);
  const [jenisPerjalanan, setJenisPerjalanan] = useState([]);
  const [dataKota, setDataKota] = useState([
    { dataDalamKota: "", tanggalBerangkat: "", tanggalPulang: "" },
  ]);
  const [dataKegiatan, setDataKegiatan] = useState([]);
  const [dataSubKegiatan, setDataSubKegiatan] = useState([]);
  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [tanggalPulang, setTanggalPulang] = useState("");
  const [perjalananKota, setPerjalananKota] = useState([
    { kota: "", tanggalBerangkat: "", tanggalPulang: "" },
  ]);

  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "pengajuan") {
      setTanggalPengajuan(value);
    } else if (field === "berangkat") {
      setTanggalBerangkat(value);
    } else if (field === "pulang") {
      setTanggalPulang(value);
    }
  };

  const submitPerjalanan = () => {
    console.log(
      // selectedPegawai,
      // tanggalPengajuan,
      // dataSeed.resultNomorSurat,
      // untuk,
      // asal,

      dataTtdNotaDinas,
      // dataTtdSurTug
      dataTtdSuratTugas
    );
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/nota-dinas`,
        {
          pegawai: selectedPegawai,
          dataTtdSurTug: dataTtdSuratTugas,
          dataTtdNotaDinas,
          PPTKId: dataPPTK.value.id,
          tanggalPengajuan,
          noSurat: dataSeed?.resultDaftarNomorSurat,
          subKegiatanId: dataSubKegiatan.value.id,
          untuk,
          asal,
          kodeRekeningFE: `${dataKegiatan?.value?.kodeRekening}.${dataSubKegiatan?.value?.kodeRekening}.${jenisPerjalanan.value.kodeRekening}`,
          ttdNotDis: dataTtdNotaDinas,
          perjalananKota,
          sumber: dataKegiatan.value.sumber,
          jenis: jenisPerjalanan.value,
          dalamKota: dataKota,
          tanggalBerangkat,
          tanggalPulang,
          indukUnitKerjaFE: user[0]?.unitKerja_profile,
          KPAId: dataKPA.value.id,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        console.log(res.data); // Log respons dari backend

        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "nota_dinas.docx"); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error(err); // Tangani error
      });
  };

  async function fetchDataPegawai() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pegawai/get`)
      .then((res) => {
        console.log(res.status, res.data, "tessss");

        setDataPegawai(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchSeedPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/seed?indukUnitKerjaId=${
          user[0]?.unitKerja_profile?.indukUnitKerja.id
        }&unitKerjaId=${user[0]?.unitKerja_profile?.id}`
      )
      .then((res) => {
        console.log(res.status, res.data, "tessss");
        setDataSeed(res.data);

        if (res.data.resultPPTK && res.data.resultPPTK.length > 0) {
          setDataPPTK({
            value: res.data.resultPPTK[0],
            label: res.data.resultPPTK[0]?.pegawai_PPTK?.nama,
          });
        }

        if (res.data.resultKPA && res.data.resultKPA.length > 0) {
          setDataKPA({
            value: res.data.resultKPA[0],
            label: res.data.resultKPA[0]?.pegawai_KPA?.nama,
          });
        }
        if (
          res.data.resultTtdNotaDinas &&
          res.data.resultTtdNotaDinas.length > 0
        ) {
          setDataTtdNotaDinas({
            value: res.data.resultTtdNotaDinas[0],
            label: res.data.resultTtdNotaDinas[0]?.pegawai_notaDinas?.nama,
          });
        }

        if (
          res.data.resultTtdSuratTugas &&
          res.data.resultTtdSuratTugas.length > 0
        ) {
          setDataTtdSuratTugas({
            value: res.data.resultTtdSuratTugas[0],
            label: res.data.resultTtdSuratTugas[0]?.pegawai?.nama,
          });
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  useEffect(() => {
    fetchDataPegawai();
    fetchSeedPerjalanan();
  }, []);

  const handleSelectChange = (selectedOption, pegawaiIndex) => {
    if (selectedOption) {
      const newPegawaiList = [...selectedPegawai];
      newPegawaiList[pegawaiIndex] = selectedOption; // Simpan pegawai yang dipilih
      setSelectedPegawai(newPegawaiList);
    }
    console.log(selectedPegawai);
  };

  const handlePerjalananChange = (index, field, value) => {
    const newPerjalanan = [...perjalananKota];
    newPerjalanan[index][field] = value;
    setPerjalananKota(newPerjalanan);
  };

  const handleDalamKotaChange = (index, field, value) => {
    const newDalamKota = [...dataKota];
    newDalamKota[index][field] = value;
    setDataKota(newDalamKota);
  };

  const addPerjalanan = () => {
    setPerjalananKota([
      ...perjalananKota,
      { kota: "", tanggalBerangkat: "", tanggalPulang: "" },
    ]);
  };

  const addDataKota = () => {
    setDataKota([
      ...dataKota,
      { dataDalamKota: "", tanggalBerangkat: "", tanggalPulang: "" },
    ]);
  };

  return (
    <Layout>
      <Box pt={"80px"} bgColor={"white"} pb={"40px"} px={"30px"}>
        {" "}
        {JSON.stringify(user[0]?.unitKerja_profile)}
        <HStack w={"100%"} spacing={4}>
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataPegawai.result?.map((val) => {
                return {
                  value: val,
                  label: `${val.nama}`,
                };
              })}
              placeholder="Cari Nama Pegawai"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption, 0);
              }}
            />
          </FormControl>
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataPegawai.result?.map((val) => {
                return {
                  value: val,
                  label: `${val.nama}`,
                };
              })}
              placeholder="Cari Nama Pegawai"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption, 1);
              }}
            />
          </FormControl>
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataPegawai.result?.map((val) => {
                return {
                  value: val,
                  label: `${val.nama}`,
                };
              })}
              placeholder="Cari Nama Pegawai"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption, 2);
              }}
            />
          </FormControl>
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataPegawai.result?.map((val) => {
                return {
                  value: val,
                  label: `${val.nama}`,
                };
              })}
              placeholder="Cari Nama Pegawai"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption, 3);
              }}
            />
          </FormControl>
          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataPegawai.result?.map((val) => {
                return {
                  value: val,
                  label: `${val.nama}`,
                };
              })}
              placeholder="Cari Nama Pegawai"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption, 4);
              }}
            />
          </FormControl>
        </HStack>{" "}
        <Flex mt={"40px"} gap={4} w={"100%"}>
          <FormControl>
            <FormLabel>Untuk</FormLabel>
            <Textarea
              onChange={(e) => {
                setUntuk(e.target.value);
              }}
              placeholder="isi dengan tujuan perjalanan dinas"
            />
          </FormControl>
          <Box w={"50%"}>
            <Box>
              <Text>Nomor Surat Tugas:</Text>
              <Text>
                {dataSeed?.resultDaftarNomorSurat?.length > 0
                  ? dataSeed.resultDaftarNomorSurat[0]?.jenisSurat.nomorSurat
                  : "Tidak ada data"}
              </Text>
            </Box>
            <Box>
              <Text>Nomor Nota Dinas:</Text>
              <Text>
                {dataSeed?.resultDaftarNomorSurat?.length > 0
                  ? dataSeed.resultDaftarNomorSurat[1]?.jenisSurat.nomorSurat
                  : "Tidak ada data"}
              </Text>
            </Box>
            <Box>
              <Text>Nomor SPD:</Text>
              <Text>
                {dataSeed?.resultDaftarNomorSurat?.length > 0
                  ? dataSeed.resultDaftarNomorSurat[2]?.jenisSurat.nomorSurat
                  : "Tidak ada data"}
              </Text>
            </Box>
          </Box>
        </Flex>
        <Flex mt={"40px"} gap={4}>
          <FormControl
            border={"1px"}
            borderColor="gray.400"
            me="5px"
            maxWidth={"400px"}
          >
            {" "}
            <Text ms="18px">Tanggal Pengajuan</Text>
            <Input
              placeholder="Select Date and Time"
              defaultValue={tanggalPengajuan}
              size="md"
              type="date"
              border={"none"}
              onChange={(e) => handleChange(e, "pengajuan")}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Asal</FormLabel>
            <Input
              onChange={(e) => {
                setAsal(e.target.value);
              }}
              placeholder="isi dengan asal "
              defaultValue={asal}
            />
          </FormControl>
        </Flex>
        {selectedPegawai.length > 0 && (
          <>
            <Table variant="simple" mt={4}>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Nama</Th>
                  <Th>Pangkat/Golongan</Th>
                  <Th>Tingkatan</Th>
                  <Th>Jabatan</Th>
                  <Th>NIP</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedPegawai.map((pegawai, index) => (
                  <Tr key={index}>
                    <Td>{pegawai.value.id}</Td>
                    <Td>{pegawai.value.nama}</Td>
                    <Td>
                      {pegawai.value.daftarPangkat.pangkat}/
                      {pegawai.value.daftarGolongan.golongan}
                    </Td>
                    <Td> {pegawai.value.daftarTingkatan.tingkatan}</Td>
                    <Td>{pegawai.value.jabatan}</Td>
                    <Td>{pegawai.value.nip}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
        <Box>
          <FormControl border={0} bgColor={"white"} flex="1">
            {" "}
            <FormLabel>Ttd Nota Dinas</FormLabel>
            <Select2
              options={
                dataSeed?.resultTtdNotaDinas?.map((val) => {
                  return {
                    value: val,
                    label: `${val?.pegawai_notaDinas?.nama}`,
                  };
                }) || []
              }
              placeholder="Ttd Nota Dinas"
              focusBorderColor="red"
              value={dataTtdNotaDinas}
              onChange={(selectedOption) => {
                setDataTtdNotaDinas(selectedOption);
              }}
            />
          </FormControl>
          <FormControl border={0} bgColor={"white"} flex="1">
            <FormLabel>Ttd Surat Tugas</FormLabel>
            <Select2
              options={[
                {
                  label:
                    dataSeed?.resultTtdSuratTugas?.find(
                      (val) =>
                        val.indukUnitKerjaId ===
                        user[0]?.unitKerja_profile.indukUnitKerja.id
                    )?.["indukUnitKerja-ttdSuratTugas"]?.indukUnitKerja ||
                    "Unit Kerja 2",
                  options:
                    dataSeed?.resultTtdSuratTugas
                      ?.filter((val) => val.indukUnitKerjaId === 2)
                      .map((val) => ({
                        value: val,
                        label: `${val?.pegawai?.nama}`,
                      })) || [],
                },
                {
                  label:
                    dataSeed?.resultTtdSuratTugas?.find(
                      (val) => val.unitKerjaId === 1
                    )?.["indukUnitKerja-ttdSuratTugas"]?.indukUnitKerja ||
                    "Unit Kerja 1",
                  options:
                    dataSeed?.resultTtdSuratTugas
                      ?.filter((val) => val.indukUnitKerjaId === 1)
                      .map((val) => ({
                        value: val,
                        label: `${val?.pegawai?.nama}`,
                      })) || [],
                },
              ]}
              placeholder="Ttd Surat Tugas"
              focusBorderColor="red"
              value={dataTtdSuratTugas}
              onChange={(selectedOption) => {
                setDataTtdSuratTugas(selectedOption);
              }}
            />
          </FormControl>
          <FormControl border={0} bgColor={"white"} flex="1">
            <FormLabel>Kuasa Pengguna Anggaran</FormLabel>
            <Select2
              options={
                dataSeed?.resultKPA?.map((val) => {
                  return {
                    value: val,
                    label: `${val?.pegawai_KPA?.nama}`,
                  };
                }) || []
              }
              placeholder="Kuasa Pengguna Anggaran"
              focusBorderColor="red"
              value={dataKPA}
              onChange={(selectedOption) => {
                setDataKPA(selectedOption);
              }}
            />
          </FormControl>

          <FormControl border={0} bgColor={"white"} flex="1">
            <FormLabel>PPTK</FormLabel>
            <Select2
              options={
                dataSeed?.resultPPTK?.map((val) => {
                  return {
                    value: val,
                    label: `${val?.pegawai_PPTK?.nama}`,
                  };
                }) || []
              }
              placeholder="PPTK"
              focusBorderColor="red"
              value={dataPPTK}
              onChange={(selectedOption) => {
                setDataPPTK(selectedOption);
              }}
            />
          </FormControl>

          <FormControl border={0} bgColor={"white"} flex="1">
            <Select2
              options={dataSeed?.resultDaftarKegiatan?.map((val) => {
                return {
                  value: val,
                  label: `${val.kegiatan} - ${val.kodeRekening}`,
                };
              })}
              placeholder="Cari Kegiatan"
              focusBorderColor="red"
              onChange={(selectedOption) => {
                setDataKegiatan(selectedOption);
              }}
            />
          </FormControl>
          {JSON.stringify(dataKota)}
          {dataKegiatan?.value && (
            <>
              <FormControl border={0} bgColor={"white"} flex="1">
                <Select2
                  options={dataKegiatan?.value?.subKegiatan.map((val) => {
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
                />
              </FormControl>
            </>
          )}
          {dataSubKegiatan.value ? (
            <Text>{`Kode Rekening: ${dataKegiatan?.value?.kodeRekening}.${dataSubKegiatan?.value?.kodeRekening}.${jenisPerjalanan?.value?.kodeRekening}`}</Text>
          ) : null}
        </Box>
        <FormControl border={0} bgColor={"white"} flex="1">
          <Select2
            options={dataSeed?.resultJenisPerjalanan?.map((val) => {
              return {
                value: val,
                label: `${val.jenis}`,
              };
            })}
            placeholder="Jenis Perjalanan"
            focusBorderColor="red"
            onChange={(selectedOption) => {
              setJenisPerjalanan(selectedOption);
            }}
          />
        </FormControl>
        {jenisPerjalanan?.value?.id === 1 ? (
          <Flex mt={"40px"} gap={4} direction="column">
            {perjalananKota.map((item, index) => (
              <Flex key={index} gap={4}>
                <FormControl>
                  <FormLabel>Kota</FormLabel>
                  <Input
                    value={item.kota}
                    onChange={(e) =>
                      handlePerjalananChange(index, "kota", e.target.value)
                    }
                    placeholder="Masukkan Kota"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tanggal Berangkat</FormLabel>
                  <Input
                    type="date"
                    defaultValue={item.tanggalBerangkat}
                    onChange={(e) =>
                      handlePerjalananChange(
                        index,
                        "tanggalBerangkat",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tanggal Pulang</FormLabel>
                  <Input
                    type="date"
                    defaultValue={item.tanggalPulang}
                    onChange={(e) =>
                      handlePerjalananChange(
                        index,
                        "tanggalPulang",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
              </Flex>
            ))}
            <Button onClick={addPerjalanan}>Tambah Kota</Button>
          </Flex>
        ) : jenisPerjalanan?.value?.id === 2 ? (
          <Box>
            {dataKota.map((item, index) => {
              return (
                <Flex key={index} gap={4}>
                  <FormControl border={0} bgColor={"white"}>
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
                        handleDalamKotaChange(
                          index,
                          "dataDalamKota",
                          selectedOption.value
                        )
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tanggal Berangkat</FormLabel>
                    <Input
                      type="date"
                      defaultValue={item.tanggalBerangkat}
                      onChange={(e) =>
                        handleDalamKotaChange(
                          index,
                          "tanggalBerangkat",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tanggal Pulang</FormLabel>
                    <Input
                      type="date"
                      defaultValue={item.tanggalPulang}
                      onChange={(e) =>
                        handleDalamKotaChange(
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
              <Button onClick={addDataKota}>Tambah Kota</Button>
            )}
          </Box>
        ) : null}
        <Button onClick={submitPerjalanan}>Submit</Button>
      </Box>
    </Layout>
  );
}

export default Perjalanan;
