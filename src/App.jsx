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
import Perjalanan from "./pages/Perjalanan.jsx";
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
            path="/daftar"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={SuratTugasKadis}
            path="/daftar/kadis"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={KadisKalender}
            path="/kalender-kadis"
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
            path="/admin/surat-keluar"
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
            path="/admin/template"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={TemplateKadis}
            path="/template-kadis"
            exact
            roleRoute={[5, 1]}
          />
          <ProtectedRoute
            component={PerjalananKadis}
            path="/perjalanan-kadis"
            exact
            roleRoute={[5, 6]}
          />
          <ProtectedRoute
            component={RampungAdmin}
            path="/admin/rampung/:id"
            exact
            roleRoute={[4]}
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
            path="/daftar-pegawai"
            exact
            roleRoute={[5]}
          />

          <ProtectedRoute
            component={StatistikPegawai}
            path="/statistik-pegawai"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={EditPegawai}
            path="/admin/edit-pegawai/:id"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={DalamKotaAdmin}
            path="/admin/dalam-kota"
            roleRoute={[3]}
          />
          <ProtectedRoute
            component={DaftarAdmin}
            path="/admin/keuangan/daftar-perjalanan"
            exact
            roleRoute={[3]}
          />
          <ProtectedRoute
            component={TemplateKeuangan}
            path="/admin/keuangan/template"
            exact
            roleRoute={[3]}
          />
          <ProtectedRoute
            component={SumberDanaAdmin}
            path="/admin/keuangan/sumber-dana"
            exact
            roleRoute={[3]}
          />
          <ProtectedRoute
            component={DaftarPerjalananPegawai}
            path="/admin/keuangan/perjalanan"
            exact
            roleRoute={[3]}
          />
          <ProtectedRoute
            component={IndukUnitKerjaAdmin}
            path="/admin/induk-unit-kerja"
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
            path="/admin/nomor-surat"
            exact
            roleRoute={[4]}
          />
          <ProtectedRoute
            component={TtdSuratTugasAdmin}
            path="/admin/ttd-surat-tugas"
            exact
            roleRoute={[2]}
          />
          <ProtectedRoute
            component={UnitKerjaAdmin}
            path="/admin/unit-kerja/:id"
            exact
            roleRoute={[2]}
          />
          <ProtectedRoute
            component={DaftarBendaharaAdmin}
            path="/admin/daftar-bendahara"
            exact
            roleRoute={[2]}
          />

          <ProtectedRoute
            component={TambahBendahara}
            path="/admin/tambah-bendahara"
            exact
            roleRoute={[2]}
          />
          <ProtectedRoute
            component={EditJenisSurat}
            path="/admin/edit-jenis-surat"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={SubKegiatanAdmin}
            path="/admin/sub-kegiatan"
            exact
            roleRoute={[2]}
          />

          <ProtectedRoute
            component={PegawaiUnitKerja}
            path="/unit-kerja/daftar-pegawai"
            exact
            roleRoute={[5]}
          />
          <ProtectedRoute
            component={RekapPerjalanan}
            path="/rekap-perjalanan"
            exact
            roleRoute={[1, 5]}
          />
          <Route component={Home} path="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
