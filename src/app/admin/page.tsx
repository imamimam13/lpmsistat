import { ensureSeedAndGetData } from "@/lib/data";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await ensureSeedAndGetData();
  return {
    title: `Panel Admin LPMI/SPMI - ${config.satgasName} ${config.universityName}`,
  };
}

export default async function AdminPage() {
  const { config, faculties, reportCategories, reports, auditSessions } =
    await ensureSeedAndGetData();
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get("lpmi_admin_auth")?.value === "authenticated";

  const serializedReports = reports.map((r) => ({
    id: r.id,
    ticketNumber: r.ticketNumber,
    title: r.title,
    scope: r.scope,
    category: r.category,
    spmiStandard: r.spmiStandard,
    accreditationCriterion: r.accreditationCriterion,
    findingType: r.findingType,
    reporterRole: r.reporterRole,
    facultyOrUnit: r.facultyOrUnit,
    incidentDate: r.incidentDate.toISOString(),
    reportedDate: r.reportedDate.toISOString(),
    resolvedDate: r.resolvedDate ? r.resolvedDate.toISOString() : null,
    status: r.status,
    urgency: r.urgency,
    publicNote: r.publicNote,
    evidenceDriveUrl: r.evidenceDriveUrl,
    rootCause: r.rootCause,
    rtlPlan: r.rtlPlan,
    rtlPic: r.rtlPic,
    rtlTargetDate: r.rtlTargetDate,
    rtlStatus: r.rtlStatus,
    rtmAgenda: r.rtmAgenda,
    rtmDecisionDate: r.rtmDecisionDate ? r.rtmDecisionDate.toISOString() : null,
    rtlFromRtm: r.rtlFromRtm,
    rtlFromRtmPic: r.rtlFromRtmPic,
    rtlFromRtmTarget: r.rtlFromRtmTarget,
    rtlFromRtmStatus: r.rtlFromRtmStatus,
  }));

  const serializedFaculties = faculties.map((f) => ({
    id: f.id,
    name: f.name,
    code: f.code,
    type: f.type,
    headName: f.headName,
    gdriveFolderUrl: f.gdriveFolderUrl,
  }));

  const serializedCategories = reportCategories.map((c) => ({
    id: c.id,
    name: c.name,
    scope: c.scope,
    stdRef: c.stdRef,
  }));

  const serializedAudits = auditSessions.map((a) => ({
    id: a.id,
    auditCode: a.auditCode,
    cyclePeriod: a.cyclePeriod,
    facultyOrUnit: a.facultyOrUnit,
    auditeePic: a.auditeePic,
    leadAuditor: a.leadAuditor,
    memberAuditor: a.memberAuditor,
    auditDate: a.auditDate.toISOString(),
    status: a.status,
    summaryNote: a.summaryNote,
    averageScore: a.averageScore,
    gdriveReportUrl: a.gdriveReportUrl,
    checklists: a.checklists.map((c) => ({
      id: c.id,
      spmiStandard: c.spmiStandard,
      indicatorText: c.indicatorText,
      targetDesc: c.targetDesc,
      accreditationCriterion: c.accreditationCriterion,
      score: c.score,
      compliance: c.compliance,
      auditorNote: c.auditorNote,
      rootCause: c.rootCause,
      rtlRecommendation: c.rtlRecommendation,
      evidenceDriveUrl: c.evidenceDriveUrl,
      linkedReportId: c.linkedReportId,
    })),
  }));

  return (
    <AdminDashboardClient
      config={{
        id: config.id,
        universityName: config.universityName,
        satgasName: config.satgasName,
        tagline: config.tagline,
        description: config.description,
        logoUrl: config.logoUrl,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        contactEmail: config.contactEmail,
        contactPhone: config.contactPhone,
        officeAddress: config.officeAddress,
        footerText: config.footerText,
        adminPassword: config.adminPassword,
        showPublicFormButton: config.showPublicFormButton,
        publicFormUrl: config.publicFormUrl,
        headOfLpmiName: config.headOfLpmiName,
        headOfLpmiNip: config.headOfLpmiNip,
        rectorName: config.rectorName,
        rectorNip: config.rectorNip,
        masterDriveFolderUrl: config.masterDriveFolderUrl,
      }}
      faculties={serializedFaculties}
      reportCategories={serializedCategories}
      reports={serializedReports}
      auditSessions={serializedAudits}
      isAuthenticated={isAuthenticated}
    />
  );
}
