import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Componets/Layout";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { Link, useHistory } from "react-router-dom";
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
  Spacer,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { userRedux, selectRole } from "../Redux/Reducers/auth";
function Daftar() {
  const [dataPerjalanan, setDataPerjalanan] = useState([]);
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");

  const user = useSelector(userRedux);
  const role = useSelector(selectRole);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const postSuratTugas = (val) => {
    console.log(val);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/post/surat-tugas`,
        {
          asal: val.asal,
          jenis: val.jenisPerjalanan.id,
          kode: `${val.daftarSubKegiatan.kodeRekening}.${val.jenisPerjalanan.kodeRekening}`,
          personilFE: val.personils,
          ttdSurTug: val.ttdSuratTuga,
          id: val.id,
          tanggalPengajuan: val.tanggalPengajuan,
          tempat: val.tempats,
          untuk: val.untuk,
          ttdSurTugJabatan: val.ttdSuratTuga.jabatan,
          ttdSurTugNama: val.ttdSuratTuga.pegawai.nama,
          ttdSurTugNip: val.ttdSuratTuga.pegawai.nip,
          ttdSurTugPangkat: val.ttdSuratTuga.pegawai.daftarPangkat.pangkat,
          ttdSurTugGolongan: val.ttdSuratTuga.pegawai.daftarGolongan.golongan,
          ttdSurTugUnitKerja: val.ttdSuratTuga.indukUnitKerjaId,
          KPANama: val.KPA.pegawai_KPA.nama,
          KPANip: val.KPA.pegawai_KPA.nip,
          KPAPangkat: val.KPA.pegawai_KPA.daftarPangkat.pangkat,
          KPAGolongan: val.KPA.pegawai_KPA.daftarGolongan.golongan,
          KPAJabatan: val.KPA.jabatan,
          noNotaDinas: val.suratKeluar.nomor,
          noSuratTugas: val.noSuratTugas,
          unitKerja: user[0]?.unitKerja_profile,
          indukUnitKerjaFE: user[0]?.unitKerja_profile,
        },
        {
          responseType: "blob", // Penting untuk menerima file sebagai blob
        }
      )
      .then((res) => {
        // Buat URL untuk file yang diunduh
        const url = window.URL.createObjectURL(new Blob([res.data])); // Perbaikan di sini
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "letter.docx"); // Nama file yang diunduh
        document.body.appendChild(link);
        link.click();
        link.remove();
        fetchDataPerjalanan();
      })
      .catch((err) => {
        console.error(err); // Tangani error
      });
  };

  async function fetchDataPerjalanan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/all-perjalanan?&time=${time}&page=${page}&limit=${limit}&unitKerjaId=${
          user[0]?.unitKerja_profile?.id
        }`
      )
      .then((res) => {
        setDataPerjalanan(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPerjalanan();
  }, [page]);
  return (
    <>
      <Layout>
        <Box pt={"80px"} bgColor={"secondary"} pb={"40px"} px={"30px"}>
          DAFTAR
          <Box style={{ overflowX: "auto" }}>
            {JSON.stringify(user[0]?.unitKerja_profile)}
            <Table>
              <Thead bgColor={"primary"} border={"1px"}>
                <Tr>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    no.
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    jenis Perjalanan
                  </Th>

                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Unit Kerja Surat Tugas
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    No Surat Tugas
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    No Nota Dinas
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Tanggal Berangkat
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    tanggal Pulang
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Personil 1
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Personil 2
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Personil 3
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Personil 4
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Personil 5
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Kode Rekening
                  </Th>
                  <Th
                    fontSize={"14px"}
                    borderColor={"secondary"}
                    color={"secondary"}
                    py={"15px"}
                    border={"1px"}
                  >
                    Aksi
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataPerjalanan?.map((item, index) => (
                  <Tr key={item.id}>
                    <Td borderWidth="1px" borderColor="primary">
                      {index + 1}
                    </Td>{" "}
                    <Td borderWidth="1px" borderColor="primary">
                      {item.jenisPerjalanan.jenis}
                    </Td>{" "}
                    <Td borderWidth="1px" borderColor="primary">
                      {item.ttdSuratTuga.indukUnitKerja_ttdSuratTugas.kodeInduk}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.noSuratTugas ? item.noSuratTugas : "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.suratKeluar.nomor ? item.suratKeluar.nomor : "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.tempats?.[0]?.tanggalBerangkat
                        ? new Date(
                            item.tempats[0].tanggalBerangkat
                          ).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.tempats?.[0]?.tanggalPulang
                        ? new Date(
                            item.tempats[0].tanggalPulang
                          ).toLocaleDateString()
                        : "-"}
                    </Td>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Td key={i} borderWidth="1px" borderColor="primary">
                        {item.personils?.[i]?.pegawai?.nama || "-"}
                      </Td>
                    ))}
                    <Td borderWidth="1px" borderColor="primary">
                      {item.kodeRekening?.kode || "-"}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary">
                      {item.noSuratTugas ? (
                        <Button
                          onClick={() =>
                            history.push(`/detail-perjalanan/${item.id}`)
                          }
                        >
                          Detail
                        </Button>
                      ) : null}

                      <Button
                        onClick={() => {
                          postSuratTugas(item);
                        }}
                      >
                        Surtug
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              boxSizing: "border-box",
              width: "100%",
              height: "100%",
            }}
          >
            <ReactPaginate
              previousLabel={"+"}
              nextLabel={"-"}
              pageCount={pages}
              onPageChange={changePage}
              activeClassName={"item active "}
              breakClassName={"item break-me "}
              breakLabel={"..."}
              containerClassName={"pagination"}
              disabledClassName={"disabled-page"}
              marginPagesDisplayed={1}
              nextClassName={"item next "}
              pageClassName={"item pagination-page "}
              pageRangeDisplayed={2}
              previousClassName={"item previous"}
            />
          </div>
        </Box>
      </Layout>
    </>
  );
}

export default Daftar;
