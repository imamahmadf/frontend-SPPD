import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Layout from "../../Componets/Layout";
import Loading from "../../Componets/Loading";
import { useSelector } from "react-redux";
import { userRedux } from "../../Redux/Reducers/auth";
import axios from "axios";
import useDetailData from "./hooks/useDetailData";
import Header from "./Components/Header";
import InformasiPerjalanan from "./Components/InformasiPerjalanan";
import BuktiKegiatan from "./Components/BuktiKegiatan";
import DaftarPersonil from "./Components/DaftarPersonil";
import ModalEditPersonil from "./Components/ModalEditPersonil";
import ModalTambahPersonil from "./Components/ModalTambahPersonil";
import ModalHapusPersonil from "./Components/ModalHapusPersonil";
import ModalEditSubKegiatan from "./Components/ModalEditSubKegiatan";
import ModalEditTempat from "./Components/ModalEditTempat";

function Detail(props) {
  const user = useSelector(userRedux);
  const history = useHistory();
  const perjalananId = props.match.params.id;

  const {
    state,
    actions,
  } = useDetailData(perjalananId, user);

  const {
    detailPerjalanan,
    dataSubKegiatan,
    dataDalamKota,
    isLoading,
    isCreatingAutoBulk,
    isSubmittingPengajuan,
    randomNumber,
    semuaPersonilBelumAdaRincian,
    adaPersonilYangBisaDiajukan,
    adaStatusDuaAtauTiga,
  } = state;

  const {
    fetchDataPerjalan,
    buatOtomatisBulk,
    pengajuanBulk,
    setRandomNumber,
  } = actions;

  // Modal states
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isHapusOpen,
    onOpen: onHapusOpen,
    onClose: onHapusClose,
  } = useDisclosure();

  const {
    isOpen: isTambahOpen,
    onOpen: onTambahOpen,
    onClose: onTambahClose,
  } = useDisclosure();

  // State untuk edit personil
  const [pegawaiId, setPegawaiId] = useState(null);
  const [personilId, setPersonilId] = useState(null);
  const [pegawaiLamaId, setPegawaiLamaId] = useState(null);
  const [personilHapusId, setPersonilHapusId] = useState(null);
  const [namaPegawaiHapus, setNamaPegawaiHapus] = useState("");
  const [pegawaiTambahId, setPegawaiTambahId] = useState(null);

  // State untuk edit sub kegiatan
  const [isEditUntukOpen, setIsEditUntukOpen] = useState(false);
  const [editSubKegiatanId, setEditSubKegiatanId] = useState(null);

  // State untuk edit tempat
  const [isEditTempatOpen, setIsEditTempatOpen] = useState(false);
  const [editTanggalBerangkat, setEditTanggalBerangkat] = useState("");
  const [editTanggalPulang, setEditTanggalPulang] = useState("");
  const [editTujuan, setEditTujuan] = useState("");
  const [editDalamKotaId, setEditDalamKotaId] = useState("");
  const [selectedTempatIndex, setSelectedTempatIndex] = useState(0);
  const [selectedTempatId, setSelectedTempatId] = useState(null);

  // Fungsi untuk mengkonversi tanggal ke format YYYY-MM-DD untuk input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handlers
  const handleEditPegawai = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/edit-pegawai`,
        {
          personilId,
          pegawaiBaruId: pegawaiId,
          pegawaiLamaId,
        }
      );
      onEditClose();
      await fetchDataPerjalan();
    } catch (err) {
      console.error(err);
    }
  };

  const handleHapusPersonil = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/hapus/${personilHapusId}`
      );
      onHapusClose();
      await fetchDataPerjalan();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTambahPersonil = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/pegawai/personil/tambah`,
        {
          perjalananId: perjalananId,
          pegawaiId: pegawaiTambahId,
          indukUnitKerjaId: user[0].unitKerja_profile.indukUnitKerja.id,
          kode: user[0].unitKerja_profile.kode,
          tanggalPengajuan: detailPerjalanan.tanggalPengajuan,
        }
      );
      onTambahClose();
      setPegawaiTambahId(null);
      await fetchDataPerjalan();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTempat = async () => {
    try {
      const payload = {
        tempatId: selectedTempatId,
        tanggalBerangkat: editTanggalBerangkat,
        tanggalPulang: editTanggalPulang,
      };

      if (detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1) {
        payload.dalamKotaId = parseInt(editDalamKotaId);
      } else {
        payload.tujuan = editTujuan;
      }

      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/edit-tempat/${perjalananId}`,
        payload
      );
      setIsEditTempatOpen(false);
      await fetchDataPerjalan();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubKegiatan = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/edit/${perjalananId}`,
        {
          subKegiatanId: editSubKegiatanId,
        }
      );
      setIsEditUntukOpen(false);
      await fetchDataPerjalan();
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers untuk modal
  const onEditPersonilClick = (item) => {
    setPersonilId(item.id);
    setPegawaiLamaId(item.pegawai.id);
    onEditOpen();
  };

  const onHapusPersonilClick = (item) => {
    setPersonilHapusId(item.id);
    setNamaPegawaiHapus(item.pegawai.nama);
    onHapusOpen();
  };

  const onEditSubKegiatanClick = () => {
    setEditSubKegiatanId(
      detailPerjalanan?.daftarSubKegiatan?.id || null
    );
    setIsEditUntukOpen(true);
  };

  const onEditTempatClick = (tempat, index) => {
    setSelectedTempatIndex(index);
    setSelectedTempatId(tempat.id);

    if (detailPerjalanan.jenisPerjalanan?.tipePerjalananId === 1) {
      setEditDalamKotaId(tempat.dalamKota?.id || "");
      setEditTujuan("");
    } else {
      setEditTujuan(tempat.tempat || "");
      setEditDalamKotaId("");
    }

    setEditTanggalBerangkat(formatDateForInput(tempat.tanggalBerangkat));
    setEditTanggalPulang(formatDateForInput(tempat.tanggalPulang));
    setIsEditTempatOpen(true);
  };

  const onEditPerjalananClick = () => {
    setEditSubKegiatanId(
      detailPerjalanan?.daftarSubKegiatan?.id || null
    );
    setIsEditUntukOpen(true);
  };

  if (isLoading) return <Loading />;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("primary", "primary");

  return (
    <>
      <Layout>
        <Box minH="100vh">
          <Header
            detailPerjalanan={detailPerjalanan}
            adaStatusDuaAtauTiga={adaStatusDuaAtauTiga}
            onEditClick={onEditPerjalananClick}
          />

          <Container
            maxW={{ base: "100%", md: "1280px", lg: "1380px" }}
            px={{ base: 4, md: 6 }}
          >
            {/* Grid untuk Informasi Perjalanan dan Bukti Kegiatan */}
            <Grid
              templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
              gap={{ base: 4, md: 6, lg: 8 }}
              mb={{ base: 6, md: 8 }}
            >
              {/* Kolom Kiri - Informasi Perjalanan */}
              <GridItem>
                <InformasiPerjalanan
                  detailPerjalanan={detailPerjalanan}
                  adaStatusDuaAtauTiga={adaStatusDuaAtauTiga}
                  onEditSubKegiatanClick={onEditSubKegiatanClick}
                  onEditTempatClick={onEditTempatClick}
                  formatDateForInput={formatDateForInput}
                  cardBg={cardBg}
                  borderColor={borderColor}
                  headerBg={headerBg}
                />
              </GridItem>

              {/* Kolom Kanan - Bukti Kegiatan */}
              <GridItem>
                <BuktiKegiatan
                  detailPerjalanan={detailPerjalanan}
                  setRandomNumber={setRandomNumber}
                  cardBg={cardBg}
                  borderColor={borderColor}
                  headerBg={headerBg}
                />
              </GridItem>
            </Grid>

            {/* Personil Section */}
            <DaftarPersonil
              detailPerjalanan={detailPerjalanan}
              adaStatusDuaAtauTiga={adaStatusDuaAtauTiga}
              semuaPersonilBelumAdaRincian={semuaPersonilBelumAdaRincian}
              adaPersonilYangBisaDiajukan={adaPersonilYangBisaDiajukan}
              isSubmittingPengajuan={isSubmittingPengajuan}
              isCreatingAutoBulk={isCreatingAutoBulk}
              onPengajuanBulk={pengajuanBulk}
              onBuatOtomatisBulk={buatOtomatisBulk}
              onTambahPersonil={() => {
                setPegawaiTambahId(null);
                onTambahOpen();
              }}
              onEditPersonil={onEditPersonilClick}
              onHapusPersonil={onHapusPersonilClick}
              cardBg={cardBg}
              borderColor={borderColor}
              headerBg={headerBg}
            />
          </Container>

          {/* Modals */}
          <ModalEditPersonil
            isOpen={isEditOpen}
            onClose={onEditClose}
            pegawaiId={pegawaiId}
            setPegawaiId={setPegawaiId}
            onSave={handleEditPegawai}
            headerBg={headerBg}
          />

          <ModalTambahPersonil
            isOpen={isTambahOpen}
            onClose={onTambahClose}
            pegawaiTambahId={pegawaiTambahId}
            setPegawaiTambahId={setPegawaiTambahId}
            onSave={handleTambahPersonil}
            detailPerjalanan={detailPerjalanan}
            headerBg={headerBg}
          />

          <ModalHapusPersonil
            isOpen={isHapusOpen}
            onClose={onHapusClose}
            onConfirm={handleHapusPersonil}
            namaPegawaiHapus={namaPegawaiHapus}
          />

          <ModalEditSubKegiatan
            isOpen={isEditUntukOpen}
            onClose={() => setIsEditUntukOpen(false)}
            editSubKegiatanId={editSubKegiatanId}
            setEditSubKegiatanId={setEditSubKegiatanId}
            dataSubKegiatan={dataSubKegiatan}
            onSave={handleEditSubKegiatan}
            headerBg={headerBg}
          />

          <ModalEditTempat
            isOpen={isEditTempatOpen}
            onClose={() => setIsEditTempatOpen(false)}
            detailPerjalanan={detailPerjalanan}
            selectedTempatIndex={selectedTempatIndex}
            editTanggalBerangkat={editTanggalBerangkat}
            setEditTanggalBerangkat={setEditTanggalBerangkat}
            editTanggalPulang={editTanggalPulang}
            setEditTanggalPulang={setEditTanggalPulang}
            editTujuan={editTujuan}
            setEditTujuan={setEditTujuan}
            editDalamKotaId={editDalamKotaId}
            setEditDalamKotaId={setEditDalamKotaId}
            dataDalamKota={dataDalamKota}
            onSave={handleEditTempat}
            borderColor={borderColor}
            headerBg={headerBg}
          />
        </Box>
      </Layout>
    </>
  );
}

export default Detail;
