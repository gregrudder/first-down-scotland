"use client";

import { useEffect } from "react";
import { applySavedTeamTheme } from "@/lib/team-theme";

export function TeamTheme() {
  useEffect(() => {
    applySavedTeamTheme();
    const sync = () => applySavedTeamTheme();
    window.addEventListener("storage", sync);
    window.addEventListener("fds-team-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fds-team-change", sync);
    };
  }, []);

  return null;
}
