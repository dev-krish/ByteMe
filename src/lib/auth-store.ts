// Shared in-memory user registry for demonstration & standalone Next.js runs
export interface RegisteredUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  role: "CITIZEN" | "CALA_OFFICER" | "DIRECTOR_GENERAL" | "SURVEYOR" | "ADMINISTRATOR";
  phone?: string;
  agency?: string;
  department?: string;
  state?: string;
  khasraNo?: string;
  village?: string;
  district?: string;
}

export const REGISTERED_USERS_STORE = new Map<string, RegisteredUserRecord>();
