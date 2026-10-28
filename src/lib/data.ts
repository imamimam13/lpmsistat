import { prisma } from "./prisma";

export const ACCREDITATION_CRITERIA = [
  "Kriteria 1: Visi, Misi, Tujuan, dan Strategi (VMTS)",
  "Kriteria 2: Tata Pamong, Tata Kelola, dan Kerjasama",
  "Kriteria 3: Mahasiswa",
  "Kriteria 4: Sumber Daya Manusia (Dosen & Tendik)",
  "Kriteria 5: Keuangan, Sarana, dan Prasarana",
  "Kriteria 6: Pendidikan (Kurikulum, Pembelajaran, Suasana Akademik)",
  "Kriteria 7: Penelitian",
  "Kriteria 8: Pengabdian kepada Masyarakat (PkM)",
  "Kriteria 9: Luaran dan Capaian Tridharma",
];

export const SCOPE_LIST = [
  {
    value: "AKADEMIK_SPMI",
    label: "Tindak Lanjut Kegiatan Akademik & Kurikulum",
    shortLabel: "Kegiatan Akademik",
    color: "#1e3a8a",
  },
  {
    value: "AMI_MONEV",
    label: "Temuan Audit Mutu Internal (AMI) & Monev SPMI",
    shortLabel: "Temuan AMI & Monev",
    color: "#0284c7",
  },
  {
    value: "LAYANAN_SARPRAS",
    label: "Standar Layanan, SDM, Sarpras & Tata Kelola",
    shortLabel: "Layanan & Sarpras",
    color: "#7c3aed",
  },
  {
    value: "ETIK_SATGAS",
    label: "Laporan Satgas (Etik, PPKS, Perundungan & Narkoba)",
    shortLabel: "Satgas Etik & PPKS",
    color: "#dc2626",
  },
];

export const SPMI_STANDARDS = [
  "Standar Kompetensi Lulusan",
  "Standar Isi Pembelajaran (Kurikulum)",
  "Standar Proses Pembelajaran",
  "Standar Penilaian Pembelajaran",
  "Standar Dosen & Tenaga Kependidikan",
  "Standar Sarana & Prasarana Pembelajaran",
  "Standar Pengelolaan Pembelajaran",
  "Standar Pembiayaan Pembelajaran",
  "Standar Penelitian & Publikasi Ilmiah",
  "Standar Pengabdian kepada Masyarakat (PkM)",
  "Standar Kemahasiswaan, Etik & Kampus Aman (Satgas)",
  "Standar Kerjasama & Tata Kelola Institusi",
];

