"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Palette,
  FileSpreadsheet,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle2,
  Lock,
  LogOut,
  Building,
  Building2,
  Sparkles,
  X,
  ClipboardCheck,
  Printer,
  Download,
  FileText,
  Tags,
  CheckSquare,
  Send,
  Award,
  FolderOpen,
  ExternalLink,
  Wand2,
} from "lucide-react";
import {
  SCOPE_LIST,
  SPMI_STANDARDS,
  FINDING_TYPES,
  REPORTER_ROLES,
  STATUS_LIST,
  URGENCY_LIST,
  UNIT_TYPES,
  RTL_STATUS_LIST,
  AUDIT_STATUS_LIST,
  COMPLIANCE_LIST,
  ACCREDITATION_CRITERIA,
  RTL_FROM_RTM_STATUS_LIST,
} from "@/lib/data";
import {
  verifyAdminAction,
  logoutAdminAction,
  updateBrandingAction,
  createFacultyUnitAction,
  updateFacultyUnitAction,
  deleteFacultyUnitAction,
  createReportCategoryAction,
  deleteReportCategoryAction,
  createAuditSessionAction,
  updateAuditSessionMetaAction,
  updateAuditChecklistItemAction,
  addCustomChecklistIndicatorAction,
  publishChecklistFindingToRtlAction,
  autoGenerateFindingAndRtlAction,
  deleteAuditSessionAction,
  createReportAction,
  updateReportAction,
  deleteReportAction,
} from "@/app/actions";

type SiteConfigType = {
  id: string;
  universityName: string;
  satgasName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  footerText: string;
  adminPassword: string;
  showPublicFormButton: boolean;
  publicFormUrl: string;
  headOfLpmiName: string;
  headOfLpmiNip: string;
  rectorName: string;
  rectorNip: string;
  masterDriveFolderUrl: string | null;
};

type FacultyUnitItem = {
  id: string;
  name: string;
  code: string | null;
  type: string;
  headName: string | null;
  gdriveFolderUrl: string | null;
};

type ReportCategoryItem = {
  id: string;
  name: string;
  scope: string;
  stdRef: string | null;
};

type ReportItem = {
  id: string;
  ticketNumber: string;
  title: string;
  scope: string;
  category: string;
  spmiStandard: string;
  accreditationCriterion: string | null;
  findingType: string;
  reporterRole: string;
  facultyOrUnit: string;
  incidentDate: string;
  reportedDate: string;
  resolvedDate: string | null;
  status: string;
  urgency: string;
  publicNote: string | null;
  evidenceDriveUrl: string | null;
  rootCause: string | null;
  rtlPlan: string | null;
  rtlPic: string | null;
  rtlTargetDate: string | null;
  rtlStatus: string;
  rtmAgenda: string | null;
  rtmDecisionDate: string | null;
  rtlFromRtm: string | null;
  rtlFromRtmPic: string | null;
  rtlFromRtmTarget: string | null;
  rtlFromRtmStatus: string | null;
};

type AuditChecklistItem = {
  id: string;
  spmiStandard: string;
  indicatorText: string;
  targetDesc: string;
  accreditationCriterion: string | null;
  score: number;
  compliance: string;
  auditorNote: string | null;
  evidenceDriveUrl: string | null;
  rootCause: string | null;
  rtlRecommendation: string | null;
  linkedReportId: string | null;
};

type AuditSessionItem = {
  id: string;
  auditCode: string;
  cyclePeriod: string;
  facultyOrUnit: string;
  auditeePic: string;
  leadAuditor: string;
  memberAuditor: string | null;
  auditDate: string;
  status: string;
  summaryNote: string | null;
  averageScore: number;
  gdriveReportUrl: string | null;
  checklists: AuditChecklistItem[];
};

const COLOR_PRESETS = [
  {
    name: "Biru Navy Kampus (Default)",
    primary: "#1e3a8a",
    secondary: "#0284c7",
    accent: "#f59e0b",
  },
  {
    name: "Hijau Zamrud Islami / Negeri",
    primary: "#065f46",
    secondary: "#0d9488",
    accent: "#eab308",
  },
  {
    name: "Merah Maroon Akademik",
    primary: "#7f1d1d",
    secondary: "#b91c1c",
    accent: "#f59e0b",
  },
  {
    name: "Ungu Royal Inovasi",
    primary: "#4c1d95",
    secondary: "#7c3aed",
    accent: "#06b6d4",
  },
  {
    name: "Kuning Emas & Gelap Elegan",
    primary: "#1e293b",
    secondary: "#ca8a04",
    accent: "#eab308",
  },
];

