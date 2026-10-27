"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  ArrowUpRight,
  Settings,
  AlertCircle,
  ClipboardCheck,
  BookOpen,
  Layers,
  Award,
  CheckSquare,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import {
  SCOPE_LIST,
  STATUS_LIST,
  RTL_STATUS_LIST,
  FINDING_TYPES,
  SPMI_STANDARDS,
  AUDIT_STATUS_LIST,
  ACCREDITATION_CRITERIA,
} from "@/lib/data";

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
  showPublicFormButton: boolean;
  publicFormUrl: string;
  masterDriveFolderUrl?: string | null;
};

type FacultyUnitItem = {
  id: string;
  name: string;
  code: string | null;
  type: string;
  headName: string | null;
  gdriveFolderUrl?: string | null;
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
  accreditationCriterion: string;
  findingType: string;
  reporterRole: string;
  facultyOrUnit: string;
  incidentDate: string;
  reportedDate: string;
  resolvedDate: string | null;
  status: string;
  urgency: string;
  publicNote: string | null;
  evidenceDriveUrl?: string | null;
  rootCause: string | null;
  rtlPlan: string | null;
  rtlPic: string | null;
  rtlTargetDate: string | null;
  rtlStatus: string;
  rtmAgenda: string | null;
  rtlFromRtm?: string | null;
  rtlFromRtmPic?: string | null;
  rtlFromRtmTarget?: string | null;
  rtlFromRtmStatus?: string | null;
};