export const DEFAULT_AMI_INDICATORS = [
  {
    spmiStandard: "Standar Kompetensi Lulusan",
    indicatorText: "Kesesuaian profil lulusan, CPL, dan pelacakan masa tunggu kerja lulusan (Tracer Study).",
    targetDesc: "Masa tunggu lulusan < 6 bulan minimal 80% & dokumen CPL lengkap",
    accreditationCriterion: "Kriteria 9: Luaran dan Capaian Tridharma",
  },
  {
    spmiStandard: "Standar Isi Pembelajaran (Kurikulum)",
    indicatorText: "Peninjauan kurikulum berkala bersama stakeholder industri & integrasi matakuliah berbasis OBE/MBKM.",
    targetDesc: "100% Mata Kuliah memiliki dokumen kurikulum berbasis OBE mutakhir",
    accreditationCriterion: "Kriteria 6: Pendidikan (Kurikulum, Pembelajaran, Suasana Akademik)",
  },
  {
    spmiStandard: "Standar Proses Pembelajaran",
    indicatorText: "Ketercapaian 16 pertemuan perkuliahan, ketersediaan RPS, dan ketepatan waktu pembimbingan Tugas Akhir.",
    targetDesc: "100% MK memiliki RPS & kehadiran dosen >= 95%",
    accreditationCriterion: "Kriteria 6: Pendidikan (Kurikulum, Pembelajaran, Suasana Akademik)",
  },
  {
    spmiStandard: "Standar Penilaian Pembelajaran",
    indicatorText: "Transparansi rubrik penilaian berbasis CPL dan ketepatan waktu unggah nilai akhir semester di SIAKAD.",
    targetDesc: "100% Nilai diunggah tepat waktu sesuai kalender akademik",
    accreditationCriterion: "Kriteria 6: Pendidikan (Kurikulum, Pembelajaran, Suasana Akademik)",
  },
  {
    spmiStandard: "Standar Dosen & Tenaga Kependidikan",
    indicatorText: "Pemenuhan rasio dosen tetap, pelaporan BKD/Sister, dan kualifikasi jabatan fungsional akademik.",
    targetDesc: "100% Dosen melaporkan BKD Memenuhi (M) setiap semester",
    accreditationCriterion: "Kriteria 4: Sumber Daya Manusia (Dosen & Tendik)",
  },
  {
    spmiStandard: "Standar Sarana & Prasarana Pembelajaran",
    indicatorText: "Kelaikan ruang kuliah, kalibrasi alat laboratorium praktikum, dan aksesibilitas sarana ramah disabilitas.",
    targetDesc: "Seluruh laboratorium terkalibrasi & sarpras layak pakai",
    accreditationCriterion: "Kriteria 5: Keuangan, Sarana, dan Prasarana",
  },
  {
    spmiStandard: "Standar Penelitian & Publikasi Ilmiah",
    indicatorText: "Keterlibatan mahasiswa dalam peta jalan penelitian dosen dan luaran publikasi jurnal terakreditasi/bereputasi.",
    targetDesc: "Minimal 1 publikasi bereputasi/Sinta per dosen per tahun",
    accreditationCriterion: "Kriteria 7: Penelitian",
  },
  {
    spmiStandard: "Standar Pengabdian kepada Masyarakat (PkM)",
    indicatorText: "Hilirisasi hasil riset dalam kegiatan PkM dosen dan integrasi dengan pembelajaran/KKN mahasiswa.",
    targetDesc: "100% Dosen melaksanakan PkM sesuai bidang keilmuan",
    accreditationCriterion: "Kriteria 8: Pengabdian kepada Masyarakat (PkM)",
  },
  {
    spmiStandard: "Standar Kemahasiswaan, Etik & Kampus Aman (Satgas)",
    indicatorText: "Sosialisasi & kepatuhan pencegahan kekerasan seksual (PPKS), perundungan, intoleransi, dan bahaya narkoba.",
    targetDesc: "Zero tolerance pelanggaran etik & 100% kegiatan kemahasiswaan berizin",
    accreditationCriterion: "Kriteria 3: Mahasiswa",
  },
];

export const AUDIT_STATUS_LIST = [
  { value: "DIJADWALKAN", label: "Dijadwalkan (Persiapan)", color: "#64748b" },
  { value: "DESK_EVALUATION", label: "Evaluasi Dokumen (Desk Evaluation)", color: "#0284c7" },
  { value: "VISITASI_LAPANGAN", label: "Asesmen / Visitasi Lapangan", color: "#d97706" },
  { value: "SELESAI_LHA", label: "Selesai & LHA Diterbitkan", color: "#10b981" },
];

export const COMPLIANCE_LIST = [
  { value: "MELAMPAUI", label: "Melampaui Standar (Skor 4)", score: 4, color: "#059669" },
  { value: "MENCAPAI", label: "Mencapai Standar (Skor 3)", score: 3, color: "#0284c7" },
  { value: "OBSERVASI", label: "Observasi / OB (Skor 2)", score: 2, color: "#0d9488" },
  { value: "KTS_MINOR", label: "Belum Mencapai - KTS Minor (Skor 2)", score: 2, color: "#d97706" },
  { value: "KTS_MAYOR", label: "Menyimpang - KTS Mayor (Skor 1)", score: 1, color: "#dc2626" },
];

export const FINDING_TYPES = [
  { value: "EVALUASI_RUTIN", label: "Evaluasi / Monev Akademik Rutin", color: "#0284c7" },
  { value: "OBSERVASI", label: "Observasi (OB) - Peluang Peningkatan", color: "#0d9488" },
  { value: "KTS_MINOR", label: "Ketidaksesuaian (KTS) Minor", color: "#d97706" },
  { value: "KTS_MAYOR", label: "Ketidaksesuaian (KTS) Mayor", color: "#ea580c" },
  { value: "PENGADUAN", label: "Laporan Pengaduan / Insiden Satgas", color: "#dc2626" },
];

