import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Daftar from "./pages/Daftar";
import Detail from "./pages/Detail";
import Rill from "./pages/Rill";
import Login from "./pages/login";
import Register from "./pages/Register.jsx";
import Rampung from "./pages/Rampung";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess, logout } from "./Redux/Reducers/auth.js";
import ProtectedRoute from "./Componets/ProtectedRoute";
import Template from "./pages/Template.jsx";
import RampungAdmin from "./pages/Admin/RampungAdmin.jsx";
import Perjalanan from "./pages/Perjalanan/Perjalanan.jsx";
import suratKeluarAdmin from "./pages/Admin/suratKeluarAdmin.jsx";
import PengaturanPegawai from "./pages/PengaturanPegawai.jsx";
import DaftarPegawai from "./pages/DaftarPegawai.jsx";
import EditPegawai from "./pages/Admin/EditPegawai.jsx";
import DalamKotaAdmin from "./pages/Admin/DalamKotaAdmin.jsx";
import IndukUnitKerjaAdmin from "./pages/Admin/IndukUnitKerjaAdmin.jsx";
import DetailPegawaiAdmin from "./pages/Admin/DetailPegawaiAdmin.jsx";
import DaftarAdmin from "./pages/Admin/DaftarAdmin.jsx";
import TambahUser from "./pages/Admin/TambahUser.jsx";
import UnitKerjaAdmin from "./pages/Admin/UnitKerjaAdmin.jsx";
import TtdSuratTugasAdmin from "./pages/Admin/TtdSuratTugasAdmin.jsx";
import DaftarIndukUnitKerjaAdmin from "./pages/Admin/DaftarIndukUnitKerjaAdmin.jsx";
import DaftarBendaharaAdmin from "./pages/Admin/DaftarBendaharaAdmin.jsx";
import TambahBendahara from "./pages/Admin/TambahBendahara.jsx";
import NomorSuratAdmin from "./pages/Admin/NomorSuratAdmin.jsx";
import SubKegiatanAdmin from "./pages/Admin/SubKegiatanAdmin.jsx";
import DaftarUserAdmin from "./pages/Admin/DaftarUserAdmin.jsx";
import EditJenisSurat from "./pages/Admin/EditJenisSurat.jsx";
import TemplateKeuangan from "./pages/Admin/TemplateKeuangan.jsx";
import DetailIndukUnitKerja from "./pages/Admin/DetailIndukUnitKerja.jsx";
import DaftarPerjalananPegawai from "./pages/Admin/DaftarPerjalananPegawai.jsx";
import SumberDanaAdmin from "./pages/Admin/SumberDanaAdmin.jsx";
import StatistikPegawai from "./pages/Admin/StatistikPegawai.jsx";
import SuratTugasKadis from "./pages/SuratTugasKadis.jsx";
import Profile from "./pages/Profile.jsx";
import TemplateKadis from "./pages/TemplateKadis.jsx";
import PegawaiUnitKerja from "./pages/PegawaiUnitKerja.jsx";
import PerjalananKadis from "./pages/PerjalananKadis.jsx";
import RekapPerjalanan from "./pages/RekapPerjalanan.jsx";
import KadisKalender from "./pages/KadisKalender.jsx";
import DaftarKendaraan from "./pages/Sijaka/DaftarKendaraan.jsx";
import DetailKendaraan from "./pages/Sijaka/DetailKendaraan.jsx";
import KendaraanUnitKerja from "./pages/Sijaka/KendaraanUnitKerja.jsx";
import TemplateAset from "./pages/Sijaka/TemplateAset.jsx";
import DetailKendaraanUnitKerja from "./pages/Sijaka/DetailKendaraanUnitkerja.jsx";
import pegawaiProfile from "./pages/pegawaiProfile.jsx";
import UsulanPegawai from "./pages/UsulanPegawai.jsx";
import DashboradPegawai from "./pages/DashboradPegawai.jsx";
import NaikGolongan from "./pages/Pegawai/NaikGolongan.jsx";
import DetailUsulan from "./pages/Pegawai/DetailUsulan.jsx";
import DaftarPersediaan from "./pages/Aset/DaftarPersediaan.jsx";
import PersediaanMasuk from "./pages/Aset/PersediaanMasuk.jsx";
import PersediaanKeluar from "./pages/Aset/PersediaanKeluar.jsx";
import DashboardAset from "./pages/Aset/DashboardAset.jsx";
import LaporanPersediaan from "./pages/Aset/LaporanPersediaan.jsx";
import DetailLaporan from "./pages/Aset/DetailLaporan.jsx";
import DaftarSPPD from "./pages/Surat/DaftarSPPD.jsx";
import LaporanPersediaanKeluar from "./pages/Aset/LaporanPersediaanKeluar.jsx";
import RekapAdminAset from "./pages/Aset/RekapAdminAset.jsx";
import SuratPesanan from "./pages/Aset/SuratPesanan.jsx";
import LaporanUsulanPegawai from "./pages/Pegawai/LaporanUsulanPegawai.jsx";
import NaikJenjang from "./pages/Pegawai/NaikJenjang.jsx";
import DaftarNaikJenjang from "./pages/Pegawai/DaftarNaikJenjang.jsx";
import DetailNaikJenjang from "./pages/Pegawai/DetailNaikJenjang.jsx";
import DaftarKwitansiGlobal from "./pages/DaftarKwitansiGlobal.jsx";
import DetailKwitansiGlobal from "./pages/DetailKwitansiGlobal.jsx";
import DaftarKwitansiGlobalKeuangan from "./pages/Admin/DaftarKwitansiGlobalKeuangan.jsx";
import DetailKwitansiGlobalKeuangan from "./pages/Admin/DetailKwitansiGlobalKeuangan.jsx";
import verifikasi from "./pages/Verifikasi.jsx";
// /////PERENCANAAN////////////
import DashboardPerencanaan from "./pages/Perencanaan/DashboardPerencanaan.jsx";
import DaftarProgram from "./pages/Perencanaan/DaftarProgram.jsx";
import DetailSubKegiatan from "./pages/Perencanaan/DetailSubKegiatan.jsx";
import DetailProgram from "./pages/Perencanaan/DetailProgram.jsx";
import DetailKegiatan from "./pages/Perencanaan/DetailKegiatan.jsx";
import DaftarIndikator from "./pages/Perencanaan/DaftarIndikator.jsx";
import DaftarCapaian from "./pages/Perencanaan/DaftarCapaian.jsx";
// ////////PENA///////////////////
import DaftarKendaraanDinas from "./pages/KendaraanDinas/DaftarKendaraanDinas.jsx";
import KendaraanSaya from "./pages/KendaraanDinas/KendaraanSaya.jsx";
import DetailkendaraanDinas from "./pages/KendaraanDinas/DetailKendaraanDinas.jsx";
import PerjalananKendaraanDinas from "./pages/KendaraanDinas/Perjalanan/PerjalananKendaraanDinas.jsx";
import DaftarPerjalananKendaraan from "./pages/KendaraanDinas/DaftarPerjalananKendaraan.jsx";
// /////BARJAS///////////////////////
import DaftarDokumen from "./pages/Barjas/DaftarDokumen.jsx";
import DetailSP from "./pages/Barjas/DetailSP.jsx";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("cek gak token");
          dispatch(logout());
          return;
        }
        console.log("cek ada token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/check-auth`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(data);
        if (data.isAuthenticated) {
          dispatch(
            loginSuccess({
              token: token,
              role: data.user?.role, // Pastikan role disimpan
            })
          );
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Switch>
          <ProtectedRoute
            component={Daftar}
            path="/perjalanan/daftar"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={SuratTugasKadis}
            path="/kepala-dinas/daftar-kadis"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={KadisKalender}
            path="/perjalanan/kalender-kadis"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={Profile}
            path="/profile"
            exact
            roleRoute={[1, 2, 3, 4, 5]}
          />
          <ProtectedRoute
            component={Rampung}
            path="/rampung/:id"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={suratKeluarAdmin}
            path="/surat/surat-keluar"
            exact
            roleRoute={[5, 4]}
          />
          <ProtectedRoute
            component={Detail}
            path="/detail-perjalanan/:id"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={Rill}
            path="/rill/:kwitId"
            exact
            roleRoute={[5, 1]}
          />
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <ProtectedRoute
            component={Template}
            path="/unit-kerja/template"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={TemplateKadis}
            path="/kepala-dinas/template-kadis"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={PerjalananKadis}
            path="/kepala-dinas/perjalanan-kadis"
            exact
            roleRoute={[5, 6]}
          />
          <ProtectedRoute
            component={RampungAdmin}
            path="/admin/rampung/:id"
            exact
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={Perjalanan}
            path="/perjalanan"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={PengaturanPegawai}
            path="/admin/pengaturan-pegawai/:id"
          />
          <ProtectedRoute
            component={DaftarPegawai}
            path="/kepegawaian/daftar-pegawai"
            exact
            roleRoute={[5, 7]}
          />
          <ProtectedRoute
            component={UsulanPegawai}
            path="/kepegawaian/usulan"
            exact
            roleRoute={[5, 7]}
          />
          <ProtectedRoute
            component={DaftarNaikJenjang}
            path="/kepegawaian/daftar-naik-jenjang"
            exact
            roleRoute={[5, 7]}
          />
          <ProtectedRoute
            component={LaporanUsulanPegawai}
            path="/kepegawaian/laporan-usulan-pegawai"
            exact
            roleRoute={[5, 7]}
          />
          <ProtectedRoute
            component={StatistikPegawai}
            path="/kepegawaian/statistik-pegawai"
            exact
            roleRoute={[5, 7]}
          />
          <ProtectedRoute
            component={EditPegawai}
            path="/admin/edit-pegawai/:id"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={DalamKotaAdmin}
            path="/keuangan/dalam-kota"
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={DaftarKwitansiGlobalKeuangan}
            path="/keuangan/daftar-kwitansi-global"
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={DetailKwitansiGlobalKeuangan}
            path="/keuangan/detail-kwitansi-global/:id"
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={DaftarAdmin}
            path="/keuangan/daftar-perjalanan"
            exact
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={TemplateKeuangan}
            path="/keuangan/template"
            exact
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={SumberDanaAdmin}
            path="/keuangan/sumber-dana"
            exact
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={DaftarPerjalananPegawai}
            path="/keuangan/perjalanan-pegawai"
            exact
            roleRoute={[3]}
          />
          <ProtectedRoute
            component={IndukUnitKerjaAdmin}
            path="/unit-kerja/induk-unit-kerja"
            exact
            roleRoute={[2]}
          />
          <ProtectedRoute
            component={DaftarIndukUnitKerjaAdmin}
            path="/admin/daftar-induk-unit-kerja"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={DetailIndukUnitKerja}
            path="/admin/detail-induk-unit-kerja/:id"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={TambahUser}
            path="/admin/tambah-user"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={DaftarUserAdmin}
            path="/admin/daftar-user"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={DetailPegawaiAdmin}
            path="/admin/detail-pegawai/:id"
            exact
            roleRoute={[3, 5]}
          />
          <ProtectedRoute
            component={NomorSuratAdmin}
            path="/surat/nomor"
            exact
            roleRoute={[4, 5]}
          />
          <ProtectedRoute
            component={DaftarSPPD}
            path="/surat/sppd"
            exact
            roleRoute={[4, 5]}
          />
          <ProtectedRoute
            component={TtdSuratTugasAdmin}
            path="/admin/ttd-surat-tugas"
            exact
            roleRoute={[2, 5]}
          />
          <ProtectedRoute
            component={UnitKerjaAdmin}
            path="/admin/unit-kerja/:id"
            exact
            roleRoute={[2, 5]}
          />
          <ProtectedRoute
            component={DaftarBendaharaAdmin}
            path="/unit-kerja/daftar-bendahara"
            exact
            roleRoute={[2, 5]}
          />
          <ProtectedRoute
            component={TambahBendahara}
            path="/admin/tambah-bendahara"
            exact
            roleRoute={[2, 5]}
          />
          <ProtectedRoute
            component={EditJenisSurat}
            path="/admin/edit-jenis-surat"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={SubKegiatanAdmin}
            path="/unit-kerja/sub-kegiatan"
            exact
            roleRoute={[2, 1]}
          />
          <ProtectedRoute
            component={PegawaiUnitKerja}
            path="/unit-kerja/daftar-pegawai"
            exact
            roleRoute={[5, 2]}
          />
          <ProtectedRoute
            component={RekapPerjalanan}
            path="/perjalanan/rekap"
            exact
            roleRoute={[1, 5]}
          />
          <ProtectedRoute
            component={DaftarKendaraan}
            path="/sijaka/daftar-kendaraan"
            exact
            roleRoute={[5, 8]}
          />
          <ProtectedRoute
            component={TemplateAset}
            path="/sijaka/template"
            exact
            roleRoute={[5, 8]}
          />
          <ProtectedRoute
            component={DetailKendaraan}
            path="/sijaka/detail-kendaraan/:id"
            exact
            roleRoute={[5, 8]}
          />
          <ProtectedRoute
            component={DetailKendaraanUnitKerja}
            path="/sijaka/detail-kendaraan/unit-kerja/:id"
            exact
            roleRoute={[5, 10, 8]}
          />
          <ProtectedRoute
            component={KendaraanUnitKerja}
            path="/kendaraan/unit-kerja"
            exact
            roleRoute={[5, 10, 8]}
          />
          <ProtectedRoute
            component={pegawaiProfile}
            path="/kepegawaian/profile"
            exact
            roleRoute={[5, 2]}
          />
          <ProtectedRoute
            component={DashboradPegawai}
            path="/pegawai/dashboard"
            exact
            roleRoute={[9, 5]}
          />
          <ProtectedRoute
            component={NaikGolongan}
            path="/pegawai/naik-golongan"
            exact
            roleRoute={[9, 5]}
          />
          <ProtectedRoute
            component={NaikJenjang}
            path="/pegawai/naik-jenjang"
            exact
            roleRoute={[9, 5]}
          />
          <ProtectedRoute
            component={DetailUsulan}
            path="/pegawai/detail-usulan/:id"
            exact
            roleRoute={[9, 5]}
          />
          <ProtectedRoute
            component={DetailNaikJenjang}
            path="/pegawai/detail-naik-jenjang/:id"
            exact
            roleRoute={[9, 5]}
          />
          <ProtectedRoute
            component={RekapAdminAset}
            path="/admin-aset/rekap-persediaan/:id"
            exact
            roleRoute={[5, 10]}
          />
          <ProtectedRoute
            component={DaftarPersediaan}
            path="/aset/daftar-persediaan"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={SuratPesanan}
            path="/aset/surat-pesanan"
            exact
            roleRoute={[5, 10]}
          />
          <ProtectedRoute
            component={PersediaanMasuk}
            path="/aset/persediaan-masuk"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={PersediaanKeluar}
            path="/aset/persediaan-keluar"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={DashboardAset}
            path="/aset/dashboard"
            exact
            roleRoute={[5, 10, 8]}
          />
          <ProtectedRoute
            component={LaporanPersediaan}
            path="/aset/laporan-persediaan"
            exact
            roleRoute={[5, 10, 8]}
          />
          <ProtectedRoute
            component={DetailLaporan}
            path="/aset/detail-laporan/:id"
            exact
            roleRoute={[5, 10, 8]}
          />
          <ProtectedRoute
            component={LaporanPersediaanKeluar}
            path="/aset/detail-laporan-keluar/:id"
            exact
            roleRoute={[5, 10, 8]}
          />
          <ProtectedRoute
            component={DaftarKwitansiGlobal}
            path="/perjalanan/kwitansi-global"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={DetailKwitansiGlobal}
            path="/perjalanan/detail-kwitansi-global/:id"
            exact
            roleRoute={[5, 1]}
          />
          {/* PERENCANAAN */}
          <ProtectedRoute
            component={DetailSubKegiatan}
            path="/perencanaan/detail-sub-kegiatan/:id"
            exact
            roleRoute={[5, 11]}
          />
          <ProtectedRoute
            component={DetailKegiatan}
            path="/perencanaan/detail-kegiatan/:id"
            exact
            roleRoute={[5, 11]}
          />
          <ProtectedRoute
            component={DetailProgram}
            path="/perencanaan/detail-program/:id"
            exact
            roleRoute={[5, 11]}
          />
          <ProtectedRoute
            component={DashboardPerencanaan}
            path="/perencanaan"
            exact
            roleRoute={[5, 11]}
          />
          <ProtectedRoute
            component={DaftarProgram}
            path="/perencanaan/daftar-program"
            exact
            roleRoute={[5, 11]}
          />
          <ProtectedRoute
            component={DaftarIndikator}
            path="/perencanaan/daftar-indikator"
            exact
            roleRoute={[5, 11]}
          />
          <ProtectedRoute
            component={DaftarCapaian}
            path="/perencanaan/daftar-capaian"
            exact
            roleRoute={[5, 11]}
          />
          {/* ////////PENA/////// */}
          <ProtectedRoute
            component={DaftarKendaraanDinas}
            path="/kendaraan/daftar-kendaraan"
            exact
            roleRoute={[5, 8]}
          />
          <ProtectedRoute
            component={KendaraanSaya}
            path="/kendaraan/kendaraan-saya"
            exact
            roleRoute={[9, 5]}
          />
          <ProtectedRoute
            component={PerjalananKendaraanDinas}
            path="/kendaraan/perjalanan"
            exact
            roleRoute={[5, 8]}
          />
          <ProtectedRoute
            component={DetailkendaraanDinas}
            path="/perjalanan/detail-kendaraan-dinas/:id"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={DaftarPerjalananKendaraan}
            path="/kendaraan/daftar-perjalanan-kendaraan"
            exact
            roleRoute={[5, 1]}
          />
          {/* ///////////////BARJAS/////////////////// */}
          <ProtectedRoute
            component={DaftarDokumen}
            path="/barjas/daftar-dokumen-sp"
            exact
            roleRoute={[5, 1]}
          />{" "}
          <ProtectedRoute
            component={DetailSP}
            path="/barjas/detail-sp/:id"
            exact
            roleRoute={[5, 1]}
          />
          <Route component={verifikasi} path="/verifikasi/:id" />
          <Route component={Home} path="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;

// cek kolaborasi