export default function AdminDashboardClient({
  config,
  faculties,
  reportCategories,
  reports,
  auditSessions,
  isAuthenticated,
}: {
  config: SiteConfigType;
  faculties: FacultyUnitItem[];
  reportCategories: ReportCategoryItem[];
  reports: ReportItem[];
  auditSessions: AuditSessionItem[];
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<
    "ami" | "reports" | "faculties" | "categories" | "rtl_rtm" | "branding"
  >("ami");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Login states
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Branding state for live preview
  const [branding, setBranding] = useState<SiteConfigType>(config);

  // AMI Audit Workspace states
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    auditSessions[0]?.id || ""
  );
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [isAddIndicatorModalOpen, setIsAddIndicatorModalOpen] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] =
    useState<AuditChecklistItem | null>(null);

  // Modal state for Create / Edit report
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportItem | null>(null);
  const [selectedScopeInModal, setSelectedScopeInModal] =
    useState<string>("AKADEMIK_SPMI");
  const [selectedUnitInModal, setSelectedUnitInModal] = useState<string>("");
  const [customUnitInput, setCustomUnitInput] = useState<string>("");

  // Modal state for Create / Edit Faculty/Unit
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<FacultyUnitItem | null>(null);

  // Modal state for Create Report Category
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // RTL, RTM & LHA AMI Document Generator state
  const [docType, setDocType] = useState<"RTL" | "RTM" | "LHA_AMI">("RTL");
  const [docFilterScope, setDocFilterScope] = useState<string>("ALL");
  const [docFilterYear, setDocFilterYear] = useState<string>("ALL");
  const [docFilterUnit, setDocFilterUnit] = useState<string>("ALL");
  const [docAuditSessionId, setDocAuditSessionId] = useState<string>(
    auditSessions[0]?.id || ""
  );
  const [docPeriodLabel, setDocPeriodLabel] = useState<string>(
    `Tahun Akademik ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  );
  const [docNumber, setDocNumber] = useState<string>(
    `004/SPMI-LPMI/RTM/X/${new Date().getFullYear()}`
  );

  const activeAuditSession = useMemo(() => {
    return (
      auditSessions.find((s) => s.id === selectedSessionId) ||
      auditSessions[0] ||
      null
    );
  }, [auditSessions, selectedSessionId]);

  const selectedDocAuditSession = useMemo(() => {
    return (
      auditSessions.find((s) => s.id === docAuditSessionId) ||
      auditSessions[0] ||
      null
    );
  }, [auditSessions, docAuditSessionId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    startTransition(async () => {
      const res = await verifyAdminAction(passwordInput);
      if (res.success) {
        router.refresh();
      } else {
        setLoginError(res.message || "Gagal masuk");
      }
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction();
      router.refresh();
    });
  };

  const handleSaveBranding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateBrandingAction(formData);
      showToast(
        "Pengaturan Custom Branding & Pejabat Penandatangan berhasil disimpan!"
      );
      router.refresh();
    });
  };

  // AMI Handlers
  const handleCreateAuditSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createAuditSessionAction(formData);
      showToast(
        "Sesi Audit Mutu Internal (AMI) baru beserta 9 instrumen standar berhasil dibuat!"
      );
      setIsNewAuditModalOpen(false);
      router.refresh();
    });
  };

  const handleUpdateAuditMeta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateAuditSessionMetaAction(formData);
      showToast("Status & informasi Sesi AMI berhasil diperbarui!");
      router.refresh();
    });
  };

  const handleSaveChecklistItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateAuditChecklistItemAction(formData);
      showToast("Penilaian kertas kerja standar SPMI berhasil disimpan!");
      setEditingChecklistItem(null);
      router.refresh();
    });
  };

  const handleAddCustomIndicator = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addCustomChecklistIndicatorAction(formData);
      showToast("Indikator kertas kerja baru berhasil ditambahkan!");
      setIsAddIndicatorModalOpen(false);
      router.refresh();
    });
  };

  const handlePublishFindingToRtl = (checklistId: string) => {
    startTransition(async () => {
      const res = await publishChecklistFindingToRtlAction(checklistId);
      if (res.success) {
        showToast(
          `Temuan AMI otomatis diterbitkan ke Matriks PTK/RTL dengan kode ${res.ticketNumber}!`
        );
        router.refresh();
      }
    });
  };

  const handleAutoGenerateFlow = (checklistId: string) => {
    startTransition(async () => {
      const res = await autoGenerateFindingAndRtlAction(checklistId);
      if (res.success) {
        showToast(
          res.message ||
            "Auto-generate alur mutu sukses: Akar masalah, RTL Unit, Keputusan RTM & RTL dari RTM telah dirumuskan secara sistematis!"
        );
        router.refresh();
      } else {
        showToast(res.message || "Gagal meng-generate alur mutu.");
      }
    });
  };

  const handleDeleteAuditSession = (id: string, code: string) => {
    if (!confirm(`Hapus sesi audit ${code} beserta seluruh kertas kerjanya?`))
      return;
    startTransition(async () => {
      await deleteAuditSessionAction(id);
      showToast(`Sesi Audit ${code} telah dihapus.`);
      router.refresh();
    });
  };

  const openReportModal = (rep: ReportItem | null) => {
    setEditingReport(rep);
    setSelectedScopeInModal(rep?.scope || "AKADEMIK_SPMI");
    if (rep) {
      const existsInMaster = faculties.some((f) => f.name === rep.facultyOrUnit);
      if (existsInMaster || faculties.length === 0) {
        setSelectedUnitInModal(rep.facultyOrUnit);
        setCustomUnitInput("");
      } else {
        setSelectedUnitInModal("__CUSTOM__");
        setCustomUnitInput(rep.facultyOrUnit);
      }
    } else {
      setSelectedUnitInModal(faculties[0]?.name || "__CUSTOM__");
      setCustomUnitInput("");
    }
    setIsModalOpen(true);
  };

  const handleSaveReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (selectedUnitInModal === "__CUSTOM__") {
      formData.set("facultyOrUnit", customUnitInput.trim() || "Umum");
    } else {
      formData.set("facultyOrUnit", selectedUnitInModal);
    }

    startTransition(async () => {
      if (editingReport) {
        await updateReportAction(formData);
        showToast(
          `Data temuan/laporan & RTL ${editingReport.ticketNumber} berhasil diperbarui!`
        );
      } else {
        await createReportAction(formData);
        showToast("Data temuan/laporan baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      setEditingReport(null);
      router.refresh();
    });
  };

  const handleDeleteReport = (id: string, ticket: string) => {
    if (!confirm(`Hapus data nomor ${ticket} dari database LPMI?`)) {
      return;
    }
    startTransition(async () => {
      await deleteReportAction(id);
      showToast(`Data ${ticket} telah dihapus.`);
      router.refresh();
    });
  };

  const handleSaveUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (editingUnit) {
        await updateFacultyUnitAction(formData);
        showToast(`Unit "${formData.get("name")}" berhasil diperbarui!`);
      } else {
        await createFacultyUnitAction(formData);
        showToast(`Fakultas/Prodi/Unit baru berhasil ditambahkan!`);
      }
      setIsUnitModalOpen(false);
      setEditingUnit(null);
      router.refresh();
    });
  };

  const handleDeleteUnit = (id: string, name: string) => {
    if (!confirm(`Hapus "${name}" dari daftar Master Fakultas/Unit Kerja?`)) {
      return;
    }
    startTransition(async () => {
      await deleteFacultyUnitAction(id);
      showToast(`Unit "${name}" telah dihapus.`);
      router.refresh();
    });
  };

  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createReportCategoryAction(formData);
      showToast("Kategori Tupoksi LPMI/SPMI baru berhasil ditambahkan!");
      setIsCatModalOpen(false);
      router.refresh();
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    startTransition(async () => {
      await deleteReportCategoryAction(id);
      showToast(`Kategori "${name}" telah dihapus.`);
      router.refresh();
    });
  };

  // Filtered reports for RTL / RTM Document Generator
  const rtlRtmReports = useMemo(() => {
    return reports.filter((r) => {
      const y = new Date(r.reportedDate).getFullYear().toString();
      if (docFilterScope !== "ALL" && r.scope !== docFilterScope) return false;
      if (docFilterYear !== "ALL" && y !== docFilterYear) return false;
      if (docFilterUnit !== "ALL" && r.facultyOrUnit !== docFilterUnit)
        return false;
      return true;
    });
  }, [reports, docFilterScope, docFilterYear, docFilterUnit]);

  // CSV Export for RTL & RTM
  const handleExportCsv = () => {
    const headers = [
      "No Tiket/Kode",
      "Tanggal",
      "Lingkup Tupoksi LPMI",
      "Standar SPMI / SN-Dikti",
      "Jenis Temuan",
      "Fakultas / Prodi / Unit",
      "Kategori",
      "Pokok Evaluasi / Temuan",
      "Status",
      "Analisis Akar Masalah",
      "Rencana Tindak Lanjut (RTL)",
      "Penanggung Jawab (PIC)",
      "Target Waktu RTL",
      "Status Verifikasi RTL",
      "Agenda / Keputusan RTM",
    ];
    const rows = rtlRtmReports.map((r) => [
      r.ticketNumber,
      new Date(r.reportedDate).toLocaleDateString("id-ID"),
      r.scope,
      `"${(r.spmiStandard || "-").replace(/"/g, '""')}"`,
      r.findingType,
      `"${(r.facultyOrUnit || "-").replace(/"/g, '""')}"`,
      `"${(r.category || "-").replace(/"/g, '""')}"`,
      `"${(r.title || "").replace(/"/g, '""')}"`,
      r.status,
      `"${(r.rootCause || "-").replace(/"/g, '""')}"`,
      `"${(r.rtlPlan || "-").replace(/"/g, '""')}"`,
      `"${(r.rtlPic || "-").replace(/"/g, '""')}"`,
      `"${(r.rtlTargetDate || "-").replace(/"/g, '""')}"`,
      r.rtlStatus,
      `"${(r.rtmAgenda || "-").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Matriks-SPMI-${docType}-${config.satgasName.replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Panel Administrasi LPMI & SPMI
              </span>
              <h1 className="text-lg font-extrabold text-slate-900">
                {config.satgasName} — {config.universityName}
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password Admin
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Password default instalasi awal:{" "}
                <code className="font-mono font-bold text-slate-600">
                  admin123
                </code>{" "}
                (Dapat diubah di menu Custom Branding)
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-xs transition hover:opacity-95 disabled:opacity-50"
              style={{ backgroundColor: config.primaryColor }}
            >
              {isPending ? "Memverifikasi..." : "Masuk ke Panel Admin LPMI"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard Statistik Publik</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextTicketSuggestion = `SPMI-${new Date().getFullYear()}-${String(
    reports.length + 101
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-medium print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sistem Pelaksanaan AMI, Kendali Mutu Akademik, Satgas & RTL/RTM
              </div>
              <div className="text-sm font-bold text-slate-900">
                {branding.satgasName} • {branding.universityName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Lihat Web Publik</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 print:p-0 print:max-w-none">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <div className="inline-flex flex-wrap p-1 rounded-xl bg-slate-200/80 gap-1">
            <button
              onClick={() => setActiveTab("ami")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === "ami"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Pelaksanaan Audit (AMI) ({auditSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === "reports"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Data Akademik, Temuan & Satgas ({reports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("faculties")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === "faculties"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Master Fakultas/Prodi ({faculties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === "categories"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>Master Kategori ({reportCategories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("rtl_rtm")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === "rtl_rtm"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Generator LHA AMI, RTL & RTM</span>
            </button>

            <button
              onClick={() => setActiveTab("branding")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === "branding"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Custom Branding</span>
            </button>
          </div>

          {activeTab === "ami" && (
            <button
              onClick={() => setIsNewAuditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition hover:opacity-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Sesi Audit (AMI) Baru</span>
            </button>
          )}

          {activeTab === "reports" && (
            <button
              onClick={() => openReportModal(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition hover:opacity-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Input Tindak Lanjut Akademik / AMI / Satgas</span>
            </button>
          )}

          {activeTab === "faculties" && (
            <button
              onClick={() => {
                setEditingUnit(null);
                setIsUnitModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition hover:opacity-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Fakultas / Prodi / Unit</span>
            </button>
          )}

          {activeTab === "categories" && (
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition hover:opacity-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori Tupoksi Baru</span>
            </button>
          )}
        </div>

        {/* =========================================================
            TAB 0: PELAKSANAAN AUDIT MUTU INTERNAL (AMI) & KERTAS KERJA
        ========================================================= */}
        {activeTab === "ami" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: List of Audit Sessions */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <h2 className="text-sm font-bold text-slate-900 mb-1">
                  Daftar Penugasan Sesi Audit (AMI)
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Pilih unit teraudit (Auditee) untuk membuka Kertas Kerja Penilaian Standar SPMI.
                </p>

                <div className="space-y-2.5">
                  {auditSessions.map((sess) => {
                    const active = activeAuditSession?.id === sess.id;
                    const stObj = AUDIT_STATUS_LIST.find(
                      (s) => s.value === sess.status
                    );
                    const ktsCount = sess.checklists.filter((c) =>
                      ["KTS_MINOR", "KTS_MAYOR", "OBSERVASI"].includes(
                        c.compliance
                      )
                    ).length;
                    return (
                      <div
                        key={sess.id}
                        onClick={() => setSelectedSessionId(sess.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:bg-white text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              active ? "text-sky-300" : "text-slate-500"
                            }`}
                          >
                            {sess.auditCode}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={
                              active
                                ? {
                                    backgroundColor: "rgba(255,255,255,0.18)",
                                    color: "#fff",
                                  }
                                : {
                                    backgroundColor: `${stObj?.color || "#0284c7"}18`,
                                    color: stObj?.color || "#0284c7",
                                  }
                            }
                          >
                            {stObj?.label || sess.status}
                          </span>
                        </div>
                        <div className="text-sm font-extrabold">
                          {sess.facultyOrUnit}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            active ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {sess.cyclePeriod} • Auditor: {sess.leadAuditor}
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                          <span className="font-bold">
                            Skor Rata-Rata: {sess.averageScore.toFixed(2)} / 4.00
                          </span>
                          <span
                            className={
                              active
                                ? "text-amber-300 font-semibold"
                                : "text-amber-600 font-semibold"
                            }
                          >
                            {ktsCount} Temuan
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Active Audit Session Worksheet (Kertas Kerja AMI) */}
            <div className="lg:col-span-8">
              {!activeAuditSession ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                  Belum ada sesi Audit Mutu Internal (AMI). Klik tombol &ldquo;Jadwalkan Sesi Audit (AMI) Baru&rdquo; di kanan atas.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  {/* Session Header & Metadata Form */}
                  <div className="p-6 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800">
                            {activeAuditSession.auditCode}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {activeAuditSession.cyclePeriod}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          Kertas Kerja Audit Mutu Internal (AMI) —{" "}
                          {activeAuditSession.facultyOrUnit}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDocType("LHA_AMI");
                            setDocAuditSessionId(activeAuditSession.id);
                            setActiveTab("rtl_rtm");
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                          style={{ backgroundColor: branding.secondaryColor }}
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak Berita Acara & LHA AMI</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteAuditSession(
                              activeAuditSession.id,
                              activeAuditSession.auditCode
                            )
                          }
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                          title="Hapus Sesi Audit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <form
                      key={activeAuditSession.id}
                      onSubmit={handleUpdateAuditMeta}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={activeAuditSession.id}
                      />
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Tahap Pelaksanaan AMI
                        </label>
                        <select
                          name="status"
                          defaultValue={activeAuditSession.status}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                        >
                          {AUDIT_STATUS_LIST.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Ketua Auditor AMI
                        </label>
                        <input
                          type="text"
                          name="leadAuditor"
                          defaultValue={activeAuditSession.leadAuditor}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Anggota Auditor
                        </label>
                        <input
                          type="text"
                          name="memberAuditor"
                          defaultValue={activeAuditSession.memberAuditor || ""}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Pimpinan Unit Teraudit (Auditee)
                        </label>
                        <input
                          type="text"
                          name="auditeePic"
                          defaultValue={activeAuditSession.auditeePic}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Kesimpulan / Catatan Eksekutif Auditor (Ditampilkan di Berita Acara LHA)
                        </label>
                        <input
                          type="text"
                          name="summaryNote"
                          defaultValue={activeAuditSession.summaryNote || ""}
                          placeholder="Masukkan kesimpulan umum hasil evaluasi dokumen & visitasi lapangan..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Link Google Drive Laporan / Berita Acara AMI
                        </label>
                        <input
                          type="url"
                          name="gdriveReportUrl"
                          defaultValue={activeAuditSession.gdriveReportUrl || ""}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={isPending}
                          className="w-full py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                        >
                          Simpan Info Sesi
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Checklist Toolbar */}
                  <div className="px-6 py-3.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>
                          Indeks Skor Ketercapaian:{" "}
                          <strong className="text-emerald-700 text-sm">
                            {activeAuditSession.averageScore.toFixed(2)} / 4.00
                          </strong>
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {activeAuditSession.checklists.length} Butir Indikator Standar SPMI
                      </span>
                      {activeAuditSession.gdriveReportUrl && (
                        <a
                          href={activeAuditSession.gdriveReportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Google Drive Sesi AMI</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddIndicatorModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Butir Indikator Audit</span>
                    </button>
                  </div>

                  {/* Checklist Items List */}
                  <div className="divide-y divide-slate-100">
                    {activeAuditSession.checklists.map((chk, idx) => {
                      const compObj = COMPLIANCE_LIST.find(
                        (c) => c.value === chk.compliance
                      );
                      const isNonCompliant = [
                        "KTS_MINOR",
                        "KTS_MAYOR",
                        "OBSERVASI",
                      ].includes(chk.compliance);

                      return (
                        <div
                          key={chk.id}
                          className="p-5 hover:bg-slate-50/70 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                            <div className="space-y-1 max-w-xl">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-extrabold uppercase tracking-wide text-sky-800">
                                  {chk.spmiStandard}
                                </span>
                                {chk.accreditationCriterion && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    {chk.accreditationCriterion}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-semibold text-slate-900">
                                {chk.indicatorText}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Target Standar: {chk.targetDesc}
                              </div>
                              {chk.evidenceDriveUrl && (
                                <div className="pt-1">
                                  <a
                                    href={chk.evidenceDriveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline"
                                  >
                                    <FolderOpen className="w-3.5 h-3.5" />
                                    <span>Bukti Fisik (Google Drive)</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col sm:items-end gap-2 shrink-0">
                              <span
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{
                                  backgroundColor: `${compObj?.color || "#0284c7"}18`,
                                  color: compObj?.color || "#0284c7",
                                }}
                              >
                                {compObj?.label || chk.compliance}
                              </span>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingChecklistItem(chk)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Nilai / Catat Bukti</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleAutoGenerateFlow(chk.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                                  title="Otomatis rumuskan Akar Masalah, RTL Unit, Keputusan RTM & RTL dari RTM (Non-AI)"
                                >
                                  <Wand2 className="w-3 h-3" />
                                  <span>✨ Auto-Generate Alur Mutu</span>
                                </button>

                                {isNonCompliant && !chk.linkedReportId && (
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() =>
                                      handlePublishFindingToRtl(chk.id)
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs transition"
                                    title="Otomatis buat Temuan AMI ke Daftar Laporan & Matriks RTL/RTM"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Terbitkan ke Matriks RTL/RTM</span>
                                  </button>
                                )}

                                {chk.linkedReportId && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Sudah Masuk Matriks RTL</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {(chk.auditorNote ||
                            chk.rootCause ||
                            chk.rtlRecommendation) && (
                            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                              {chk.auditorNote && (
                                <div>
                                  <strong className="text-slate-700">
                                    Bukti / Catatan Auditor:{" "}
                                  </strong>
                                  <span className="text-slate-600">
                                    {chk.auditorNote}
                                  </span>
                                </div>
                              )}
                              {chk.rootCause && (
                                <div>
                                  <strong className="text-amber-800">
                                    Akar Masalah (KTS/OB):{" "}
                                  </strong>
                                  <span className="text-slate-600">
                                    {chk.rootCause}
                                  </span>
                                </div>
                              )}
                              {chk.rtlRecommendation && (
                                <div>
                                  <strong className="text-sky-800">
                                    Rekomendasi PTK / RTL:{" "}
                                  </strong>
                                  <span className="text-slate-600">
                                    {chk.rtlRecommendation}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 1: MANAGE REPORTS (AKADEMIK, AMI, LAYANAN, SATGAS)
        ========================================================= */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Database Terpadu Tindak Lanjut Akademik, Temuan AMI & Pelaporan Satgas
                </h2>
                <p className="text-xs text-slate-500">
                  Mencakup seluruh tupoksi LPMI & SPMI: Monev perkuliahan, kurikulum OBE, pembimbingan TA, temuan PTK Audit Mutu Internal (AMI), hingga Satgas Etik/PPKS/Narkoba.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Kode & Lingkup</th>
                    <th className="py-3.5 px-4">Pokok Evaluasi Akademik / Temuan & RTL</th>
                    <th className="py-3.5 px-4">Standar SPMI & Kategori</th>
                    <th className="py-3.5 px-4">Fakultas / Unit</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Status RTL</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {reports.map((r) => {
                    const st = STATUS_LIST.find((s) => s.value === r.status);
                    const rtlSt = RTL_STATUS_LIST.find(
                      (s) => s.value === r.rtlStatus
                    );
                    const sc = SCOPE_LIST.find((s) => s.value === r.scope);
                    const ft = FINDING_TYPES.find(
                      (f) => f.value === r.findingType
                    );
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 whitespace-nowrap align-top">
                          <div className="font-mono text-xs font-bold text-slate-800">
                            {r.ticketNumber}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(r.reportedDate).toLocaleDateString("id-ID")}
                          </div>
                          {ft && (
                            <span
                              className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
                              style={{
                                backgroundColor: `${ft.color}15`,
                                color: ft.color,
                              }}
                            >
                              {ft.label}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm align-top">
                          <div className="font-semibold text-slate-900 line-clamp-2">
                            {r.title}
                          </div>
                          {r.accreditationCriterion && (
                            <div className="mt-1">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {r.accreditationCriterion}
                              </span>
                            </div>
                          )}
                          {r.evidenceDriveUrl && (
                            <div className="mt-1">
                              <a
                                href={r.evidenceDriveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline"
                              >
                                <FolderOpen className="w-3 h-3" />
                                <span>Bukti Fisik (GDrive)</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}
                          {r.rtlPlan ? (
                            <div className="text-[11px] text-sky-700 line-clamp-1 mt-1 font-medium">
                              RTL: {r.rtlPlan}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic mt-1">
                              Belum ada matriks RTL
                            </div>
                          )}
                          {r.rtlFromRtm && (
                            <div className="text-[10px] text-purple-700 line-clamp-1 mt-0.5 font-medium">
                              RTL dari RTM: {r.rtlFromRtm}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs align-top max-w-xs">
                          {sc && (
                            <div
                              className="text-[10px] font-bold uppercase"
                              style={{ color: sc.color }}
                            >
                              {sc.shortLabel}
                            </div>
                          )}
                          <div className="font-bold text-slate-800">
                            {r.spmiStandard}
                          </div>
                          <div className="text-slate-500">{r.category}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-700 font-medium whitespace-nowrap align-top">
                          {r.facultyOrUnit}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap align-top">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${st?.color || "#64748b"}18`,
                              color: st?.color || "#64748b",
                            }}
                          >
                            {st?.label || r.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap align-top">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
                            style={{
                              backgroundColor: `${rtlSt?.color || "#94a3b8"}18`,
                              color: rtlSt?.color || "#94a3b8",
                            }}
                          >
                            {rtlSt?.label || r.rtlStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap align-top">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openReportModal(r)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                              title="Edit Data & RTL/RTM"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReport(r.id, r.ticketNumber)
                              }
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: MASTER FAKULTAS, PRODI & UNIT KERJA
        ========================================================= */}
        {activeTab === "faculties" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Master Data Fakultas, Program Studi, Lembaga & Unit Kerja
              </h2>
              <p className="text-xs text-slate-500">
                Sesuaikan daftar nama Fakultas, Prodi, LPPM, atau Biro sesuai struktur universitas Anda.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-5">Kode</th>
                    <th className="py-3.5 px-5">Nama Fakultas / Prodi / Unit Kerja</th>
                    <th className="py-3.5 px-5">Jenis Unit</th>
                    <th className="py-3.5 px-5">Pejabat / PIC Default</th>
                    <th className="py-3.5 px-5">Drive Folder</th>
                    <th className="py-3.5 px-5">Jumlah Data</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {faculties.map((f) => {
                    const count = reports.filter(
                      (r) => r.facultyOrUnit === f.name
                    ).length;
                    const typeLabel =
                      UNIT_TYPES.find((t) => t.value === f.type)?.label ||
                      f.type;
                    return (
                      <tr key={f.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-700">
                          {f.code || "-"}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          {f.name}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-600">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
                            {typeLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-600">
                          {f.headName || "-"}
                        </td>
                        <td className="py-3.5 px-5 text-xs">
                          {f.gdriveFolderUrl ? (
                            <a
                              href={f.gdriveFolderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-semibold"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              <span>Folder GDrive</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Belum diatur</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-xs font-bold text-slate-800">
                          {count} Data
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingUnit(f);
                                setIsUnitModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUnit(f.id, f.name)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: MASTER KATEGORI & LINGKUP TUPOKSI LPMI / SPMI
        ========================================================= */}
        {activeTab === "categories" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Master Kategori Evaluasi Akademik, Temuan AMI & Pelaporan Satgas
              </h2>
              <p className="text-xs text-slate-500">
                Anda bebas menambahkan kategori kegiatan akademik, instrumen monev SPMI, maupun kategori aduan Satgas sesuai kebutuhan LPMI kampus.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-5">Lingkup Pilar Tupoksi LPMI</th>
                    <th className="py-3.5 px-5">Nama Kategori Evaluasi / Laporan</th>
                    <th className="py-3.5 px-5">Standar SPMI / SN-Dikti Acuan</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {reportCategories.map((cat) => {
                    const sc = SCOPE_LIST.find((s) => s.value === cat.scope);
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-5 text-xs">
                          <span
                            className="px-2.5 py-1 rounded-md font-bold"
                            style={{
                              backgroundColor: `${sc?.color || "#1e3a8a"}15`,
                              color: sc?.color || "#1e3a8a",
                            }}
                          >
                            {sc?.label || cat.scope}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          {cat.name}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-600">
                          {cat.stdRef || "-"}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() =>
                              handleDeleteCategory(cat.id, cat.name)
                            }
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: GENERATOR LAPORAN LHA AMI, RTL & RTM (LPMI / SPMI)
        ========================================================= */}
        {activeTab === "rtl_rtm" && (
          <div className="space-y-6">
            {/* Control Panel (Hidden when printing) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 print:hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText
                      className="w-5 h-5"
                      style={{ color: branding.primaryColor }}
                    />
                    <span>
                      Generator Dokumen Resmi LHA AMI, Matriks RTL & Berita Acara RTM
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cetak Laporan Hasil Audit (LHA) AMI, Matriks Rencana Tindak Lanjut (RTL), maupun Berita Acara Rapat Tinjauan Manajemen (RTM).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {docType !== "LHA_AMI" && (
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Matriks CSV / Excel</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-95"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / Simpan PDF Resmi</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Jenis Dokumen Resmi SPMI
                  </label>
                  <select
                    value={docType}
                    onChange={(e) =>
                      setDocType(e.target.value as "RTL" | "RTM" | "LHA_AMI")
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                  >
                    <option value="LHA_AMI">
                      Berita Acara & Laporan Hasil Audit (LHA) AMI
                    </option>
                    <option value="RTL">
                      Formulir Matriks Rencana Tindak Lanjut (RTL)
                    </option>
                    <option value="RTM">
                      Berita Acara & Risalah Rapat Tinjauan Manajemen (RTM)
                    </option>
                  </select>
                </div>

                {docType === "LHA_AMI" ? (
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Pilih Sesi Audit Mutu Internal (AMI) yang Dicetak
                    </label>
                    <select
                      value={docAuditSessionId}
                      onChange={(e) => setDocAuditSessionId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      {auditSessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          [{s.auditCode}] {s.facultyOrUnit} — {s.cyclePeriod} (Skor:{" "}
                          {s.averageScore.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Lingkup Tupoksi LPMI
                      </label>
                      <select
                        value={docFilterScope}
                        onChange={(e) => setDocFilterScope(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                      >
                        <option value="ALL">Seluruh Tupoksi LPMI & SPMI</option>
                        {SCOPE_LIST.map((sc) => (
                          <option key={sc.value} value={sc.value}>
                            {sc.shortLabel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Fakultas / Unit Kerja
                      </label>
                      <select
                        value={docFilterUnit}
                        onChange={(e) => setDocFilterUnit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                      >
                        <option value="ALL">Tingkat Universitas (Semua Unit)</option>
                        {faculties.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Nomor Dokumen Surat/BA
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Periode Siklus Mutu
                  </label>
                  <input
                    type="text"
                    value={docPeriodLabel}
                    onChange={(e) => setDocPeriodLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* OFFICIAL PRINTABLE DOCUMENT SHEET */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 print:border-0 print:shadow-none print:p-0 text-slate-900">
              {/* KOP SURAT UNIVERSITAS & LPMI */}
              <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {branding.logoUrl ? (
                    <img
                      src={branding.logoUrl}
                      alt={branding.universityName}
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                  )}
                  <div>
                    <div className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-900">
                      {branding.universityName}
                    </div>
                    <div
                      className="text-sm sm:text-base font-bold uppercase"
                      style={{ color: branding.primaryColor }}
                    >
                      LEMBAGA PENJAMINAN MUTU INTERNAL ({branding.satgasName})
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {branding.officeAddress} • Telp: {branding.contactPhone} • Email:{" "}
                      {branding.contactEmail}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right font-mono text-[11px] border border-slate-300 p-2.5 rounded-lg bg-slate-50">
                  <div className="font-bold text-slate-800">
                    DOKUMEN MUTU SPMI (PPEPP)
                  </div>
                  <div>Kode: FORM-SPMI-{docType}</div>
                  <div>No: {docNumber}</div>
                </div>
              </div>

              {/* =======================================================
                  VARIANT A: BERITA ACARA & LAPORAN HASIL AUDIT (LHA) AMI
              ======================================================= */}
              {docType === "LHA_AMI" && selectedDocAuditSession ? (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-base sm:text-lg font-extrabold uppercase underline decoration-2 underline-offset-4">
                      BERITA ACARA & LAPORAN HASIL AUDIT MUTU INTERNAL (LHA-AMI)
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                      {selectedDocAuditSession.cyclePeriod} — Kode Audit:{" "}
                      {selectedDocAuditSession.auditCode}
                    </p>
                  </div>

                  {/* Metadata Tabel Sesi Audit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-300 bg-slate-50/70 text-xs mb-6">
                    <div className="space-y-1.5">
                      <div>
                        <span className="font-bold text-slate-600 inline-block w-36">
                          Unit Teraudit (Auditee):
                        </span>{" "}
                        <strong className="text-slate-900">
                          {selectedDocAuditSession.facultyOrUnit}
                        </strong>
                      </div>
                      <div>
                        <span className="font-bold text-slate-600 inline-block w-36">
                          Pimpinan Auditee:
                        </span>{" "}
                        <span>{selectedDocAuditSession.auditeePic}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-600 inline-block w-36">
                          Tanggal Audit:
                        </span>{" "}
                        <span>
                          {new Date(
                            selectedDocAuditSession.auditDate
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <span className="font-bold text-slate-600 inline-block w-36">
                          Ketua Auditor AMI:
                        </span>{" "}
                        <strong className="text-slate-900">
                          {selectedDocAuditSession.leadAuditor}
                        </strong>
                      </div>
                      <div>
                        <span className="font-bold text-slate-600 inline-block w-36">
                          Anggota Auditor:
                        </span>{" "}
                        <span>
                          {selectedDocAuditSession.memberAuditor || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-600 inline-block w-36">
                          Skor Ketercapaian:
                        </span>{" "}
                        <strong className="text-emerald-700">
                          {selectedDocAuditSession.averageScore.toFixed(2)} /
                          4.00 (
                          {Math.round(
                            (selectedDocAuditSession.averageScore / 4) * 100
                          )}
                          %)
                        </strong>
                      </div>
                    </div>
                  </div>

                  {selectedDocAuditSession.summaryNote && (
                    <div className="mb-6 text-xs sm:text-sm leading-relaxed text-justify">
                      <strong>Kesimpulan Umum Tim Auditor: </strong>
                      {selectedDocAuditSession.summaryNote}
                    </div>
                  )}

                  {/* Tabel Kertas Kerja Hasil Penilaian Standar SPMI */}
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold">
                          <th className="border border-slate-400 py-2.5 px-3 w-8 text-center">
                            No
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Standar SPMI & Kriteria BAN-PT/LAM
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Indikator & Target Standar
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3 text-center">
                            Skor
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Status Ketercapaian
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Bukti Audit, Ketidaksesuaian & Rekomendasi PTK
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocAuditSession.checklists.map((chk, idx) => {
                          const compObj = COMPLIANCE_LIST.find(
                            (c) => c.value === chk.compliance
                          );
                          return (
                            <tr key={chk.id} className="align-top">
                              <td className="border border-slate-400 py-2.5 px-3 text-center font-semibold">
                                {idx + 1}
                              </td>
                              <td className="border border-slate-400 py-2.5 px-3">
                                <div className="font-bold text-slate-900">
                                  {chk.spmiStandard}
                                </div>
                                {chk.accreditationCriterion && (
                                  <div className="text-[10px] font-semibold text-amber-800 mt-1">
                                    {chk.accreditationCriterion}
                                  </div>
                                )}
                              </td>
                              <td className="border border-slate-400 py-2.5 px-3">
                                <div className="font-semibold text-slate-900">
                                  {chk.indicatorText}
                                </div>
                                <div className="text-[11px] text-slate-600 mt-0.5">
                                  Target: {chk.targetDesc}
                                </div>
                                {chk.evidenceDriveUrl && (
                                  <div className="text-[10px] text-sky-700 mt-1 font-mono break-all">
                                    Drive: {chk.evidenceDriveUrl}
                                  </div>
                                )}
                              </td>
                              <td className="border border-slate-400 py-2.5 px-3 text-center font-extrabold text-sm">
                                {chk.score}
                              </td>
                              <td className="border border-slate-400 py-2.5 px-3 font-bold">
                                {compObj?.label || chk.compliance}
                              </td>
                              <td className="border border-slate-400 py-2.5 px-3 space-y-1">
                                <div>{chk.auditorNote || "-"}</div>
                                {chk.rootCause && (
                                  <div>
                                    <strong>Akar Masalah:</strong>{" "}
                                    {chk.rootCause}
                                  </div>
                                )}
                                {chk.rtlRecommendation && (
                                  <div>
                                    <strong>Rekomendasi PTK/RTL:</strong>{" "}
                                    {chk.rtlRecommendation}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Tanda Tangan Berita Acara AMI (Auditee, Ketua Auditor, Kepala LPMI) */}
                  <div className="grid grid-cols-3 gap-6 pt-6 text-xs sm:text-sm break-inside-avoid text-center">
                    <div>
                      <div className="mb-1">Menyetujui Pihak Teraudit,</div>
                      <div className="font-bold mb-16">
                        Pimpinan {selectedDocAuditSession.facultyOrUnit}
                      </div>
                      <div className="font-bold underline">
                        {selectedDocAuditSession.auditeePic}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1">Tim Pemeriksa,</div>
                      <div className="font-bold mb-16">Ketua Auditor AMI</div>
                      <div className="font-bold underline">
                        {selectedDocAuditSession.leadAuditor}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1">Mengetahui & Mengesahkan,</div>
                      <div className="font-bold mb-16">
                        Kepala {branding.satgasName}
                      </div>
                      <div className="font-bold underline">
                        {branding.headOfLpmiName}
                      </div>
                      <div className="text-xs text-slate-600">
                        NIP/NIDN. {branding.headOfLpmiNip}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* =======================================================
                   VARIANT B: MATRIKS RTL & BERITA ACARA RTM
                ======================================================= */
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-base sm:text-lg font-extrabold uppercase underline decoration-2 underline-offset-4">
                      {docType === "RTL"
                        ? "DOKUMEN MATRIKS RENCANA TINDAK LANJUT (RTL) KEGIATAN AKADEMIK, AMI & SATGAS"
                        : "BERITA ACARA & RISALAH RAPAT TINJAUAN MANAJEMEN (RTM) SPMI"}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                      {docPeriodLabel} — Unit:{" "}
                      {docFilterUnit === "ALL"
                        ? "Seluruh Fakultas, Prodi & Unit Kerja"
                        : docFilterUnit}{" "}
                      (
                      {docFilterScope === "ALL"
                        ? "Semua Lingkup Tupoksi LPMI"
                        : SCOPE_LIST.find((s) => s.value === docFilterScope)
                            ?.label}
                      )
                    </p>
                  </div>

                  <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold">
                          <th className="border border-slate-400 py-2.5 px-3 w-8 text-center">
                            No
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Kode, Unit & Klasifikasi
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Standar SPMI & Pokok Evaluasi / Temuan
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Analisis Akar Masalah (Evaluasi LPMI / AMI)
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            {docType === "RTL"
                              ? "Rencana Tindak Lanjut (Koreksi & Peningkatan Mutu)"
                              : "Keputusan RTM & Rencana Tindak Lanjut"}
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3">
                            Penanggung Jawab (PIC) & Target
                          </th>
                          <th className="border border-slate-400 py-2.5 px-3 text-center">
                            Status RTL
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rtlRtmReports.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="border border-slate-400 py-8 text-center text-slate-500"
                            >
                              Tidak ada data untuk filter periode/unit/lingkup ini.
                            </td>
                          </tr>
                        ) : (
                          rtlRtmReports.map((item, idx) => {
                            const rtlSt = RTL_STATUS_LIST.find(
                              (s) => s.value === item.rtlStatus
                            );
                            const ft = FINDING_TYPES.find(
                              (f) => f.value === item.findingType
                            );
                            return (
                              <tr key={item.id} className="align-top">
                                <td className="border border-slate-400 py-2.5 px-3 text-center font-semibold">
                                  {idx + 1}
                                </td>
                                <td className="border border-slate-400 py-2.5 px-3">
                                  <div className="font-mono font-bold text-slate-900">
                                    {item.ticketNumber}
                                  </div>
                                  <div className="font-semibold text-slate-800 mt-0.5">
                                    {item.facultyOrUnit}
                                  </div>
                                  <div className="text-[10px] font-semibold text-slate-600 mt-0.5">
                                    {ft?.label || item.findingType}
                                  </div>
                                  {item.accreditationCriterion && (
                                    <div className="text-[10px] font-bold text-amber-800 mt-1">
                                      {item.accreditationCriterion}
                                    </div>
                                  )}
                                  {item.evidenceDriveUrl && (
                                    <div className="text-[10px] text-sky-700 mt-0.5 font-mono break-all">
                                      Drive: {item.evidenceDriveUrl}
                                    </div>
                                  )}
                                </td>
                                <td className="border border-slate-400 py-2.5 px-3">
                                  <div className="font-bold text-slate-900">
                                    {item.spmiStandard}
                                  </div>
                                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                                    Kategori: {item.category}
                                  </div>
                                  <div>{item.title}</div>
                                </td>
                                <td className="border border-slate-400 py-2.5 px-3">
                                  {item.rootCause || "-"}
                                </td>
                                <td className="border border-slate-400 py-2.5 px-3">
                                  {docType === "RTM" && item.rtmAgenda && (
                                    <div className="mb-2 pb-2 border-b border-slate-200">
                                      <span className="font-bold text-slate-800">
                                        1. Keputusan RTM:{" "}
                                      </span>
                                      <span>{item.rtmAgenda}</span>
                                    </div>
                                  )}
                                  <div className="mb-2 pb-2 border-b border-slate-200">
                                    <span className="font-bold text-slate-800">
                                      2. Program RTL Unit:{" "}
                                    </span>
                                    <span>{item.rtlPlan || "-"}</span>
                                  </div>
                                  {docType === "RTM" && item.rtlFromRtm && (
                                    <div className="bg-purple-50/60 p-1.5 rounded border border-purple-200">
                                      <span className="font-bold text-purple-900">
                                        3. RTL Lanjutan RTM (PPEPP):{" "}
                                      </span>
                                      <span className="text-purple-950 font-medium">{item.rtlFromRtm}</span>
                                      <div className="text-[10px] text-purple-700 mt-1">
                                        PIC: {item.rtlFromRtmPic || "-"} | Target: {item.rtlFromRtmTarget || "-"} | Status: {item.rtlFromRtmStatus || "BERJALAN"}
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="border border-slate-400 py-2.5 px-3">
                                  <div className="font-semibold text-slate-900">
                                    {item.rtlPic ||
                                      `Pimpinan ${item.facultyOrUnit}`}
                                  </div>
                                  <div className="text-[11px] text-slate-600 mt-1">
                                    Target:{" "}
                                    {item.rtlTargetDate || "Semester Berjalan"}
                                  </div>
                                </td>
                                <td className="border border-slate-400 py-2.5 px-3 text-center font-semibold">
                                  {rtlSt?.label || item.rtlStatus}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 text-xs sm:text-sm break-inside-avoid">
                    <div className="text-center">
                      <div className="mb-1">Mengetahui & Mengesahkan,</div>
                      <div className="font-bold mb-16">
                        Rektor / Pimpinan {branding.universityName}
                      </div>
                      <div className="font-bold underline">
                        {branding.rectorName ||
                          "................................................"}
                      </div>
                      <div className="text-xs text-slate-600">
                        NIP/NIDN.{" "}
                        {branding.rectorNip || "..........................."}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-1">
                        {new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="font-bold mb-16">
                        Kepala / Ketua {branding.satgasName}
                      </div>
                      <div className="font-bold underline">
                        {branding.headOfLpmiName ||
                          "................................................"}
                      </div>
                      <div className="text-xs text-slate-600">
                        NIP/NIDN.{" "}
                        {branding.headOfLpmiNip || "..........................."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: CUSTOM BRANDING UNIVERSITAS & PEJABAT LPMI
        ========================================================= */}
        {activeTab === "branding" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center gap-2.5 mb-1">
                <Building className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Kustomisasi Identitas Universitas, Pejabat LPMI & Tema (Full White-Label)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Ubah nama universitas, nama lembaga/satgas, logo, palet warna, hingga nama pejabat penandatangan dokumen LHA AMI, RTL & RTM.
              </p>

              <form onSubmit={handleSaveBranding} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Nama Universitas / Perguruan Tinggi
                    </label>
                    <input
                      type="text"
                      name="universityName"
                      required
                      value={branding.universityName}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          universityName: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Nama Lembaga / Unit (Misal: LPMI & Satgas SPMI)
                    </label>
                    <input
                      type="text"
                      name="satgasName"
                      required
                      value={branding.satgasName}
                      onChange={(e) =>
                        setBranding({ ...branding, satgasName: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    URL Logo Universitas (Opsional)
                  </label>
                  <input
                    type="text"
                    name="logoUrl"
                    placeholder="https://example.ac.id/logo.png"
                    value={branding.logoUrl}
                    onChange={(e) =>
                      setBranding({ ...branding, logoUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Judul Utama (Tagline Hero Banner)
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    required
                    value={branding.tagline}
                    onChange={(e) =>
                      setBranding({ ...branding, tagline: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Deskripsi Singkat Portal
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={branding.description}
                    onChange={(e) =>
                      setBranding({ ...branding, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                    Pejabat Penandatangan Dokumen Resmi LHA AMI, RTL & RTM
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Kepala / Ketua LPMI
                      </label>
                      <input
                        type="text"
                        name="headOfLpmiName"
                        value={branding.headOfLpmiName}
                        onChange={(e) =>
                          setBranding({
                            ...branding,
                            headOfLpmiName: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        NIP / NIDN Ketua LPMI
                      </label>
                      <input
                        type="text"
                        name="headOfLpmiNip"
                        value={branding.headOfLpmiNip}
                        onChange={(e) =>
                          setBranding({
                            ...branding,
                            headOfLpmiNip: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Nama Rektor / Pimpinan Perguruan Tinggi
                      </label>
                      <input
                        type="text"
                        name="rectorName"
                        value={branding.rectorName}
                        onChange={(e) =>
                          setBranding({
                            ...branding,
                            rectorName: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        NIP / NIDN Rektor
                      </label>
                      <input
                        type="text"
                        name="rectorNip"
                        value={branding.rectorNip}
                        onChange={(e) =>
                          setBranding({
                            ...branding,
                            rectorNip: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Tema Warna */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Palet Warna Identitas Kampus
                    </label>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Klik preset di bawah
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          setBranding({
                            ...branding,
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            accentColor: preset.accent,
                          })
                        }
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Warna Primer
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          name="primaryColor"
                          value={branding.primaryColor}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              primaryColor: e.target.value,
                            })
                          }
                          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.primaryColor}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              primaryColor: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Warna Sekunder
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          name="secondaryColor"
                          value={branding.secondaryColor}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              secondaryColor: e.target.value,
                            })
                          }
                          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.secondaryColor}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              secondaryColor: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Warna Aksen
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          name="accentColor"
                          value={branding.accentColor}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              accentColor: e.target.value,
                            })
                          }
                          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={branding.accentColor}
                          onChange={(e) =>
                            setBranding({
                              ...branding,
                              accentColor: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kontak & Tautan */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Email Resmi LPMI
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={branding.contactEmail}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Nomor Hotline / WhatsApp LPMI
                    </label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={branding.contactPhone}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Alamat Kantor LPMI / Sekretariat SPMI
                    </label>
                    <input
                      type="text"
                      name="officeAddress"
                      value={branding.officeAddress}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          officeAddress: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Tampilkan Tombol Kanal Lapor/Monev?
                    </label>
                    <select
                      name="showPublicFormButton"
                      value={branding.showPublicFormButton ? "true" : "false"}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          showPublicFormButton: e.target.value === "true",
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option value="true">Ya, Tampilkan</option>
                      <option value="false">Sembunyikan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Tautan Kanal Lapor/Monev
                    </label>
                    <input
                      type="text"
                      name="publicFormUrl"
                      value={branding.publicFormUrl}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          publicFormUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Teks Hak Cipta Footer
                    </label>
                    <input
                      type="text"
                      name="footerText"
                      value={branding.footerText}
                      onChange={(e) =>
                        setBranding({ ...branding, footerText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Password Panel Admin
                    </label>
                    <input
                      type="text"
                      name="adminPassword"
                      required
                      value={branding.adminPassword}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          adminPassword: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Tautan Master Google Drive Folder Akreditasi & SPMI Universitas
                    </label>
                    <input
                      type="url"
                      name="masterDriveFolderUrl"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={branding.masterDriveFolderUrl || ""}
                      onChange={(e) =>
                        setBranding({
                          ...branding,
                          masterDriveFolderUrl: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Folder repository utama yang memuat arsip dokumen akreditasi 9 Kriteria BAN-PT/LAM, standar SPMI, dan bukti fisik universitas.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-xs transition hover:opacity-95 disabled:opacity-50"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {isPending
                        ? "Menyimpan Perubahan..."
                        : "Simpan Pengaturan Branding"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sticky top-24">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Pratinjau Langsung (Live Preview)
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <div className="bg-white p-3 flex items-center gap-2.5 border-b border-slate-100">
                    {branding.logoUrl ? (
                      <img
                        src={branding.logoUrl}
                        alt="Logo"
                        className="w-8 h-8 object-contain rounded-md"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div
                        className="text-[10px] font-bold uppercase truncate"
                        style={{ color: branding.primaryColor }}
                      >
                        {branding.satgasName}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {branding.universityName}
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})`,
                    }}
                  >
                    <div className="text-xs font-extrabold leading-snug mb-1.5">
                      {branding.tagline}
                    </div>
                    <p className="text-[11px] text-white/85 line-clamp-3">
                      {branding.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          MODAL 1: JADWALKAN SESI AUDIT MUTU INTERNAL (AMI) BARU
      ========================================================= */}
      {isNewAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Jadwalkan Sesi Audit Mutu Internal (AMI) Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Otomatis menyiapkan 9 instrumen standar SPMI / SN-Dikti untuk dinilai oleh Auditor.
                </p>
              </div>
              <button
                onClick={() => setIsNewAuditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAuditSession} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Kode Penugasan AMI
                  </label>
                  <input
                    type="text"
                    name="auditCode"
                    required
                    defaultValue={`AMI-${new Date().getFullYear()}-0${
                      auditSessions.length + 1
                    }`}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Periode Siklus AMI
                  </label>
                  <input
                    type="text"
                    name="cyclePeriod"
                    required
                    defaultValue={`Siklus AMI ${new Date().getFullYear()}/${
                      new Date().getFullYear() + 1
                    } Ganjil`}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Unit Teraudit (Auditee — Fakultas / Prodi / Unit)
                </label>
                <select
                  name="facultyOrUnit"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {faculties.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.code ? `[${f.code}] ${f.name}` : f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nama Pimpinan Unit Auditee (Dekan / Kaprodi / Kepala Unit)
                </label>
                <input
                  type="text"
                  name="auditeePic"
                  required
                  placeholder="Contoh: Dr. Ir. Hendra Wijaya, M.T. (Dekan)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Ketua Auditor AMI
                  </label>
                  <input
                    type="text"
                    name="leadAuditor"
                    required
                    placeholder="Nama Ketua Auditor..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Anggota Auditor
                  </label>
                  <input
                    type="text"
                    name="memberAuditor"
                    placeholder="Nama Anggota Auditor..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Tanggal Pelaksanaan Audit
                  </label>
                  <input
                    type="date"
                    name="auditDate"
                    required
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Status Awal
                  </label>
                  <select
                    name="status"
                    defaultValue="DESK_EVALUATION"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {AUDIT_STATUS_LIST.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Link Google Drive Berita Acara / Laporan AMI (Opsional)
                </label>
                <input
                  type="url"
                  name="gdriveReportUrl"
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAuditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {isPending ? "Menyiapkan Kertas Kerja..." : "Buat Sesi Audit AMI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: NILAI BUTIR CHECKLIST STANDAR SPMI (AUDITOR WORKSHEET)
      ========================================================= */}
      {editingChecklistItem && activeAuditSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-sky-700">
                  {editingChecklistItem.spmiStandard}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Penilaian Kertas Kerja Audit — {activeAuditSession.facultyOrUnit}
                </h3>
              </div>
              <button
                onClick={() => setEditingChecklistItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs mb-4">
              <div className="font-bold text-slate-800">
                Indikator: {editingChecklistItem.indicatorText}
              </div>
              <div className="text-slate-500 mt-1">
                Target Standar: {editingChecklistItem.targetDesc}
              </div>
            </div>

            <form onSubmit={handleSaveChecklistItem} className="space-y-4">
              <input
                type="hidden"
                name="checklistId"
                value={editingChecklistItem.id}
              />
              <input
                type="hidden"
                name="auditSessionId"
                value={activeAuditSession.id}
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Hasil Asesmen Ketercapaian Standar SPMI (Skor 1 - 4)
                </label>
                <select
                  name="compliance"
                  defaultValue={editingChecklistItem.compliance}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white"
                >
                  {COMPLIANCE_LIST.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Kriteria Akreditasi BAN-PT / LAM
                  </label>
                  <select
                    name="accreditationCriterion"
                    defaultValue={
                      editingChecklistItem.accreditationCriterion ||
                      "Kriteria 6: Pendidikan"
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {ACCREDITATION_CRITERIA.map((crit) => (
                      <option key={crit} value={crit}>
                        {crit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Link Google Drive Bukti Fisik / Dokumen
                  </label>
                  <input
                    type="url"
                    name="evidenceDriveUrl"
                    defaultValue={editingChecklistItem.evidenceDriveUrl || ""}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Catatan Bukti Objektif / Uraian Temuan Auditor (PLOR)
                </label>
                <textarea
                  name="auditorNote"
                  rows={2}
                  defaultValue={editingChecklistItem.auditorNote || ""}
                  placeholder="Tuliskan fakta bukti dokumen/lapangan yang ditemukan auditor..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Analisis Akar Masalah (Diisi jika Observasi / KTS Minor / KTS Mayor)
                </label>
                <textarea
                  name="rootCause"
                  rows={2}
                  defaultValue={editingChecklistItem.rootCause || ""}
                  placeholder="Mengapa target standar belum tercapai?"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Rekomendasi Tindak Lanjut / Permintaan Tindakan Koreksi (PTK / RTL)
                </label>
                <textarea
                  name="rtlRecommendation"
                  rows={2}
                  defaultValue={editingChecklistItem.rtlRecommendation || ""}
                  placeholder="Rekomendasi perbaikan kepada pimpinan unit Auditee..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingChecklistItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {isPending ? "Menyimpan..." : "Simpan Penilaian Standar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: TAMBAH BUTIR INDIKATOR CHECKLIST AUDIT BARU
      ========================================================= */}
      {isAddIndicatorModalOpen && activeAuditSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Butir Indikator Standar SPMI
              </h3>
              <button
                onClick={() => setIsAddIndicatorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomIndicator} className="space-y-4">
              <input
                type="hidden"
                name="auditSessionId"
                value={activeAuditSession.id}
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Standar SPMI / SN-Dikti
                </label>
                <select
                  name="spmiStandard"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {SPMI_STANDARDS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Pernyataan Indikator Kinerja yang Diperiksa
                </label>
                <textarea
                  name="indicatorText"
                  required
                  rows={2}
                  placeholder="Contoh: Ketersediaan pedoman konversi SKS kegiatan MBKM..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Target Capaian Standar
                </label>
                <input
                  type="text"
                  name="targetDesc"
                  required
                  defaultValue="100% Terpenuhi sesuai Standar SPMI"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Kriteria Akreditasi BAN-PT / LAM
                  </label>
                  <select
                    name="accreditationCriterion"
                    defaultValue="Kriteria 6: Pendidikan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {ACCREDITATION_CRITERIA.map((crit) => (
                      <option key={crit} value={crit}>
                        {crit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Link Drive Bukti Fisik (Opsional)
                  </label>
                  <input
                    type="url"
                    name="evidenceDriveUrl"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddIndicatorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Tambah Indikator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL INPUT / EDIT TINDAK LANJUT AKADEMIK, AMI & SATGAS
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingReport
                    ? `Edit Data Evaluasi Akademik / AMI / Satgas (${editingReport.ticketNumber})`
                    : "Input Data Tindak Lanjut Akademik, Temuan AMI atau Laporan Satgas"}
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih lingkup tupoksi LPMI, Standar SPMI/SN-Dikti, serta isi Rencana Tindak Lanjut (RTL) dan Agenda RTM.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingReport(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-4">
              {editingReport && (
                <input type="hidden" name="id" value={editingReport.id} />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Lingkup Pilar Tupoksi LPMI & SPMI
                  </label>
                  <select
                    name="scope"
                    value={selectedScopeInModal}
                    onChange={(e) => setSelectedScopeInModal(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                  >
                    {SCOPE_LIST.map((sc) => (
                      <option key={sc.value} value={sc.value}>
                        {sc.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Acuan Standar SPMI / SN-Dikti
                  </label>
                  <select
                    name="spmiStandard"
                    defaultValue={
                      editingReport?.spmiStandard || SPMI_STANDARDS[2]
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {SPMI_STANDARDS.map((std) => (
                      <option key={std} value={std}>
                        {std}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kode Registrasi / AMI
                  </label>
                  <input
                    type="text"
                    name="ticketNumber"
                    required
                    defaultValue={
                      editingReport?.ticketNumber || nextTicketSuggestion
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Jenis Evaluasi / Temuan
                  </label>
                  <select
                    name="findingType"
                    defaultValue={
                      editingReport?.findingType || "EVALUASI_RUTIN"
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {FINDING_TYPES.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kategori Kegiatan / Laporan
                  </label>
                  <select
                    name="category"
                    defaultValue={
                      editingReport?.category || reportCategories[0]?.name
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {reportCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Pokok Evaluasi Akademik / Deskripsi Temuan AMI / Laporan Satgas
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Monev Ketercapaian 16 Pertemuan Perkuliahan & Kesesuaian RPS Semester Ganjil"
                  defaultValue={editingReport?.title || ""}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Fakultas / Program Studi / Unit Kerja
                  </label>
                  <select
                    value={selectedUnitInModal}
                    onChange={(e) => setSelectedUnitInModal(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {faculties.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.code ? `[${f.code}] ${f.name}` : f.name}
                      </option>
                    ))}
                    <option value="__CUSTOM__">
                      + Ketik Nama Unit Lainnya Secara Manual...
                    </option>
                  </select>
                  {selectedUnitInModal === "__CUSTOM__" && (
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Fakultas / Prodi / Unit..."
                      value={customUnitInput}
                      onChange={(e) => setCustomUnitInput(e.target.value)}
                      className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Sumber Evaluasi / Unsur Pelapor
                  </label>
                  <select
                    name="reporterRole"
                    defaultValue={
                      editingReport?.reporterRole || REPORTER_ROLES[0]
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {REPORTER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tanggal Monev / Kejadian
                  </label>
                  <input
                    type="date"
                    name="incidentDate"
                    required
                    defaultValue={
                      editingReport
                        ? editingReport.incidentDate.slice(0, 10)
                        : new Date().toISOString().slice(0, 10)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tanggal Registrasi LPMI
                  </label>
                  <input
                    type="date"
                    name="reportedDate"
                    required
                    defaultValue={
                      editingReport
                        ? editingReport.reportedDate.slice(0, 10)
                        : new Date().toISOString().slice(0, 10)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tanggal Selesai (Closed)
                  </label>
                  <input
                    type="date"
                    name="resolvedDate"
                    defaultValue={
                      editingReport?.resolvedDate
                        ? editingReport.resolvedDate.slice(0, 10)
                        : ""
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Status Penanganan / Tindak Lanjut
                  </label>
                  <select
                    name="status"
                    defaultValue={editingReport?.status || "DITERIMA"}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {STATUS_LIST.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tingkat Prioritas / Urgensi
                  </label>
                  <select
                    name="urgency"
                    defaultValue={editingReport?.urgency || "SEDANG"}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {URGENCY_LIST.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kriteria Akreditasi BAN-PT / LAM
                  </label>
                  <select
                    name="accreditationCriterion"
                    defaultValue={
                      editingReport?.accreditationCriterion ||
                      "Kriteria 6: Pendidikan"
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {ACCREDITATION_CRITERIA.map((crit) => (
                      <option key={crit} value={crit}>
                        {crit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Link Google Drive Bukti Fisik / Dokumen
                  </label>
                  <input
                    type="url"
                    name="evidenceDriveUrl"
                    placeholder="https://drive.google.com/..."
                    defaultValue={editingReport?.evidenceDriveUrl || ""}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Ringkasan Capaian / Hasil Penanganan (Ditampilkan di Tabel Publik)
                </label>
                <textarea
                  name="publicNote"
                  rows={2}
                  placeholder="Contoh: 94% mata kuliah telah memenuhi 16 pertemuan dan RPS OBE; sisanya telah menjadwalkan kuliah pengganti."
                  defaultValue={editingReport?.publicNote || ""}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-4 mt-4">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wider">
                  <ClipboardCheck className="w-4 h-4" />
                  <span>
                    Siklus PPEPP LPMI: Rencana Tindak Lanjut (RTL) & Rapat Tinjauan Manajemen (RTM)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Analisis Akar Permasalahan / Evaluasi Diri / Temuan AMI
                  </label>
                  <textarea
                    name="rootCause"
                    rows={2}
                    placeholder="Contoh: Rasio distribusi mahasiswa bimbingan tugas akhir per dosen belum merata."
                    defaultValue={editingReport?.rootCause || ""}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rencana Tindak Lanjut / RTL (Tindakan Korektif & Peningkatan Standar Mutu)
                  </label>
                  <textarea
                    name="rtlPlan"
                    rows={2}
                    placeholder="Contoh: Pembatasan kuota bimbingan maksimal 10 mahasiswa/dosen dan penerapan logbook bimbingan di SIAKAD."
                    defaultValue={editingReport?.rtlPlan || ""}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Penanggung Jawab (PIC Unit)
                    </label>
                    <input
                      type="text"
                      name="rtlPic"
                      placeholder="Misal: Dekan / Kaprodi / Ketua LPPM"
                      defaultValue={editingReport?.rtlPic || ""}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Waktu Penyelesaian RTL
                    </label>
                    <input
                      type="text"
                      name="rtlTargetDate"
                      placeholder="Misal: Semester Genap 2026/2027"
                      defaultValue={editingReport?.rtlTargetDate || ""}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status Verifikasi RTL
                    </label>
                    <select
                      name="rtlStatus"
                      defaultValue={editingReport?.rtlStatus || "BELUM_DIBUAT"}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    >
                      {RTL_STATUS_LIST.map((st) => (
                        <option key={st.value} value={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Agenda / Rekomendasi Keputusan dalam Rapat Tinjauan Manajemen (RTM)
                    </label>
                    <input
                      type="text"
                      name="rtmAgenda"
                      placeholder="Contoh: Penetapan Kebijakan Percepatan Masa Studi Tepat Waktu (KTW) & Standar Pembimbingan TA"
                      defaultValue={editingReport?.rtmAgenda || ""}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Keputusan RTM
                    </label>
                    <input
                      type="date"
                      name="rtmDecisionDate"
                      defaultValue={
                        editingReport?.rtmDecisionDate
                          ? editingReport.rtmDecisionDate.slice(0, 10)
                          : ""
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* RTL Lanjutan dari RTM (PPEPP - Peningkatan Mutu Berkelanjutan) */}
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5" />
                    <span>RTL Lanjutan dari Hasil RTM (Tindak Lanjut PPEPP Peningkatan Mutu)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-950 mb-1">
                      Rencana Tindak Lanjut Pasca RTM (Kebijakan / Pedoman / Regulasi Baru)
                    </label>
                    <textarea
                      name="rtlFromRtm"
                      rows={2}
                      placeholder="Contoh: Pembentukan Taskforce OBE, revisi pedoman akademik di tingkat rektorat, dan penyesuaian anggaran sarpras."
                      defaultValue={editingReport?.rtlFromRtm || ""}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                        PIC RTL dari RTM
                      </label>
                      <input
                        type="text"
                        name="rtlFromRtmPic"
                        placeholder="Contoh: Wakil Rektor I & Dekan"
                        defaultValue={editingReport?.rtlFromRtmPic || ""}
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                        Target Selesai RTL dari RTM
                      </label>
                      <input
                        type="text"
                        name="rtlFromRtmTarget"
                        placeholder="Contoh: RTM Semester Genap"
                        defaultValue={editingReport?.rtlFromRtmTarget || ""}
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-purple-900 mb-1">
                        Status RTL dari RTM
                      </label>
                      <select
                        name="rtlFromRtmStatus"
                        defaultValue={editingReport?.rtlFromRtmStatus || "BERJALAN"}
                        className="w-full px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs"
                      >
                        {RTL_FROM_RTM_STATUS_LIST.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReport(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {isPending
                    ? "Menyimpan..."
                    : editingReport
                    ? "Simpan Perubahan Data & RTL"
                    : "Simpan Data & RTL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL TAMBAH / EDIT MASTER FAKULTAS & UNIT KERJA
      ========================================================= */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingUnit
                  ? "Edit Fakultas / Prodi / Unit Kerja"
                  : "Tambah Fakultas / Prodi / Unit Kerja Baru"}
              </h3>
              <button
                onClick={() => {
                  setIsUnitModalOpen(false);
                  setEditingUnit(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-4">
              {editingUnit && (
                <>
                  <input type="hidden" name="id" value={editingUnit.id} />
                  <input
                    type="hidden"
                    name="oldName"
                    value={editingUnit.name}
                  />
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Fakultas / Program Studi / Unit Kerja
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Prodi S1 Teknik Informatika / Fakultas Teknik"
                  defaultValue={editingUnit?.name || ""}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kode / Singkatan
                  </label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Contoh: TI / FT"
                    defaultValue={editingUnit?.code || ""}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Jenis Unit
                  </label>
                  <select
                    name="type"
                    defaultValue={editingUnit?.type || "FAKULTAS"}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {UNIT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Jabatan Pimpinan Unit (PIC Default RTL/RTM)
                </label>
                <input
                  type="text"
                  name="headName"
                  placeholder="Contoh: Kaprodi Teknik Informatika / Dekan FT"
                  defaultValue={editingUnit?.headName || ""}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Link Google Drive Folder Unit / Prodi / Dokumen Akreditasi
                </label>
                <input
                  type="url"
                  name="gdriveFolderUrl"
                  placeholder="https://drive.google.com/drive/folders/..."
                  defaultValue={editingUnit?.gdriveFolderUrl || ""}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Folder drive tempat prodi/unit ini mengunggah bukti fisik, RPS OBE, dan LED akreditasi.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUnitModalOpen(false);
                    setEditingUnit(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {isPending ? "Menyimpan..." : "Simpan Unit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL TAMBAH KATEGORI TUPOKSI LPMI / SPMI BARU
      ========================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Kategori Evaluasi Akademik / SPMI / Satgas
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Lingkup Pilar Tupoksi LPMI
                </label>
                <select
                  name="scope"
                  defaultValue="AKADEMIK_SPMI"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {SCOPE_LIST.map((sc) => (
                    <option key={sc.value} value={sc.value}>
                      {sc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Kategori Kegiatan / Evaluasi / Aduan
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Monev Praktikum & Kesiapan Modul"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Standar SPMI / SN-Dikti Acuan
                </label>
                <select
                  name="stdRef"
                  defaultValue={SPMI_STANDARDS[2]}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  {SPMI_STANDARDS.map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {isPending ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
