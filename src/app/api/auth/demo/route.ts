import { NextResponse } from "next/server";
import { signSession, UserSession } from "@/lib/security/token";
import { appendAuditRecord } from "@/lib/security/audit";

export const dynamic = "force-dynamic";

export interface DemoPreset {
  id: string;
  label: string;
  roleLabel: string;
  userType: "CITIZEN" | "OFFICER";
  redirectUrl: string;
  user: Omit<UserSession, "exp">;
}

export const DEMO_PRESETS: Record<string, DemoPreset> = {
  "citizen-rameshwar": {
    id: "citizen-rameshwar",
    label: "Rameshwar Prasad Meena",
    roleLabel: "Landowner (Dausa, Rajasthan)",
    userType: "CITIZEN",
    redirectUrl: "/citizen-portal",
    user: {
      userId: "CITIZEN-DAUSA-042A",
      name: "Rameshwar Prasad Meena",
      email: "rameshwar.meena@citizen.gov.in",
      role: "CITIZEN",
      userType: "CITIZEN",
      department: "Landowner (Dausa Revenue Zone)",
      state: "Rajasthan",
      district: "Dausa",
      village: "Ramgarh Revenue Ward 3",
      khasraNo: "Plot 42A",
      aadhaarLast4: "4291",
      phone: "9829012345",
    },
  },
  "citizen-sunita": {
    id: "citizen-sunita",
    label: "Smt. Sunita Devi",
    roleLabel: "Landowner (Bandikui, Dausa)",
    userType: "CITIZEN",
    redirectUrl: "/citizen-portal",
    user: {
      userId: "CITIZEN-RAM-108B",
      name: "Smt. Sunita Devi",
      email: "sunita.devi@citizen.gov.in",
      role: "CITIZEN",
      userType: "CITIZEN",
      department: "Landowner (Bandikui Ward)",
      state: "Rajasthan",
      district: "Dausa",
      village: "Ramgarh",
      khasraNo: "Khasra 108/2",
      aadhaarLast4: "8820",
      phone: "9876543210",
    },
  },
  "citizen-vikram": {
    id: "citizen-vikram",
    label: "Vikram Rathore",
    roleLabel: "Landowner (Sawai Madhopur)",
    userType: "CITIZEN",
    redirectUrl: "/citizen-portal",
    user: {
      userId: "CITIZEN-SWM-089A",
      name: "Vikram Rathore",
      email: "vikram.rathore@citizen.gov.in",
      role: "CITIZEN",
      userType: "CITIZEN",
      department: "Landowner (Chauth Ka Barwara)",
      state: "Rajasthan",
      district: "Sawai Madhopur",
      village: "Chauth Ka Barwara",
      khasraNo: "Khasra 89/1",
      aadhaarLast4: "5512",
      phone: "9414098765",
    },
  },
  "officer-cala": {
    id: "officer-cala",
    label: "Rajeshwar Sharma, IAS",
    roleLabel: "Competent Authority (CALA Dausa)",
    userType: "OFFICER",
    redirectUrl: "/executive-dashboard",
    user: {
      userId: "OFFICER-DAUSA-01",
      name: "Rajeshwar Sharma, IAS",
      email: "cala.dausa@gov.in",
      role: "CALA_OFFICER",
      userType: "OFFICER",
      department: "Revenue & Land Reforms Department",
      state: "Rajasthan",
      district: "Dausa",
    },
  },
  "officer-dg": {
    id: "officer-dg",
    label: "Dr. Vikramaditya Sen",
    roleLabel: "Director General (NHAI HQ)",
    userType: "OFFICER",
    redirectUrl: "/executive-dashboard",
    user: {
      userId: "OFFICER-NHAI-HQ",
      name: "Dr. Vikramaditya Sen",
      email: "dg.nhai@gov.in",
      role: "DIRECTOR_GENERAL",
      userType: "OFFICER",
      department: "National Highways Authority of India",
      state: "National HQ (New Delhi)",
    },
  },
  "officer-dolr": {
    id: "officer-dolr",
    label: "Ananya Deshmukh, IAS",
    roleLabel: "DoLR Lead / Administrator",
    userType: "OFFICER",
    redirectUrl: "/executive-dashboard",
    user: {
      userId: "OFFICER-NIC-DEMO",
      name: "Ananya Deshmukh, IAS",
      email: "officer@nic.in",
      role: "ADMINISTRATOR",
      userType: "OFFICER",
      department: "Department of Land Resources (DoLR)",
      state: "Maharashtra",
    },
  },
  "officer-finance": {
    id: "officer-finance",
    label: "Suresh Kumar",
    roleLabel: "Chief Finance Officer",
    userType: "OFFICER",
    redirectUrl: "/compensation",
    user: {
      userId: "OFFICER-FIN-09",
      name: "Suresh Kumar",
      email: "finance.dolr@gov.in",
      role: "FINANCE_OFFICER",
      userType: "OFFICER",
      department: "Land Acquisition Finance & DBT Cell",
      state: "National HQ (New Delhi)",
    },
  },
  "officer-surveyor": {
    id: "officer-surveyor",
    label: "Priya Sundaram",
    roleLabel: "Chief Cadastral Surveyor",
    userType: "OFFICER",
    redirectUrl: "/gis-map",
    user: {
      userId: "OFFICER-SURVEY-04",
      name: "Priya Sundaram",
      email: "surveyor.soi@gov.in",
      role: "SURVEYOR",
      userType: "OFFICER",
      department: "Survey of India • Cadastral Mapping Wing",
      state: "Rajasthan Zone",
    },
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { presetId, role } = body;

    let selectedPreset = DEMO_PRESETS[presetId];

    if (!selectedPreset && role) {
      if (role === "CITIZEN") {
        selectedPreset = DEMO_PRESETS["citizen-rameshwar"];
      } else if (role === "CALA_OFFICER") {
        selectedPreset = DEMO_PRESETS["officer-cala"];
      } else if (role === "DIRECTOR_GENERAL") {
        selectedPreset = DEMO_PRESETS["officer-dg"];
      } else if (role === "FINANCE_OFFICER") {
        selectedPreset = DEMO_PRESETS["officer-finance"];
      } else if (role === "SURVEYOR") {
        selectedPreset = DEMO_PRESETS["officer-surveyor"];
      } else {
        selectedPreset = DEMO_PRESETS["officer-cala"];
      }
    }

    if (!selectedPreset) {
      selectedPreset = DEMO_PRESETS["citizen-rameshwar"];
    }

    const exp = Date.now() + 8 * 60 * 60 * 1000;
    const sessionPayload: UserSession = {
      ...selectedPreset.user,
      exp,
    };

    const token = await signSession(sessionPayload);

    await appendAuditRecord(
      "DEMO_LOGIN",
      selectedPreset.userType === "CITIZEN" ? "CITIZEN-PORTAL" : "OFFICER-PORTAL",
      sessionPayload.userId,
      {
        name: sessionPayload.name,
        role: sessionPayload.role,
        userType: sessionPayload.userType,
        presetId: selectedPreset.id,
      }
    );

    const response = NextResponse.json({
      success: true,
      message: `Demo authentication granted for ${selectedPreset.label} (${selectedPreset.roleLabel})`,
      redirectUrl: selectedPreset.redirectUrl,
      user: {
        id: sessionPayload.userId,
        name: sessionPayload.name,
        email: sessionPayload.email,
        role: sessionPayload.role,
        userType: sessionPayload.userType,
        department: sessionPayload.department,
        state: sessionPayload.state,
        district: sessionPayload.district,
        village: sessionPayload.village,
        khasraNo: sessionPayload.khasraNo,
        aadhaarLast4: sessionPayload.aadhaarLast4,
        phone: sessionPayload.phone,
      },
    });

    response.cookies.set("nlams_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Demo auth error:", error);
    return NextResponse.json(
      { error: "Internal demo authentication error" },
      { status: 500 }
    );
  }
}
