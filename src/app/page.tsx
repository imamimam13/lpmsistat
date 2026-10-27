import { ensureSeedAndGetData } from "@/lib/data";
import PublicDashboardClient from "@/components/PublicDashboardClient";
import { connection } from "next/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await ensureSeedAndGetData();
  return {
    title: `${config.satgasName} - ${config.universityName} | Statistik SPMI, AMI, Akreditasi & Pelaporan`,
    description: config.tagline,
  };
}

export default async function HomePage() {
  await connection();
  const { config, faculties, reportCategories, reports, auditSessions } =
    await ensureSeedAndGetData();

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
    <PublicDashboardClient
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
        showPublicFormButton: config.showPublicFormButton,
        publicFormUrl: config.publicFormUrl,
        masterDriveFolderUrl: config.masterDriveFolderUrl,
      }}
      faculties={serializedFaculties}
      reportCategories={serializedCategories}
      reports={serializedReports}
      auditSessions={serializedAudits}
    />
  );
}
