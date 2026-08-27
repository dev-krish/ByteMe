"use client";

import { AcquisitionProject, Beneficiary, CadastralParcel } from "@/types";
import { MOCK_PROJECTS, MOCK_BENEFICIARIES } from "@/lib/data/mock-projects";
import { MOCK_PARCELS } from "@/lib/data/cadastral-parcels";

const STORAGE_KEYS = {
  PROJECTS: "nlams_persistent_projects",
  BENEFICIARIES: "nlams_persistent_beneficiaries",
  PARCELS: "nlams_persistent_parcels",
  AUDIT_LOGS: "nlams_persistent_audit_logs",
};

// Safe LocalStorage Reader with SSR Guard
export function getStoredProjects(): AcquisitionProject[] {
  if (typeof window === "undefined") return MOCK_PROJECTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJECTS));
      return MOCK_PROJECTS;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_PROJECTS;
  }
}

export function saveStoredProjects(projects: AcquisitionProject[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error("Failed to save projects to storage", err);
  }
}

export function getStoredBeneficiaries(): Beneficiary[] {
  if (typeof window === "undefined") return MOCK_BENEFICIARIES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BENEFICIARIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(MOCK_BENEFICIARIES));
      return MOCK_BENEFICIARIES;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_BENEFICIARIES;
  }
}

export function saveStoredBeneficiaries(beneficiaries: Beneficiary[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(beneficiaries));
  } catch (err) {
    console.error("Failed to save beneficiaries to storage", err);
  }
}

export function getStoredParcels(): CadastralParcel[] {
  if (typeof window === "undefined") return MOCK_PARCELS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARCELS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(MOCK_PARCELS));
      return MOCK_PARCELS;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_PARCELS;
  }
}

export function saveStoredParcels(parcels: CadastralParcel[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));
  } catch (err) {
    console.error("Failed to save parcels to storage", err);
  }
}

export function resetToDefaults(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(MOCK_BENEFICIARIES));
  localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(MOCK_PARCELS));
}
