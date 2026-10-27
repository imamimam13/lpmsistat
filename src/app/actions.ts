"use server";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_AMI_INDICATORS,
  COMPLIANCE_LIST,
  generateDeterministicQualityFlow,
} from "@/lib/data";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function verifyAdminAction(password: string) {
  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
  const expected = config?.adminPassword || "admin123";

  if (password === expected) {
    const cookieStore = await cookies();
    cookieStore.set("lpmi_admin_auth", "authenticated", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true };
  }

  return { success: false, message: "Password admin tidak sesuai." };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete("lpmi_admin_auth");
  revalidatePath("/admin");
}

export async function updateBrandingAction(formData: FormData) {
  const universityName = (formData.get("universityName") as string) || "Universitas Nusantara";
  const satgasName = (formData.get("satgasName") as string) || "LPMI & Satgas SPMI";
  const tagline = (formData.get("tagline") as string) || "";
  const description = (formData.get("description") as string) || "";
  const logoUrl = (formData.get("logoUrl") as string) || "";
  const primaryColor = (formData.get("primaryColor") as string) || "#1e3a8a";
  const secondaryColor = (formData.get("secondaryColor") as string) || "#0284c7";
  const accentColor = (formData.get("accentColor") as string) || "#f59e0b";
  const contactEmail = (formData.get("contactEmail") as string) || "";
  const contactPhone = (formData.get("contactPhone") as string) || "";
  const officeAddress = (formData.get("officeAddress") as string) || "";
  const footerText = (formData.get("footerText") as string) || "";
  const adminPassword = (formData.get("adminPassword") as string) || "admin123";
  const showPublicFormButton = formData.get("showPublicFormButton") === "true";
  const publicFormUrl = (formData.get("publicFormUrl") as string) || "";
  const headOfLpmiName = (formData.get("headOfLpmiName") as string) || "";
  const headOfLpmiNip = (formData.get("headOfLpmiNip") as string) || "";
  const rectorName = (formData.get("rectorName") as string) || "";
  const rectorNip = (formData.get("rectorNip") as string) || "";
  const masterDriveFolderUrl = (formData.get("masterDriveFolderUrl") as string) || "";

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {
      universityName,
      satgasName,
      tagline,
      description,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      contactEmail,
      contactPhone,
      officeAddress,
      footerText,
      adminPassword,
      showPublicFormButton,
      publicFormUrl,
      headOfLpmiName,
      headOfLpmiNip,
      rectorName,
      rectorNip,
      masterDriveFolderUrl,
    },
    create: {
      id: "default",
      universityName,
      satgasName,
      tagline,
      description,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      contactEmail,
      contactPhone,
      officeAddress,
      footerText,
      adminPassword,
      showPublicFormButton,
      publicFormUrl,
      headOfLpmiName,
      headOfLpmiNip,
      rectorName,
      rectorNip,
      masterDriveFolderUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// MASTER FAKULTAS & UNIT KERJA (WITH GDRIVE LINK)
export async function createFacultyUnitAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const code = (formData.get("code") as string)?.trim() || null;
  const type = (formData.get("type") as string) || "FAKULTAS";
  const headName = (formData.get("headName") as string)?.trim() || null;
  const gdriveFolderUrl = (formData.get("gdriveFolderUrl") as string)?.trim() || null;

  if (!name) return { success: false, message: "Nama Fakultas/Unit wajib diisi." };

  await prisma.facultyUnit.create({
    data: { name, code, type, headName, gdriveFolderUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateFacultyUnitAction(formData: FormData) {
  const id = formData.get("id") as string;
  const oldName = formData.get("oldName") as string;
  const name = (formData.get("name") as string)?.trim();
  const code = (formData.get("code") as string)?.trim() || null;
  const type = (formData.get("type") as string) || "FAKULTAS";
  const headName = (formData.get("headName") as string)?.trim() || null;
  const gdriveFolderUrl = (formData.get("gdriveFolderUrl") as string)?.trim() || null;

  await prisma.facultyUnit.update({
    where: { id },
    data: { name, code, type, headName, gdriveFolderUrl },
  });

  if (oldName && name && oldName !== name) {
    await prisma.report.updateMany({
      where: { facultyOrUnit: oldName },
      data: { facultyOrUnit: name },
    });
    await prisma.auditSession.updateMany({
      where: { facultyOrUnit: oldName },
      data: { facultyOrUnit: name },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteFacultyUnitAction(id: string) {
  await prisma.facultyUnit.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// MASTER KATEGORI & LINGKUP TUPOKSI LPMI/SPMI ACTIONS
export async function createReportCategoryAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const scope = (formData.get("scope") as string) || "AKADEMIK_SPMI";
  const stdRef = (formData.get("stdRef") as string)?.trim() || null;

  if (!name) return { success: false };

  await prisma.reportCategory.create({
    data: { name, scope, stdRef },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteReportCategoryAction(id: string) {
  await prisma.reportCategory.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// ==========================================================
// MODUL PELAKSANAAN AUDIT MUTU INTERNAL (AMI) ACTIONS
// ==========================================================
export async function createAuditSessionAction(formData: FormData) {
  const auditCode = (formData.get("auditCode") as string)?.trim();
  const cyclePeriod =
    (formData.get("cyclePeriod") as string)?.trim() ||
    "Siklus AMI 2026/2027 Ganjil";
  const facultyOrUnit =
    (formData.get("facultyOrUnit") as string)?.trim() || "Fakultas Teknik";
  const auditeePic =
    (formData.get("auditeePic") as string)?.trim() ||
    `Pimpinan ${facultyOrUnit}`;
  const leadAuditor =
    (formData.get("leadAuditor") as string)?.trim() || "Tim Auditor LPMI";
  const memberAuditor =
    (formData.get("memberAuditor") as string)?.trim() || null;
  const auditDateStr = formData.get("auditDate") as string;
  const status = (formData.get("status") as string) || "DIJADWALKAN";
  const summaryNote = (formData.get("summaryNote") as string)?.trim() || null;
  const gdriveReportUrl = (formData.get("gdriveReportUrl") as string)?.trim() || null;

  const year = new Date().getFullYear();
  const rand = Math.floor(10 + Math.random() * 89);
  const finalCode = auditCode || `AMI-${year}-${rand}`;

  await prisma.auditSession.create({
    data: {
      auditCode: finalCode,
      cyclePeriod,
      facultyOrUnit,
      auditeePic,
      leadAuditor,
      memberAuditor,
      auditDate: auditDateStr ? new Date(auditDateStr) : new Date(),
      status,
      summaryNote,
      gdriveReportUrl,
      averageScore: 3.0,
      checklists: {
        create: DEFAULT_AMI_INDICATORS.map((ind) => ({
          spmiStandard: ind.spmiStandard,
          indicatorText: ind.indicatorText,
          targetDesc: ind.targetDesc,
          accreditationCriterion: ind.accreditationCriterion,
          score: 3,
          compliance: "MENCAPAI",
          auditorNote: "Telah sesuai dengan standar SPMI.",
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateAuditSessionMetaAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = (formData.get("status") as string) || "VISITASI_LAPANGAN";
  const leadAuditor = (formData.get("leadAuditor") as string)?.trim() || "";
  const memberAuditor =
    (formData.get("memberAuditor") as string)?.trim() || null;
  const auditeePic = (formData.get("auditeePic") as string)?.trim() || "";
  const summaryNote = (formData.get("summaryNote") as string)?.trim() || null;
  const gdriveReportUrl = (formData.get("gdriveReportUrl") as string)?.trim() || null;

  await prisma.auditSession.update({
    where: { id },
    data: {
      status,
      leadAuditor,
      memberAuditor,
      auditeePic,
      summaryNote,
      gdriveReportUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateAuditChecklistItemAction(formData: FormData) {
  const checklistId = formData.get("checklistId") as string;
  const auditSessionId = formData.get("auditSessionId") as string;
  const compliance = (formData.get("compliance") as string) || "MENCAPAI";
  const auditorNote = (formData.get("auditorNote") as string)?.trim() || null;
  const rootCause = (formData.get("rootCause") as string)?.trim() || null;
  const rtlRecommendation =
    (formData.get("rtlRecommendation") as string)?.trim() || null;
  const evidenceDriveUrl =
    (formData.get("evidenceDriveUrl") as string)?.trim() || null;
  const accreditationCriterion =
    (formData.get("accreditationCriterion") as string) || "Kriteria 6: Pendidikan";

  const compObj = COMPLIANCE_LIST.find((c) => c.value === compliance);
  const score = compObj ? compObj.score : 3;

  await prisma.auditChecklist.update({
    where: { id: checklistId },
    data: {
      compliance,
      score,
      auditorNote,
      rootCause,
      rtlRecommendation,
      evidenceDriveUrl,
      accreditationCriterion,
    },
  });

  const allItems = await prisma.auditChecklist.findMany({
    where: { auditSessionId },
  });
  const totalScore = allItems.reduce((acc, item) => acc + item.score, 0);
  const avg =
    allItems.length > 0
      ? Number((totalScore / allItems.length).toFixed(2))
      : 0;

  await prisma.auditSession.update({
    where: { id: auditSessionId },
    data: { averageScore: avg },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function addCustomChecklistIndicatorAction(formData: FormData) {
  const auditSessionId = formData.get("auditSessionId") as string;
  const spmiStandard =
    (formData.get("spmiStandard") as string) || "Standar Proses Pembelajaran";
  const indicatorText = (formData.get("indicatorText") as string)?.trim();
  const targetDesc =
    (formData.get("targetDesc") as string)?.trim() ||
    "100% Terpenuhi sesuai Standar SPMI";
  const accreditationCriterion =
    (formData.get("accreditationCriterion") as string) || "Kriteria 6: Pendidikan";
  const evidenceDriveUrl =
    (formData.get("evidenceDriveUrl") as string)?.trim() || null;

  if (!indicatorText) return { success: false };

  await prisma.auditChecklist.create({
    data: {
      auditSessionId,
      spmiStandard,
      indicatorText,
      targetDesc,
      accreditationCriterion,
      score: 3,
      compliance: "MENCAPAI",
      evidenceDriveUrl,
    },
  });

  const allItems = await prisma.auditChecklist.findMany({
    where: { auditSessionId },
  });
  const totalScore = allItems.reduce((acc, item) => acc + item.score, 0);
  const avg =
    allItems.length > 0
      ? Number((totalScore / allItems.length).toFixed(2))
      : 0;

  await prisma.auditSession.update({
    where: { id: auditSessionId },
    data: { averageScore: avg },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// Auto-Generate Deterministic Temuan, RTL, RTM & RTL Lanjutan dari RTM (Tanpa AI)
export async function autoGenerateFindingAndRtlAction(checklistId: string) {
  const item = await prisma.auditChecklist.findUnique({
    where: { id: checklistId },
    include: { auditSession: true },
  });

  if (!item) return { success: false, message: "Butir checklist tidak ditemukan." };

  const sess = item.auditSession;
  const flow = generateDeterministicQualityFlow(
    item.spmiStandard,
    item.indicatorText,
    sess.facultyOrUnit,
    item.compliance
  );

  const updatedChecklist = await prisma.auditChecklist.update({
    where: { id: checklistId },
    data: {
      rootCause: item.rootCause || flow.rootCause,
      rtlRecommendation: item.rtlRecommendation || flow.rtlPlan,
    },
  });

  // Jika item KTS/OB, sekalian langsung terbitkan ke Report (Siklus Mutu Lengkap)
  const isNonCompliant = ["KTS_MAYOR", "KTS_MINOR", "OBSERVASI"].includes(
    item.compliance
  );
  if (isNonCompliant && !item.linkedReportId) {
    const year = new Date(sess.auditDate).getFullYear();
    const rand = Math.floor(100 + Math.random() * 899);
    const ticketNumber = `PTK-${sess.auditCode}-${rand}`;

    const createdReport = await prisma.report.create({
      data: {
        ticketNumber,
        title: `Temuan AMI (${item.compliance.replace("_", " ")}): ${item.indicatorText}`,
        scope: "AMI_MONEV",
        category: "Temuan Audit Mutu Internal (AMI) Prodi/Unit",
        spmiStandard: item.spmiStandard,
        accreditationCriterion: item.accreditationCriterion,
        findingType: item.compliance,
        reporterRole: `Auditor AMI (${sess.leadAuditor})`,
        facultyOrUnit: sess.facultyOrUnit,
        incidentDate: sess.auditDate,
        reportedDate: new Date(),
        status: "VERIFIKASI",
        urgency: item.compliance === "KTS_MAYOR" ? "TINGGI" : "SEDANG",
        publicNote: item.auditorNote || `Temuan pada evaluasi standar ${item.spmiStandard}.`,
        evidenceDriveUrl: item.evidenceDriveUrl,
        rootCause: updatedChecklist.rootCause,
        rtlPlan: updatedChecklist.rtlRecommendation,
        rtlPic: sess.auditeePic,
        rtlTargetDate: sess.cyclePeriod,
        rtlStatus: "DIRENCANAKAN",
        rtmAgenda: flow.rtmAgenda,
        rtmDecisionDate: new Date(),
        rtlFromRtm: flow.rtlFromRtm,
        rtlFromRtmPic: `Dekan ${sess.facultyOrUnit} & Direktur Terkait`,
        rtlFromRtmTarget: "Siklus RTM Semester Berikutnya",
        rtlFromRtmStatus: "BERJALAN",
      },
    });

    await prisma.auditChecklist.update({
      where: { id: checklistId },
      data: { linkedReportId: createdReport.id },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// Publish non-compliant AMI Checklist Item directly into Report (PTK / RTL & RTM Matrix)
export async function publishChecklistFindingToRtlAction(checklistId: string) {
  const item = await prisma.auditChecklist.findUnique({
    where: { id: checklistId },
    include: { auditSession: true },
  });

  if (!item) return { success: false, message: "Butir checklist tidak ditemukan." };

  const sess = item.auditSession;
  const year = new Date(sess.auditDate).getFullYear();
  const rand = Math.floor(100 + Math.random() * 899);
  const ticketNumber = `PTK-${sess.auditCode}-${rand}`;

  const findingType =
    item.compliance === "KTS_MAYOR"
      ? "KTS_MAYOR"
      : item.compliance === "KTS_MINOR"
      ? "KTS_MINOR"
      : "OBSERVASI";

  const urgency =
    item.compliance === "KTS_MAYOR"
      ? "TINGGI"
      : item.compliance === "KTS_MINOR"
      ? "SEDANG"
      : "RENDAH";

  const flow = generateDeterministicQualityFlow(
    item.spmiStandard,
    item.indicatorText,
    sess.facultyOrUnit,
    item.compliance
  );

  const createdReport = await prisma.report.create({
    data: {
      ticketNumber,
      title: `Temuan AMI (${findingType.replace("_", " ")}): ${item.indicatorText}`,
      scope: "AMI_MONEV",
      category: "Temuan Audit Mutu Internal (AMI) Prodi/Unit",
      spmiStandard: item.spmiStandard,
      accreditationCriterion: item.accreditationCriterion,
      findingType,
      reporterRole: `Auditor AMI (${sess.leadAuditor})`,
      facultyOrUnit: sess.facultyOrUnit,
      incidentDate: sess.auditDate,
      reportedDate: new Date(),
      status: "VERIFIKASI",
      urgency,
      publicNote:
        item.auditorNote ||
        `Ditemukan ketidaksesuaian pada saat pelaksanaan ${sess.cyclePeriod}.`,
      evidenceDriveUrl: item.evidenceDriveUrl,
      rootCause: item.rootCause || flow.rootCause,
      rtlPlan: item.rtlRecommendation || flow.rtlPlan,
      rtlPic: sess.auditeePic,
      rtlTargetDate: sess.cyclePeriod,
      rtlStatus: "DIRENCANAKAN",
      rtmAgenda: flow.rtmAgenda,
      rtmDecisionDate: new Date(),
      rtlFromRtm: flow.rtlFromRtm,
      rtlFromRtmPic: `Dekan ${sess.facultyOrUnit} & Pimpinan Universitas`,
      rtlFromRtmTarget: "Siklus RTM Semester Berikutnya",
      rtlFromRtmStatus: "BERJALAN",
    },
  });

  await prisma.auditChecklist.update({
    where: { id: checklistId },
    data: { linkedReportId: createdReport.id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, ticketNumber };
}

export async function deleteAuditSessionAction(id: string) {
  await prisma.auditSession.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// REPORT & RTL/RTM ACTIONS
export async function createReportAction(formData: FormData) {
  const ticketNumber = (formData.get("ticketNumber") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const scope = (formData.get("scope") as string) || "AKADEMIK_SPMI";
  const category = (formData.get("category") as string) || "Lainnya";
  const spmiStandard =
    (formData.get("spmiStandard") as string) || "Standar Proses Pembelajaran";
  const accreditationCriterion =
    (formData.get("accreditationCriterion") as string) || "Kriteria 6: Pendidikan";
  const findingType = (formData.get("findingType") as string) || "EVALUASI_RUTIN";
  const reporterRole = (formData.get("reporterRole") as string) || "Auditor AMI / Tim LPMI";
  const facultyOrUnit = (formData.get("facultyOrUnit") as string)?.trim() || "Umum";
  const incidentDateStr = formData.get("incidentDate") as string;
  const reportedDateStr = formData.get("reportedDate") as string;
  const resolvedDateStr = formData.get("resolvedDate") as string;
  const status = (formData.get("status") as string) || "DITERIMA";
  const urgency = (formData.get("urgency") as string) || "SEDANG";
  const publicNote = (formData.get("publicNote") as string)?.trim() || null;
  const evidenceDriveUrl = (formData.get("evidenceDriveUrl") as string)?.trim() || null;

  let rootCause = (formData.get("rootCause") as string)?.trim() || null;
  let rtlPlan = (formData.get("rtlPlan") as string)?.trim() || null;
  const rtlPic = (formData.get("rtlPic") as string)?.trim() || null;
  const rtlTargetDate = (formData.get("rtlTargetDate") as string)?.trim() || null;
  const rtlStatus = (formData.get("rtlStatus") as string) || "BELUM_DIBUAT";
  let rtmAgenda = (formData.get("rtmAgenda") as string)?.trim() || null;
  let rtlFromRtm = (formData.get("rtlFromRtm") as string)?.trim() || null;
  const rtlFromRtmPic = (formData.get("rtlFromRtmPic") as string)?.trim() || null;
  const rtlFromRtmTarget = (formData.get("rtlFromRtmTarget") as string)?.trim() || null;
  const rtlFromRtmStatus = (formData.get("rtlFromRtmStatus") as string) || "MENUNGGU_PELAKSANAAN";

  // Auto-fill template jika kosong
  if (!rootCause || !rtlPlan || !rtmAgenda || !rtlFromRtm) {
    const flow = generateDeterministicQualityFlow(
      spmiStandard,
      title,
      facultyOrUnit,
      findingType
    );
    if (!rootCause) rootCause = flow.rootCause;
    if (!rtlPlan) rtlPlan = flow.rtlPlan;
    if (!rtmAgenda) rtmAgenda = flow.rtmAgenda;
    if (!rtlFromRtm) rtlFromRtm = flow.rtlFromRtm;
  }

  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100 + Math.random() * 900);
  const finalTicket = ticketNumber || `LPMI-${year}-${randomDigits}`;

  const incidentDate = incidentDateStr ? new Date(incidentDateStr) : new Date();
  const reportedDate = reportedDateStr ? new Date(reportedDateStr) : new Date();
  const resolvedDate =
    status === "SELESAI" || status === "DITOLAK"
      ? resolvedDateStr
        ? new Date(resolvedDateStr)
        : new Date()
      : null;

  await prisma.report.create({
    data: {
      ticketNumber: finalTicket,
      title,
      scope,
      category,
      spmiStandard,
      accreditationCriterion,
      findingType,
      reporterRole,
      facultyOrUnit,
      incidentDate,
      reportedDate,
      resolvedDate,
      status,
      urgency,
      publicNote,
      evidenceDriveUrl,
      rootCause,
      rtlPlan,
      rtlPic,
      rtlTargetDate,
      rtlStatus,
      rtmAgenda,
      rtmDecisionDate: new Date(),
      rtlFromRtm,
      rtlFromRtmPic,
      rtlFromRtmTarget,
      rtlFromRtmStatus,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateReportAction(formData: FormData) {
  const id = formData.get("id") as string;
  const ticketNumber = (formData.get("ticketNumber") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const scope = (formData.get("scope") as string) || "AKADEMIK_SPMI";
  const category = (formData.get("category") as string) || "Lainnya";
  const spmiStandard =
    (formData.get("spmiStandard") as string) || "Standar Proses Pembelajaran";
  const accreditationCriterion =
    (formData.get("accreditationCriterion") as string) || "Kriteria 6: Pendidikan";
  const findingType = (formData.get("findingType") as string) || "EVALUASI_RUTIN";
  const reporterRole = (formData.get("reporterRole") as string) || "Auditor AMI / Tim LPMI";
  const facultyOrUnit = (formData.get("facultyOrUnit") as string)?.trim() || "Umum";
  const incidentDateStr = formData.get("incidentDate") as string;
  const reportedDateStr = formData.get("reportedDate") as string;
  const resolvedDateStr = formData.get("resolvedDate") as string;
  const status = (formData.get("status") as string) || "DITERIMA";
  const urgency = (formData.get("urgency") as string) || "SEDANG";
  const publicNote = (formData.get("publicNote") as string)?.trim() || null;
  const evidenceDriveUrl = (formData.get("evidenceDriveUrl") as string)?.trim() || null;

  const rootCause = (formData.get("rootCause") as string)?.trim() || null;
  const rtlPlan = (formData.get("rtlPlan") as string)?.trim() || null;
  const rtlPic = (formData.get("rtlPic") as string)?.trim() || null;
  const rtlTargetDate = (formData.get("rtlTargetDate") as string)?.trim() || null;
  const rtlStatus = (formData.get("rtlStatus") as string) || "BELUM_DIBUAT";
  const rtmAgenda = (formData.get("rtmAgenda") as string)?.trim() || null;
  const rtlFromRtm = (formData.get("rtlFromRtm") as string)?.trim() || null;
  const rtlFromRtmPic = (formData.get("rtlFromRtmPic") as string)?.trim() || null;
  const rtlFromRtmTarget = (formData.get("rtlFromRtmTarget") as string)?.trim() || null;
  const rtlFromRtmStatus = (formData.get("rtlFromRtmStatus") as string) || "MENUNGGU_PELAKSANAAN";

  const incidentDate = incidentDateStr ? new Date(incidentDateStr) : new Date();
  const reportedDate = reportedDateStr ? new Date(reportedDateStr) : new Date();
  const resolvedDate =
    status === "SELESAI" || status === "DITOLAK"
      ? resolvedDateStr
        ? new Date(resolvedDateStr)
        : new Date()
      : null;

  await prisma.report.update({
    where: { id },
    data: {
      ticketNumber,
      title,
      scope,
      category,
      spmiStandard,
      accreditationCriterion,
      findingType,
      reporterRole,
      facultyOrUnit,
      incidentDate,
      reportedDate,
      resolvedDate,
      status,
      urgency,
      publicNote,
      evidenceDriveUrl,
      rootCause,
      rtlPlan,
      rtlPic,
      rtlTargetDate,
      rtlStatus,
      rtmAgenda,
      rtlFromRtm,
      rtlFromRtmPic,
      rtlFromRtmTarget,
      rtlFromRtmStatus,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteReportAction(id: string) {
  await prisma.report.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