export const CATEGORIES = [
  "Monev Perkuliahan, RPS & Kehadiran Dosen",
  "Pembimbingan Tugas Akhir / Skripsi / Tesis",
  "Evaluasi Kurikulum & Capaian Pembelajaran (CPL/OBE)",
  "Temuan Audit Mutu Internal (AMI) Prodi/Unit",
  "Kinerja Penelitian, Publikasi & Pengabdian (LPPM)",
  "Keluhan Layanan Akademik, Laboratorium & Sarpras",
  "Pelanggaran Integritas Akademik & Etik Dosen/Mhs",
  "Satgas PPKS (Kekerasan Seksual & Perundungan)",
  "Satgas Pencegahan Narkoba, Intoleransi & Disiplin",
];

export const REPORTER_ROLES = [
  "Auditor AMI / Tim LPMI",
  "Gugus Penjaminan Mutu (GPM / GKM)",
  "Pimpinan Fakultas / Kaprodi",
  "Dosen",
  "Mahasiswa",
  "Tenaga Kependidikan",
  "Masyarakat / Alumni / Stakeholder",
];

export const UNIT_TYPES = [
  { value: "FAKULTAS", label: "Fakultas" },
  { value: "PRODI", label: "Program Studi / Jurusan" },
  { value: "PASCASARJANA", label: "Sekolah / Program Pascasarjana" },
  { value: "LEMBAGA", label: "Lembaga (LPPM / LPMI)" },
  { value: "BIRO_UPT", label: "Biro / UPT / Direktorat" },
  { value: "UMUM", label: "Lingkungan Umum Kampus" },
];

export const STATUS_LIST = [
  { value: "DITERIMA", label: "Temuan / Laporan Diterima", color: "#64748b", group: "PENDING" },
  { value: "VERIFIKASI", label: "Telaah & Verifikasi LPMI", color: "#0284c7", group: "PROSES" },
  { value: "INVESTIGASI", label: "Audit / Pemeriksaan / Klarifikasi", color: "#d97706", group: "PROSES" },
  { value: "PENDAMPINGAN", label: "Implementasi Tindak Lanjut Unit", color: "#7c3aed", group: "PROSES" },
  { value: "SELESAI", label: "Selesai Ditindaklanjuti (Closed)", color: "#10b981", group: "SELESAI" },
  { value: "DITOLAK", label: "Tidak Terbukti / Ditutup", color: "#ef4444", group: "DITOLAK" },
];

export const RTL_STATUS_LIST = [
  { value: "BELUM_DIBUAT", label: "Belum Ada RTL", color: "#94a3b8" },
  { value: "DIRENCANAKAN", label: "RTL Direncanakan (Desain)", color: "#0284c7" },
  { value: "BERJALAN", label: "Implementasi RTL Berjalan", color: "#d97706" },
  { value: "TERVERIFIKASI", label: "RTL Terverifikasi Efektif (Closed AMI)", color: "#10b981" },
];

export const RTL_FROM_RTM_STATUS_LIST = [
  { value: "MENUNGGU_PELAKSANAAN", label: "Menunggu Pelaksanaan", color: "#d97706" },
  { value: "BERJALAN", label: "Sedang Dilaksanakan Unit", color: "#0284c7" },
  { value: "TUNTAS", label: "Tuntas Dievaluasi RTM Berikutnya", color: "#10b981" },
];

export const URGENCY_LIST = [
  { value: "RENDAH", label: "Rendah / Rutin" },
  { value: "SEDANG", label: "Sedang / Prioritas Standar" },
  { value: "TINGGI", label: "Tinggi / KTS Mayor" },
  { value: "DARURAT", label: "Darurat / Mendesak" },
];

