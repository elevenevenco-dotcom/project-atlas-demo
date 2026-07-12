"use client";

// A self-contained demo session and billing state stored in the browser's
// localStorage. There is no server, no password checking, and no real
// payments involved anywhere in this file.

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  credits: number;
};

const SESSION_KEY = "atlas_demo_session";
const FREE_CREDITS = 5;
const PRO_CREDITS = 200;

function readSession(): LocalUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalUser;
  } catch {
    return null;
  }
}

function writeSession(user: LocalUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): LocalUser | null {
  return readSession();
}

export function signUp(name: string, email: string): LocalUser {
  const user: LocalUser = {
    id: crypto.randomUUID(),
    name: name.trim() || "Demo User",
    email: email.trim().toLowerCase(),
    plan: "free",
    credits: FREE_CREDITS,
  };
  writeSession(user);
  return user;
}

export function logIn(email: string): LocalUser {
  // No password check in demo mode — logging in just resumes (or creates)
  // the local profile tied to this browser.
  const existing = readSession();
  if (existing && existing.email === email.trim().toLowerCase()) {
    return existing;
  }
  return signUp(email.split("@")[0] ?? "Demo User", email);
}

export function startInstantDemo(): LocalUser {
  return signUp("Demo User", `demo-${Date.now()}@example.com`);
}

export function logOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function useCredit(): LocalUser | null {
  const user = readSession();
  if (!user || user.credits <= 0) return user;
  const updated = { ...user, credits: user.credits - 1 };
  writeSession(updated);
  return updated;
}

export function upgradeToPro(): LocalUser | null {
  const user = readSession();
  if (!user) return null;
  const updated: LocalUser = { ...user, plan: "pro", credits: PRO_CREDITS };
  writeSession(updated);
  return updated;
}

export function downgradeToFree(): LocalUser | null {
  const user = readSession();
  if (!user) return null;
  const updated: LocalUser = { ...user, plan: "free", credits: FREE_CREDITS };
  writeSession(updated);
  return updated;
}
