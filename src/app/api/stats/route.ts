import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/lib/data/mock-projects";

export async function GET() {
  const totalProjects = 1248;
  const activeProjects = MOCK_PROJECTS.length;
  const totalAreaHa = 45210;
  const totalDisbursedCr = 12400;
  const slaCompliancePct = 91.4;

  const stageBreakdown = {
    SECTION_4_SIA: 210,
    SECTION_6_SIA_APPROVAL: 145,
    SECTION_9_SURVEY: 198,
    SECTION_11_PRELIMINARY: 312,
    SECTION_19_DECLARATION: 184,
    SECTION_23_AWARD: 115,
    SECTION_38_POSSESSION: 84,
  };

  const redFlags = [
    {
      id: "rf-1",
      project: "NTPC Solar Park 400MW",
      issue: "Section 11 hearing delayed > 60 days statutory SLA limit",
      severity: "CRITICAL",
      daysOverdue: 4,
    },
    {
      id: "rf-2",
      project: "Dholera SIR Activation B",
      issue: "Pending Sec 19 Sanction with state revenue department",
      severity: "WARNING",
      daysOverdue: 0,
    },
    {
      id: "rf-3",
      project: "Khasra 219B Title Dispute",
      issue: "Tribunal stay order on ₹92.8 Lakhs disbursement (Sec 64)",
      severity: "LITIGATION",
      daysOverdue: 12,
    },
  ];

  return NextResponse.json({
    success: true,
    data: {
      totalProjects,
      activeProjects,
      totalAreaHa,
      totalDisbursedCr,
      slaCompliancePct,
      stageBreakdown,
      redFlags,
    },
  });
}
