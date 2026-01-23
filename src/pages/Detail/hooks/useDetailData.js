import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const useDetailData = (perjalananId, user) => {
  const [detailPerjalanan, setDetailPerjalanan] = useState([]);
  const [resultUangHarian, setResultUangHarian] = useState([]);
  const [dataSubKegiatan, setDataSubKegiatan] = useState(null);
  const [dataDalamKota, setDataDalamKota] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAuto, setIsCreatingAuto] = useState(false);
  const [isCreatingAutoBulk, setIsCreatingAutoBulk] = useState(false);
  const [isSubmittingPengajuan, setIsSubmittingPengajuan] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const toast = useToast();

  async function fetchDataPerjalan() {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/perjalanan/get/detail-perjalanan/${perjalananId}`
      );
      setDetailPerjalanan(res.data.result);
      setResultUangHarian(res.data.resultUangHarian || []);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSubKegiatan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/sub-kegiatan/get-filter/${user[0]?.unitKerja_profile?.id}`
      )
      .then((res) => {
        setDataSubKegiatan(res.data.result);
        console.log(res.data.result, "SUB KEGIATAN");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataDalamKota() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/dalam-kota/get/dalam-kota/${
          user[0]?.unitKerja_profile?.indukUnitKerja.id
        }`
      )
      .then((res) => {
        setDataDalamKota(res.data.result);
        console.log(res.data.result, "DALAM KOTA");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDataPerjalan(),
        fetchSubKegiatan(),
        fetchDataDalamKota(),
      ]);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  // Refresh data ketika randomNumber berubah
  useEffect(() => {
    if (randomNumber > 0) {
      fetchDataPerjalan();
    }
  }, [randomNumber]);

  // Fungsi untuk menghitung total durasi
  const totalDurasi = detailPerjalanan?.tempats?.reduce(
    (total, tempat) => total + tempat.dalamKota.durasi,
    0
  );

  // Fungsi buat otomatis untuk personil
  const buatOtomatis = (personilId) => {
    const maxTransport = detailPerjalanan?.tempats?.reduce(
      (max, tempat) =>
        tempat.dalamKota.uangTransport > max.dalamKota.uangTransport
          ? tempat
          : max,
      detailPerjalanan.tempats[0]
    );

    setIsCreatingAuto(true);
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/kwitansi-otomatis`,
        {
          personilId: personilId,
          subKegiatan: detailPerjalanan.daftarSubKegiatan.subKegiatan,
          uangHarian: resultUangHarian?.[0]?.nilai,
          uangTransport: maxTransport.dalamKota.uangTransport,
          tempatNama: maxTransport.dalamKota.nama,
          asal: detailPerjalanan.asal,
          totalDurasi,
          pelayananKesehatan: detailPerjalanan.pelayananKesehatan,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchDataPerjalan();
        toast({
          title: "Berhasil!",
          description: "Rincian biaya berhasil dibuat otomatis",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsCreatingAuto(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description:
            err.response?.data?.message ||
            "Terjadi kesalahan saat membuat rincian otomatis",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsCreatingAuto(false);
      });
  };

  // Fungsi buat otomatis untuk semua personil sekaligus (bulk)
  const buatOtomatisBulk = async () => {
    if (detailPerjalanan.jenisPerjalanan?.tipePerjalananId !== 1) {
      toast({
        title: "Error",
        description: "Fitur ini hanya tersedia untuk perjalanan dalam kota",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!detailPerjalanan.tempats || detailPerjalanan.tempats.length === 0) {
      toast({
        title: "Error",
        description: "Data tempat tidak ditemukan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const personilsWithoutRincian = detailPerjalanan.personils.filter(
      (personil) =>
        !personil.rincianBPDs || personil.rincianBPDs.length === 0
    );

    if (personilsWithoutRincian.length === 0) {
      toast({
        title: "Info",
        description: "Semua personil sudah memiliki rincian biaya perjalanan",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingAutoBulk(true);

    try {
      const maxTransport = detailPerjalanan.tempats.reduce(
        (max, tempat) =>
          tempat.dalamKota.uangTransport > max.dalamKota.uangTransport
            ? tempat
            : max,
        detailPerjalanan.tempats[0]
      );

      const personilsData = await Promise.all(
        personilsWithoutRincian.map(async (personil) => {
          let uangHarian = resultUangHarian?.[0]?.nilai;

          if (!uangHarian) {
            try {
              const rampungResponse = await axios.get(
                `${
                  import.meta.env.VITE_REACT_APP_API_BASE_URL
                }/kwitansi/get/rampung/${personil.id}`,
                { params: { unitKerjaId: user[0]?.unitKerja_profile.id } }
              );
              uangHarian =
                rampungResponse.data?.resultUangHarian?.[0]?.nilai ||
                resultUangHarian?.[0]?.nilai;
            } catch (err) {
              console.error(
                `Error fetching uang harian for personil ${personil.id}:`,
                err
              );
              uangHarian = resultUangHarian?.[0]?.nilai;
            }
          }

          return {
            personilId: personil.id,
            uangHarian: uangHarian || 0,
            uangTransport: maxTransport.dalamKota.uangTransport,
            tempatNamaPersonil: maxTransport.dalamKota.nama,
            asalPersonil: detailPerjalanan.asal,
          };
        })
      );

      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/kwitansi-otomatis-bulk`,
        {
          id: detailPerjalanan.id,
          totalDurasi: totalDurasi,
          personils: personilsData,
          tempatNama: maxTransport.dalamKota.nama,
          asal: detailPerjalanan.asal,
          pelayananKesehatan: detailPerjalanan.pelayananKesehatan,
        }
      );

      console.log("Bulk response:", response.data);

      toast({
        title: "Berhasil!",
        description: `Rincian biaya berhasil dibuat otomatis untuk ${personilsData.length} personil`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await fetchDataPerjalan();
    } catch (err) {
      console.error("Error bulk:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "Terjadi kesalahan saat membuat rincian otomatis untuk semua personil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreatingAutoBulk(false);
    }
  };

  // Fungsi pengajuan untuk semua personil sekaligus (bulk)
  const pengajuanBulk = async () => {
    const personilsToSubmit = detailPerjalanan.personils?.filter(
      (personil) => personil.statusId === 1 || personil.statusId === 4
    );

    if (!personilsToSubmit || personilsToSubmit.length === 0) {
      toast({
        title: "Info",
        description: "Tidak ada personil yang dapat diajukan",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmittingPengajuan(true);

    try {
      const pengajuanData = personilsToSubmit.map((personil) => ({
        personilId: personil.id,
        perjalananId: detailPerjalanan.id,
      }));

      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kwitansi/post/pengajuan-bulk`,
        {
          pengajuanData: pengajuanData,
        }
      );

      console.log("Pengajuan bulk berhasil:", response.data);
      toast({
        title: "Berhasil!",
        description: `Pengajuan berhasil dikirim untuk ${personilsToSubmit.length} personil.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      await fetchDataPerjalan();
    } catch (err) {
      console.error("Error pengajuan bulk:", err);

      if (err.response?.status === 404 || err.response?.status === 400) {
        try {
          const promises = personilsToSubmit.map((personil) =>
            axios.post(
              `${
                import.meta.env.VITE_REACT_APP_API_BASE_URL
              }/kwitansi/post/pengajuan/${personil.id}`,
              {
                perjalananId: detailPerjalanan.id,
              }
            )
          );

          await Promise.all(promises);

          toast({
            title: "Berhasil!",
            description: `Pengajuan berhasil dikirim untuk ${personilsToSubmit.length} personil.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          await fetchDataPerjalan();
        } catch (parallelErr) {
          console.error("Error pengajuan paralel:", parallelErr);
          toast({
            title: "Error!",
            description:
              err.response?.data?.message ||
              "Terjadi kesalahan saat mengirim pengajuan.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Error!",
          description:
            err.response?.data?.message ||
            "Terjadi kesalahan saat mengirim pengajuan.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmittingPengajuan(false);
    }
  };

  // Cek apakah semua personil belum memiliki rincianBPDs
  const semuaPersonilBelumAdaRincian =
    detailPerjalanan.personils &&
    detailPerjalanan.personils.length > 0 &&
    detailPerjalanan.personils.every(
      (personil) =>
        !personil.rincianBPDs || personil.rincianBPDs.length === 0
    );

  // Cek apakah ada personil yang bisa diajukan
  const adaPersonilYangBisaDiajukan =
    detailPerjalanan.personils?.some(
      (personil) => personil.statusId === 1 || personil.statusId === 4
    );

  // Ambil semua statusId dari personils
  const statusIds = detailPerjalanan?.personils?.map((item) => item.statusId);

  // Cek apakah ada statusId yang 2 atau 3
  const adaStatusDuaAtauTiga = statusIds?.includes(2) || statusIds?.includes(3);

  return {
    state: {
      detailPerjalanan,
      resultUangHarian,
      dataSubKegiatan,
      dataDalamKota,
      isLoading,
      isCreatingAuto,
      isCreatingAutoBulk,
      isSubmittingPengajuan,
      randomNumber,
      totalDurasi,
      semuaPersonilBelumAdaRincian,
      adaPersonilYangBisaDiajukan,
      adaStatusDuaAtauTiga,
    },
    actions: {
      fetchDataPerjalan,
      buatOtomatis,
      buatOtomatisBulk,
      pengajuanBulk,
      setRandomNumber,
    },
  };
};

export default useDetailData;