type AuditChecklistItem = {
  id: string;
  spmiStandard: string;
  indicatorText: string;
  targetDesc: string;
  accreditationCriterion: string;
  score: number;
  compliance: string;
  auditorNote: string | null;
  rootCause: string | null;
  rtlRecommendation: string | null;
  evidenceDriveUrl?: string | null;
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
  gdriveReportUrl?: string | null;
  checklists: AuditChecklistItem[];
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function PublicDashboardClient({
  config,
  faculties,
  reportCategories,
  reports,
  auditSessions,
}: {
  config: SiteConfigType;
  faculties: FacultyUnitItem[];
  reportCategories: ReportCategoryItem[];
  reports: ReportItem[];
  auditSessions: AuditSessionItem[];
}) {
  const years = useMemo(() => {
    const set = new Set<number>();
    reports.forEach((r) => {
      const y = new Date(r.reportedDate).getFullYear();
      if (!isNaN(y)) set.add(y);
    });
    if (set.size === 0) set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [reports]);

  const [selectedScope, setSelectedScope] = useState<string>("ALL");
  const [selectedCriterion, setSelectedCriterion] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAuditUnit, setSelectedAuditUnit] = useState<string>("ALL");

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const reportYear = new Date(r.reportedDate).getFullYear().toString();
      if (selectedScope !== "ALL" && r.scope !== selectedScope) return false;
      if (
        selectedCriterion !== "ALL" &&
        r.accreditationCriterion !== selectedCriterion
      )
        return false;
      if (selectedYear !== "ALL" && reportYear !== selectedYear) return false;
      if (selectedUnit !== "ALL" && r.facultyOrUnit !== selectedUnit)
        return false;
      if (selectedCategory !== "ALL" && r.category !== selectedCategory)
        return false;
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTicket = r.ticketNumber.toLowerCase().includes(q);
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchUnit = r.facultyOrUnit.toLowerCase().includes(q);
        const matchCategory = r.category.toLowerCase().includes(q);
        const matchStandard = (r.spmiStandard || "").toLowerCase().includes(q);
        const matchCriterion = (r.accreditationCriterion || "")
          .toLowerCase()
          .includes(q);
        if (
          !matchTicket &&
          !matchTitle &&
          !matchUnit &&
          !matchCategory &&
          !matchStandard &&
          !matchCriterion
        )
          return false;
      }
      return true;
    });
  }, [
    reports,
    selectedScope,
    selectedCriterion,
    selectedYear,
    selectedUnit,
    selectedCategory,
    selectedStatus,
    searchQuery,
  ]);

  const isFiltered = useMemo(() => {
    return (
      selectedScope !== "ALL" ||
      selectedCriterion !== "ALL" ||
      selectedYear !== "ALL" ||
      selectedUnit !== "ALL" ||
      selectedCategory !== "ALL" ||
      selectedStatus !== "ALL" ||
      searchQuery.trim() !== ""
    );
  }, [
    selectedScope,
    selectedCriterion,
    selectedYear,
    selectedUnit,
    selectedCategory,
    selectedStatus,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedScope("ALL");
    setSelectedCriterion("ALL");
    setSelectedYear("ALL");
    setSelectedUnit("ALL");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSearchQuery("");
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = filteredReports.length;
    const selesai = filteredReports.filter(
      (r) => r.status === "SELESAI"
    ).length;
    const ditolak = filteredReports.filter(
      (r) => r.status === "DITOLAK"
    ).length;
    const diproses = filteredReports.filter((r) =>
      ["DITERIMA", "VERIFIKASI", "INVESTIGASI", "PENDAMPINGAN"].includes(
        r.status
      )
    ).length;

    const rtlActive = filteredReports.filter(
      (r) => r.rtlStatus && r.rtlStatus !== "BELUM_DIBUAT"
    ).length;

    const completionRate =
      total > 0 ? Math.round(((selesai + ditolak) / total) * 100) : 0;

    const withEvidenceCount = filteredReports.filter(
      (r) => r.evidenceDriveUrl && r.evidenceDriveUrl.trim() !== ""
    ).length;

    return {
      total,
      selesai,
      diproses,
      ditolak,
      completionRate,
      rtlActive,
      withEvidenceCount,
    };
  }, [filteredReports]);

  // AMI Achievement & Radar Stats calculation
  const amiAchievement = useMemo(() => {
    const targetSessions =
      selectedAuditUnit === "ALL"
        ? auditSessions
        : auditSessions.filter((s) => s.facultyOrUnit === selectedAuditUnit);

    const stdMap: Record<string, { sum: number; count: number }> = {};
    SPMI_STANDARDS.slice(0, 9).forEach((s) => {
      stdMap[s] = { sum: 0, count: 0 };
    });

    let totalChecklists = 0;
    let totalScoreSum = 0;
    let melampauiCount = 0;
    let mencapaiCount = 0;
    let ktsCount = 0;

    targetSessions.forEach((sess) => {
      sess.checklists.forEach((chk) => {
        totalChecklists++;
        totalScoreSum += chk.score;
        if (chk.compliance === "MELAMPAUI") melampauiCount++;
        else if (chk.compliance === "MENCAPAI") mencapaiCount++;
        else ktsCount++;

        if (!stdMap[chk.spmiStandard]) {
          stdMap[chk.spmiStandard] = { sum: 0, count: 0 };
        }
        stdMap[chk.spmiStandard].sum += chk.score;
        stdMap[chk.spmiStandard].count += 1;
      });
    });

    const overallAvg =
      totalChecklists > 0
        ? Number((totalScoreSum / totalChecklists).toFixed(2))
        : 0;
    const overallPercent = Math.round((overallAvg / 4) * 100);

    const byStandard = Object.entries(stdMap)
      .map(([stdName, val]) => {
        const avg =
          val.count > 0 ? Number((val.sum / val.count).toFixed(2)) : 0;
        const percent = Math.round((avg / 4) * 100);
        return { stdName, avg, percent, count: val.count };
      })
      .filter((item) => item.count > 0);

    return {
      overallAvg,
      overallPercent,
      melampauiCount,
      mencapaiCount,
      ktsCount,
      byStandard,
      sessionCount: targetSessions.length,
    };
  }, [auditSessions, selectedAuditUnit]);

  // 9 Kriteria Akreditasi Stats
  const criteriaStats = useMemo(() => {
    return ACCREDITATION_CRITERIA.map((crit) => {
      const count = reports.filter((r) => r.accreditationCriterion === crit).length;
      return { crit, count };
    });
  }, [reports]);

  // Scope distribution
  const scopeStats = useMemo(() => {
    return SCOPE_LIST.map((sc) => {
      const count = reports.filter((r) => r.scope === sc.value).length;
      const percent =
        reports.length > 0 ? Math.round((count / reports.length) * 100) : 0;
      return { ...sc, count, percent };
    });
  }, [reports]);

  // Monthly distribution
  const monthlyStats = useMemo(() => {
    const counts = Array(12).fill(0);
    const resolvedCounts = Array(12).fill(0);
    filteredReports.forEach((r) => {
      const m = new Date(r.reportedDate).getMonth();
      if (m >= 0 && m < 12) {
        counts[m]++;
        if (r.status === "SELESAI") {
          resolvedCounts[m]++;
        }
      }
    });
    const maxCount = Math.max(...counts, 1);
    return MONTH_NAMES.map((name, idx) => ({
      month: name,
      total: counts[idx],
      resolved: resolvedCounts[idx],
      heightPercent: Math.round((counts[idx] / maxCount) * 100),
    }));
  }, [filteredReports]);

  // SPMI Standard distribution
  const standardStats = useMemo(() => {
    const map: Record<string, number> = {};
    SPMI_STANDARDS.forEach((s) => (map[s] = 0));
    filteredReports.forEach((r) => {
      const std = r.spmiStandard || "Standar Proses Pembelajaran";
      map[std] = (map[std] || 0) + 1;
    });
    const total = Math.max(filteredReports.length, 1);
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredReports]);

  // Faculty/Unit distribution
  const unitStats = useMemo(() => {
    const map: Record<string, number> = {};
    faculties.forEach((f) => {
      map[f.name] = 0;
    });
    filteredReports.forEach((r) => {
      const u = r.facultyOrUnit || "Umum";
      map[u] = (map[u] || 0) + 1;
    });
    const total = Math.max(filteredReports.length, 1);
    return Object.entries(map)
      .map(([unit, count]) => ({
        unit,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .filter((item) => item.count > 0 || faculties.length <= 8)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredReports, faculties]);

  // Status breakdown
  const statusStats = useMemo(() => {
    return STATUS_LIST.map((st) => {
      const count = filteredReports.filter((r) => r.status === st.value).length;
      const percent =
        filteredReports.length > 0
          ? Math.round((count / filteredReports.length) * 100)
          : 0;
      return { ...st, count, percent };
    });
  }, [filteredReports]);

  const getStatusBadge = (statusVal: string) => {
    const found = STATUS_LIST.find((s) => s.value === statusVal);
    if (!found) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {statusVal}
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${found.color}18`,
          color: found.color,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: found.color }}
        />
        {found.label}
      </span>
    );
  };

  const getFindingBadge = (findingVal: string) => {
    const found = FINDING_TYPES.find((f) => f.value === findingVal);
    if (!found) return null;
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
        style={{
          backgroundColor: `${found.color}15`,
          color: found.color,
        }}
      >
        {found.label}
      </span>
    );
  };

  const getRtlBadge = (rtlStatusVal: string) => {
    const found = RTL_STATUS_LIST.find((s) => s.value === rtlStatusVal);
    if (!found || rtlStatusVal === "BELUM_DIBUAT") return null;
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
        style={{
          backgroundColor: `${found.color}15`,
          color: found.color,
        }}
      >
        <ClipboardCheck className="w-3 h-3" />
        {found.label}
      </span>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900"
      style={
        {
          "--brand-primary": config.primaryColor || "#1e3a8a",
          "--brand-secondary": config.secondaryColor || "#0284c7",
          "--brand-accent": config.accentColor || "#f59e0b",
        } as React.CSSProperties
      }
    >
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.universityName}
                className="w-12 h-12 object-contain rounded-lg border border-slate-100 p-1 bg-white"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                }}
              >
                <ShieldCheck className="w-7 h-7" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${config.primaryColor}15`,
                    color: config.primaryColor,
                  }}
                >
                  {config.satgasName}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  SPMI, AMI, Akreditasi (9 Kriteria) & RTL-RTM
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
                {config.universityName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {config.masterDriveFolderUrl && (
              <a
                href={config.masterDriveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition"
              >
                <FolderOpen className="w-4 h-4 text-amber-700" />
                <span>Drive Bukti Akreditasi</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            {config.showPublicFormButton && config.publicFormUrl && (
              <a
                href={config.publicFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-xs transition hover:opacity-95"
                style={{ backgroundColor: config.primaryColor }}
              >
                <span>Lapor / Monev</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Panel Admin LPMI</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner with Custom Branding */}
      <section
        className="relative overflow-hidden text-white py-12 sm:py-16"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold tracking-wide uppercase mb-4 border border-white/20">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Penjaminan Mutu & Persiapan Akreditasi BAN-PT / LAM</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              {config.tagline}
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
              {config.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-2 bg-black/15 px-3.5 py-2 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Skor Ketercapaian AMI: {amiAchievement.overallAvg} / 4.00</span>
              </div>
              <div className="flex items-center gap-2 bg-black/15 px-3.5 py-2 rounded-lg border border-white/10">
                <ClipboardCheck className="w-4 h-4 text-sky-200 shrink-0" />
                <span>Siklus Mutu Lengkap (RTL, RTM & RTL dari RTM)</span>
              </div>
              <div className="flex items-center gap-2 bg-black/15 px-3.5 py-2 rounded-lg border border-white/10">
                <FolderOpen className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Penyimpanan Bukti Fisik Google Drive Siap Akreditasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16 relative z-20">
        {/* Banner Edukatif Saat Data Masih Kosong (Fresh Start) */}
        {reports.length === 0 && auditSessions.length === 0 && (
          <div className="bg-gradient-to-r from-sky-900 to-indigo-900 text-white rounded-2xl p-6 mb-6 shadow-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-6 h-6 text-sky-300" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Sistem Informasi Penjaminan Mutu & Akreditasi Siap Digunakan
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-2xl leading-relaxed">
                  Database masih kosong dan belum ada publikasi temuan AMI atau monev akademik. Tim Auditor dan Administrator LPMI dapat mulai menyusun siklus audit, mengunggah bukti Google Drive, atau menambahkan laporan melalui Panel Admin.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-sky-50 shadow-sm shrink-0 transition"
            >
              <Settings className="w-4 h-4 text-sky-700" />
              <span>Buka Panel Admin</span>
            </Link>
          </div>
        )}
        {/* Tupoksi LPMI Scope Selector Pills */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Layers className="w-4 h-4" style={{ color: config.primaryColor }} />
              <span>Filter Pilar Tupoksi LPMI & SPMI:</span>
            </div>
            {selectedScope !== "ALL" && (
              <button
                onClick={() => setSelectedScope("ALL")}
                className="text-xs font-semibold text-sky-600 hover:underline"
              >
                Tampilkan Semua Lingkup ({reports.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <button
              onClick={() => setSelectedScope("ALL")}
              className={`p-3 rounded-xl border text-left transition ${
                selectedScope === "ALL"
                  ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="text-xs font-bold">Seluruh Tupoksi LPMI</div>
              <div
                className={`text-lg font-extrabold mt-0.5 ${
                  selectedScope === "ALL" ? "text-white" : "text-slate-900"
                }`}
              >
                {reports.length}{" "}
                <span className="text-[11px] font-normal opacity-80">
                  Laporan/Temuan
                </span>
              </div>
            </button>

            {scopeStats.map((sc) => {
              const active = selectedScope === sc.value;
              return (
                <button
                  key={sc.value}
                  onClick={() => setSelectedScope(sc.value)}
                  className={`p-3 rounded-xl border text-left transition ${
                    active
                      ? "text-white shadow-xs"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: sc.color,
                          borderColor: sc.color,
                        }
                      : undefined
                  }
                >
                  <div className="text-xs font-bold line-clamp-1">
                    {sc.shortLabel}
                  </div>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-lg font-extrabold">{sc.count}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        active ? "text-white/85" : "text-slate-400"
                      }`}
                    >
                      {sc.percent}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center justify-between lg:justify-start gap-3 shrink-0">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs sm:text-sm">
              <Filter className="w-4 h-4" style={{ color: config.primaryColor }} />
              <span>Filter Kriteria & Unit:</span>
            </div>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 py-0.5 rounded bg-rose-50"
              >
                Reset Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
            <select
              value={selectedCriterion}
              onChange={(e) => setSelectedCriterion(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-700"
            >
              <option value="ALL">Semua 9 Kriteria Akreditasi</option>
              {ACCREDITATION_CRITERIA.map((crit) => (
                <option key={crit} value={crit}>
                  {crit}
                </option>
              ))}
            </select>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-700"
            >
              <option value="ALL">
                Semua Fakultas / Prodi / Unit ({faculties.length})
              </option>
              {faculties.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.code ? `[${f.code}] ${f.name}` : f.name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-700"
            >
              <option value="ALL">Semua Tahun ({reports.length} Data)</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  Tahun {y}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-700"
            >
              <option value="ALL">Semua Status Penanganan</option>
              {STATUS_LIST.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Bukti & Temuan
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${config.primaryColor}15`,
                  color: config.primaryColor,
                }}
              >
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">
                {metrics.total}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.withEvidenceCount} data telah memiliki link bukti Google Drive
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Dalam Tindak Lanjut Unit
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-amber-600">
                {metrics.diproses}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Sedang diproses tindakan korektif & perbaikan
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selesai Ditindaklanjuti (Closed)
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">
                {metrics.selesai}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Temuan akademik/kasus telah ditutup secara resmi
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Skor Ketercapaian AMI
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${config.secondaryColor}15`,
                  color: config.secondaryColor,
                }}
              >
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {amiAchievement.overallAvg}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  / 4.00 ({amiAchievement.overallPercent}%)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Dari {auditSessions.length} Sesi Audit Mutu Internal (AMI)
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            HASIL AUDIT MUTU INTERNAL (AMI) & KETERCAPAIAN STANDAR SPMI
        ========================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 mb-1">
                <CheckSquare className="w-4 h-4" />
                <span>Hasil Evaluasi Audit Mutu Internal (AMI)</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Peta Ketercapaian Standar SPMI / SN-Dikti & Status Audit Unit
              </h3>
              <p className="text-xs text-slate-500">
                Skor asesmen ketercapaian standar mutu (Skala 1.00 s/d 4.00) hasil pemeriksaan Auditor AMI LPMI
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Filter Unit Audit:
              </span>
              <select
                value={selectedAuditUnit}
                onChange={(e) => setSelectedAuditUnit(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
              >
                <option value="ALL">
                  Seluruh Unit Teraudit ({auditSessions.length} Sesi AMI)
                </option>
                {Array.from(
                  new Set(auditSessions.map((s) => s.facultyOrUnit))
                ).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {auditSessions.length === 0 ? (
            <div className="py-12 px-4 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-3.5 border border-sky-100">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                Sesi Audit Mutu Internal (AMI) Belum Dipublikasikan
              </h4>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Pelaksanaan siklus AMI periode berjalan sedang dalam tahap persiapan instrumen standar SPMI dan penjadwalan visitasi lapangan. Hasil penilaian dan laporan LHA akan dirilis setelah proses asesmen selesai.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-90 transition"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Mulai Sesi AMI di Panel Admin</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Standar SPMI yang Diaudit</span>
                  <span>Skor Rata-Rata (Maks 4.00)</span>
                </div>
                {amiAchievement.byStandard.map((st) => (
                  <div key={st.stdName}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800">
                        {st.stdName}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {st.avg} / 4.00{" "}
                        <span className="text-slate-400 font-normal">
                          ({st.percent}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${st.percent}%`,
                          backgroundColor:
                            st.avg >= 3.5
                              ? "#059669"
                              : st.avg >= 2.8
                              ? config.primaryColor
                              : "#d97706",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 border border-slate-200/70">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Daftar Pelaksanaan Sesi AMI Terbaru
                  </h4>
                  <div className="space-y-3">
                    {auditSessions.map((sess) => {
                      const stObj = AUDIT_STATUS_LIST.find(
                        (s) => s.value === sess.status
                      );
                      const ktsInSess = sess.checklists.filter((c) =>
                        ["KTS_MINOR", "KTS_MAYOR", "OBSERVASI"].includes(
                          c.compliance
                        )
                      );
                      return (
                        <div
                          key={sess.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-[11px] font-bold text-slate-500">
                              {sess.auditCode} • {sess.cyclePeriod}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{
                                backgroundColor: `${stObj?.color || "#0284c7"}15`,
                                color: stObj?.color || "#0284c7",
                              }}
                            >
                              {stObj?.label || sess.status}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {sess.facultyOrUnit}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Ketua Auditor: {sess.leadAuditor}
                          </div>
                          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">
                              Skor AMI:{" "}
                              <strong className="text-emerald-700">
                                {sess.averageScore.toFixed(2)} / 4.00
                              </strong>
                            </span>
                            <div className="flex items-center gap-2">
                              {sess.gdriveReportUrl && (
                                <a
                                  href={sess.gdriveReportUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-semibold"
                                  title="Buka Folder Drive LHA"
                                >
                                  <FolderOpen className="w-3.5 h-3.5" />
                                  <span>Drive</span>
                                </a>
                              )}
                              <span className="text-amber-700 font-semibold">
                                {ktsInSess.length} Temuan (KTS/OB)
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                    <div className="text-[10px] text-slate-500">Melampaui</div>
                    <div className="text-sm font-extrabold text-emerald-600">
                      {amiAchievement.melampauiCount} Indikator
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                    <div className="text-[10px] text-slate-500">Mencapai</div>
                    <div className="text-sm font-extrabold text-sky-600">
                      {amiAchievement.mencapaiCount} Indikator
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                    <div className="text-[10px] text-slate-500">Temuan KTS/OB</div>
                    <div className="text-sm font-extrabold text-amber-600">
                      {amiAchievement.ktsCount} Indikator
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Public Transparency Log Table (DILENGKAPI LINK GDRIVE AKREDITASI & RTL DARI RTM) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Matriks Bukti Akreditasi, Temuan AMI & Siklus Mutu Lengkap (RTL, RTM & RTL dari RTM)
              </h3>
              <p className="text-xs text-slate-500">
                Terhubung langsung dengan tautan Google Drive bukti fisik pendukung untuk keperluan Asesmen Lapangan Akreditasi BAN-PT/LAM
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kriteria, bukti, unit, standar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Kode & Akreditasi</th>
                  <th className="py-3.5 px-5">Pokok Temuan, RTL Unit & RTL dari RTM</th>
                  <th className="py-3.5 px-5">Bukti Google Drive</th>
                  <th className="py-3.5 px-5">Fakultas / Unit</th>
                  <th className="py-3.5 px-5">Status Kasus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 px-4 text-center">
                      {reports.length === 0 ? (
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                            <ShieldCheck className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">
                              Belum Ada Laporan / Temuan yang Diterbitkan
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              Seluruh standar mutu SPMI dan kegiatan akademik berada dalam kondisi terkendali. Belum ada catatan ketidaksesuaian (KTS) atau tindak lanjut yang dirilis ke publik.
                            </p>
                          </div>
                          <div className="pt-2">
                            <Link
                              href="/admin"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-90 transition"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              <Settings className="w-3.5 h-3.5" />
                              <span>Buka Panel Admin LPMI</span>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-md mx-auto space-y-2.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                            <Search className="w-6 h-6" />
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-700">
                            Tidak Ada Data yang Cocok dengan Filter
                          </h4>
                          <p className="text-xs text-slate-400">
                            Coba ubah kata kunci pencarian atau sesuaikan opsi kriteria akreditasi, unit, dan status penanganan.
                          </p>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleResetFilters}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                            >
                              <span>Reset Semua Filter</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const scopeObj = SCOPE_LIST.find(
                      (s) => s.value === report.scope
                    );
                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-slate-50/80 transition"
                      >
                        <td className="py-4 px-5 whitespace-nowrap align-top">
                          <div className="font-mono text-xs font-bold text-slate-800">
                            {report.ticketNumber}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(report.reportedDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="mt-1.5 flex flex-col gap-1 items-start">
                            {getFindingBadge(report.findingType)}
                            <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                              {report.accreditationCriterion}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5 max-w-lg align-top space-y-2">
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {report.title}
                          </div>

                          {report.rtlPlan && (
                            <div className="text-xs text-sky-900 bg-sky-50/70 px-2.5 py-1.5 rounded-lg border border-sky-100">
                              <span className="font-bold">
                                1. RTL Unit ({report.rtlPic || report.facultyOrUnit}):{" "}
                              </span>
                              {report.rtlPlan}
                            </div>
                          )}

                          {report.rtmAgenda && (
                            <div className="text-xs text-amber-950 bg-amber-50/70 px-2.5 py-1.5 rounded-lg border border-amber-200">
                              <span className="font-bold">
                                2. Keputusan RTM:{" "}
                              </span>
                              {report.rtmAgenda}
                            </div>
                          )}

                          {report.rtlFromRtm && (
                            <div className="text-xs text-emerald-950 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                              <span className="font-bold">
                                3. RTL Lanjutan dari RTM ({report.rtlFromRtmPic || "Pimpinan"}):{" "}
                              </span>
                              {report.rtlFromRtm}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-5 text-xs align-top whitespace-nowrap">
                          {report.evidenceDriveUrl ? (
                            <a
                              href={report.evidenceDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold transition"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                              <span>Buka Bukti Drive</span>
                              <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">
                              Belum ada link drive
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-xs font-medium text-slate-700 whitespace-nowrap align-top">
                          {report.facultyOrUnit}
                        </td>

                        <td className="py-4 px-5 whitespace-nowrap align-top">
                          {getStatusBadge(report.status)}
                          <div className="mt-1">{getRtlBadge(report.rtlStatus)}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer with Custom University Contact & Branding */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt={config.universityName}
                    className="w-10 h-10 object-contain rounded-lg bg-white p-1"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    {config.satgasName}
                  </div>
                  <div className="text-base font-bold text-white">
                    {config.universityName}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {config.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Kantor LPMI & Sekretariat SPMI
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{config.officeAddress}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{config.contactPhone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{config.contactEmail}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Akreditasi & Siklus PPEPP
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Sistem ini terintegrasi dengan Google Drive penyimpanan bukti fisik akreditasi untuk 9 Kriteria BAN-PT/LAM, Audit Mutu Internal (AMI), RTL, RTM, dan RTL Lanjutan dari RTM.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Panel Admin LPMI & Bank Bukti Akreditasi</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>{config.footerText}</p>
            <p>Powered by Sistem Informasi SPMI, AMI & Akreditasi {config.satgasName}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