// Helper deterministik tanpa AI: Otomatis merumuskan Akar Masalah, RTL Unit, dan Keputusan RTM serta RTL Lanjutan dari RTM
export function generateDeterministicQualityFlow(
  standard: string,
  indicatorText: string,
  unit: string,
  findingType: string
) {
  let rootCause = `Belum optimalnya kepatuhan pemenuhan ${standard} pada ${unit}. Belum tersedianya SOP pemantauan periodik dan alokasi sumber daya yang memadai.`;
  let rtlPlan = `Penyusunan instrumen monitoring berkala, pemutakhiran SOP unit, serta bimbingan teknis bagi pelaksana ${unit}.`;
  let rtmAgenda = `Pemberian mandat pemenuhan standar ${standard} kepada pimpinan ${unit} serta evaluasi berkala oleh Gugus Penjaminan Mutu.`;
  let rtlFromRtm = `Pimpinan Universitas menginstruksikan integrasi sistem pelaporan pemenuhan ${standard} ke sistem informasi universitas dan alokasi anggaran percepatan akreditasi.`;

  if (standard.includes("Proses Pembelajaran") || standard.includes("Kurikulum")) {
    rootCause = `Monitoring kesesuaian RPS berbasis OBE dan kehadiran perkuliahan belum terpantau harian di tingkat program studi.`;
    rtlPlan = `Kewajiban audit silang RPS oleh GKM/GPM dan penertiban jadwal kuliah pengganti sebelum pekan ujian.`;
    rtmAgenda = `Pengesahan kebijakan penjaminan mutu perkuliahan berbasis OBE dan pengetatan syarat verifikasi nilai akhir.`;
    rtlFromRtm = `LPMI bersama BAAK mewajibkan sistem kunci otomatis (auto-lock) portal perkuliahan jika RPS atau absensi dosen kurang dari 16 pertemuan.`;
  } else if (standard.includes("Kompetensi Lulusan")) {
    rootCause = `Tingkat partisipasi alumni dalam pengisian instrumen Tracer Study masih di bawah target 80% saat akreditasi.`;
    rtlPlan = `Penerapan Tracer Study terintegrasi saat penyerahan ijazah/wisuda dan pembentukan ikatan alumni prodi aktif.`;
    rtmAgenda = `Penetapan IKU Serapan Lulusan < 6 bulan dan pemberian insentif program percepatan kerja bagi prodi.`;
    rtlFromRtm = `Wakil Rektor Bidang Kemahasiswaan memfasilitasi career fair berkala dan kerja sama magang bersertifikat industri.`;
  } else if (standard.includes("Sarana")) {
    rootCause = `Jadwal pemeliharaan preventif sarana laboratorium belum terintegrasi dengan kalender akademik semester.`;
    rtlPlan = `Pelaksanaan kalibrasi alat uji secara terjadwal dan pemenuhan sarpras ramah disabilitas di gedung perkuliahan.`;
    rtmAgenda = `Prioritas alokasi dana sarana prasarana penunjang praktikum dan peremajaan lisensi software laboratorium.`;
    rtlFromRtm = `Biro Keuangan dan Sarpras menerbitkan kontrak kerja sama maintenance tahunan dengan vendor kalibrasi resmi.`;
  } else if (standard.includes("Dosen")) {
    rootCause = `Sebagian dosen belum memperbarui portofolio Sister/BKD tepat waktu dan publikasi ilmiah belum merata.`;
    rtlPlan = `Klinik pendampingan pengurusan jabatan fungsional Lektor/Guru Besar dan percepatan pengisian Sister.`;
    rtmAgenda = `Evaluasi beban kerja dosen dan insentif publikasi internasional bereputasi untuk menunjang akreditasi unggul.`;
    rtlFromRtm = `LPMI dan LPPM menetapkan target roadmap penelitian dosen per rumpun ilmu dengan pendanaan matching fund kampus.`;
  } else if (standard.includes("Kemahasiswaan") || standard.includes("Etik")) {
    rootCause = `Sosialisasi kode etik pencegahan kekerasan, intoleransi, dan narkoba belum menjangkau seluruh sivitas akademika secara formal.`;
    rtlPlan = `Pelaksanaan wajib modul pembekalan anti-kekerasan dan penandatanganan pakta integritas bagi seluruh pengurus ormawa.`;
    rtmAgenda = `Penguatan regulasi kampus aman, sehat, bebas kekerasan dan narkoba dengan alokasi ruang layanan konseling Satgas.`;
    rtlFromRtm = `Satgas bersama Pimpinan Fakultas membentuk duta mahasiswa anti-kekerasan dan patroli berkala fasilitas kampus.`;
  }

  return { rootCause, rtlPlan, rtmAgenda, rtlFromRtm };
}

export async function ensureSeedAndGetData() {
  let config = await prisma.siteConfig.findUnique({
    where: { id: "default" },
  });

  if (!config) {
    config = await prisma.siteConfig.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        universityName: "Universitas Nusantara",
        satgasName: "LPMI & Satgas SPMI",
        tagline: "Sistem Informasi Statistik Pelaporan, Tindak Lanjut Akademik, AMI & Akreditasi",
        description:
          "Portal transparansi dan pengendalian mutu Lembaga Penjaminan Mutu Internal (LPMI) yang mencakup pelaksanaan Audit Mutu Internal (AMI), bukti fisik akreditasi BAN-PT/LAM, siklus RTL & RTM, serta Satgas Kampus.",
        logoUrl: "",
        primaryColor: "#1e3a8a",
        secondaryColor: "#0284c7",
        accentColor: "#f59e0b",
        contactEmail: "lpmi@univ.ac.id",
        contactPhone: "+62 811-2233-4455",
        officeAddress: "Gedung Rektorat Lantai 2, Kantor LPMI & Sekretariat SPMI",
        footerText:
          "© 2026 LPMI Universitas Nusantara. Mendukung Akreditasi Unggul & Siklus PPEPP.",
        adminPassword: "admin123",
        showPublicFormButton: true,
        publicFormUrl: "https://wa.me/6281122334455",
        headOfLpmiName: "Prof. Dr. Ir. H. Ahmad Fauzi, M.Eng.",
        headOfLpmiNip: "19750412 200112 1 002",
        rectorName: "Prof. Dr.rer.nat. Budi Santoso, M.Sc.",
        rectorNip: "19680920 199403 1 001",
        masterDriveFolderUrl: "https://drive.google.com/drive/folders/1_example_lpmi_akreditasi_master",
      },
    });
  }

  // Seed default Report Categories
  const catCount = await prisma.reportCategory.count();
  if (catCount === 0) {
    const defaultCats = [
      {
        name: "Monev Perkuliahan, RPS & Kehadiran Dosen",
        scope: "AKADEMIK_SPMI",
        stdRef: "Standar Proses Pembelajaran (Kriteria 6)",
      },
      {
        name: "Pembimbingan Tugas Akhir / Skripsi / Tesis",
        scope: "AKADEMIK_SPMI",
        stdRef: "Standar Proses Pembelajaran (Kriteria 6)",
      },
      {
        name: "Evaluasi Kurikulum & Capaian Pembelajaran (CPL/OBE)",
        scope: "AKADEMIK_SPMI",
        stdRef: "Standar Isi Pembelajaran (Kriteria 6)",
      },
      {
        name: "Evaluasi Penilaian & Ketepatan Input Nilai Semester",
        scope: "AKADEMIK_SPMI",
        stdRef: "Standar Penilaian Pembelajaran (Kriteria 6)",
      },
      {
        name: "Temuan Audit Mutu Internal (AMI) Prodi/Unit",
        scope: "AMI_MONEV",
        stdRef: "Standar Pengelolaan Pembelajaran (Kriteria 2)",
      },
      {
        name: "Kinerja Penelitian, Publikasi & Pengabdian (LPPM)",
        scope: "AMI_MONEV",
        stdRef: "Standar Penelitian & PkM (Kriteria 7 & 8)",
      },
      {
        name: "Keluhan Layanan Akademik, Laboratorium & Sarpras",
        scope: "LAYANAN_SARPRAS",
        stdRef: "Standar Sarana & Prasarana (Kriteria 5)",
      },
      {
        name: "Kualifikasi, Beban Kerja (BKD) & Pengembangan Dosen/Tendik",
        scope: "LAYANAN_SARPRAS",
        stdRef: "Standar Dosen & Tenaga Kependidikan (Kriteria 4)",
      },
      {
        name: "Pelanggaran Integritas Akademik & Etik Dosen/Mahasiswa",
        scope: "ETIK_SATGAS",
        stdRef: "Standar Kemahasiswaan & Etik (Kriteria 3)",
      },
      {
        name: "Satgas PPKS (Kekerasan Seksual & Perundungan/Bullying)",
        scope: "ETIK_SATGAS",
        stdRef: "Standar Kemahasiswaan & Etik (Kriteria 3)",
      },
      {
        name: "Satgas Pencegahan Narkoba, Intoleransi & Disiplin Kampus",
        scope: "ETIK_SATGAS",
        stdRef: "Standar Kemahasiswaan & Etik (Kriteria 3)",
      },
    ];
    for (const c of defaultCats) {
      await prisma.reportCategory.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      });
    }
  }

  // Seed default Faculty & Units if empty
  const unitCount = await prisma.facultyUnit.count();
  if (unitCount === 0) {
    const defaultUnits = [
      { name: "Fakultas Teknik", code: "FT", type: "FAKULTAS", headName: "Dekan Fakultas Teknik", gdriveFolderUrl: "https://drive.google.com/drive/folders/ft_akreditasi_drive" },
      { name: "Fakultas Ekonomi & Bisnis", code: "FEB", type: "FAKULTAS", headName: "Dekan FEB", gdriveFolderUrl: "https://drive.google.com/drive/folders/feb_akreditasi_drive" },
      { name: "Fakultas Ilmu Komputer", code: "FILKOM", type: "FAKULTAS", headName: "Dekan FILKOM", gdriveFolderUrl: "https://drive.google.com/drive/folders/filkom_akreditasi_drive" },
      { name: "Fakultas Kedokteran", code: "FK", type: "FAKULTAS", headName: "Dekan Fakultas Kedokteran", gdriveFolderUrl: "https://drive.google.com/drive/folders/fk_akreditasi_drive" },
      { name: "Fakultas Hukum", code: "FH", type: "FAKULTAS", headName: "Dekan Fakultas Hukum", gdriveFolderUrl: "https://drive.google.com/drive/folders/fh_akreditasi_drive" },
      { name: "Fakultas Ilmu Sosial & Politik", code: "FISIP", type: "FAKULTAS", headName: "Dekan FISIP", gdriveFolderUrl: "https://drive.google.com/drive/folders/fisip_akreditasi_drive" },
      { name: "Fakultas MIPA", code: "FMIPA", type: "FAKULTAS", headName: "Dekan FMIPA", gdriveFolderUrl: "https://drive.google.com/drive/folders/fmipa_akreditasi_drive" },
      { name: "Fakultas Pertanian", code: "FP", type: "FAKULTAS", headName: "Dekan Fakultas Pertanian", gdriveFolderUrl: "https://drive.google.com/drive/folders/fp_akreditasi_drive" },
      { name: "Program Pascasarjana", code: "PPs", type: "PASCASARJANA", headName: "Direktur Pascasarjana", gdriveFolderUrl: "https://drive.google.com/drive/folders/pps_akreditasi_drive" },
      { name: "Lembaga Penelitian & Pengabdian kepada Masyarakat", code: "LPPM", type: "LEMBAGA", headName: "Ketua LPPM", gdriveFolderUrl: "https://drive.google.com/drive/folders/lppm_akreditasi_drive" },
      { name: "Biro Administrasi Akademik & Kemahasiswaan", code: "BAAK", type: "BIRO_UPT", headName: "Kepala BAAK", gdriveFolderUrl: "https://drive.google.com/drive/folders/baak_akreditasi_drive" },
      { name: "UPT Laboratorium Terpadu & Perpustakaan", code: "UPT-LAB", type: "BIRO_UPT", headName: "Kepala UPT", gdriveFolderUrl: "https://drive.google.com/drive/folders/upt_akreditasi_drive" },
    ];
    for (const u of defaultUnits) {
      await prisma.facultyUnit.upsert({
        where: { name: u.name },
        update: {},
        create: u,
      });
    }
  }

  // Master Kategori dan Master Fakultas tetap di-seed sebagai master referensi dasar.
  // Data transaksional Sesi AMI dan Laporan dibiarkan bersih / kosong (0 data) sesuai permintaan.

  const faculties = await prisma.facultyUnit.findMany({
    orderBy: { name: "asc" },
  });

  const reportCategories = await prisma.reportCategory.findMany({
    orderBy: { scope: "asc" },
  });

  const reports = await prisma.report.findMany({
    orderBy: { reportedDate: "desc" },
  });

  const auditSessions = await prisma.auditSession.findMany({
    include: {
      checklists: {
        orderBy: { id: "asc" },
      },
    },
    orderBy: { auditDate: "desc" },
  });

  return { config, faculties, reportCategories, reports, auditSessions };
}
