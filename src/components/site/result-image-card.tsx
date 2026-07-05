"use client";

import * as React from "react";
import { toPng } from "html-to-image";
import { GraduationCap, Award, Building2, Hash, IdCard, CalendarDays, CheckCircle2, AlertTriangle } from "lucide-react";
import type { StudentResult } from "@/lib/types";
import { gpaColor, formatDate, ordinal } from "@/lib/grade";
import { cn } from "@/lib/utils";

/**
 * A beautiful result card designed for image export.
 * Renders as a 800px wide card with the site branding, student info,
 * GPA/CGPA, result status, and all semester results.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   <ResultImageCard ref={ref} results={results} />
 *   const dataUrl = await toPng(ref.current, { quality: 0.95, pixelRatio: 2 });
 */
export const ResultImageCard = React.forwardRef<
  HTMLDivElement,
  { results: StudentResult[] }
>(({ results }, ref) => {
  if (!results || results.length === 0) return null;
  const latest = results[results.length - 1];
  const passed = results.filter((r) => r.result === "PASSED");
  const cgpa =
    passed.length > 0
      ? Math.round((passed.reduce((a, b) => a + b.gpa, 0) / passed.length) * 100) / 100
      : 0;
  const referredCount = results.filter((r) => r.result === "REFERRED").length;
  const gpa = typeof latest.gpa === "number" ? latest.gpa : 0;
  const grade = latest.letterGrade || (gpa >= 4 ? "A+" : gpa >= 3.5 ? "A" : gpa >= 3 ? "A-" : gpa >= 2.5 ? "B" : gpa >= 2 ? "C" : gpa > 0 ? "D" : "F");

  return (
    <div
      ref={ref}
      style={{
        width: 800,
        background: "linear-gradient(135deg, #2A3990 0%, #1a2350 100%)",
        padding: 32,
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={28} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>Diploma Result BD</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Verified Result Card</div>
          </div>
        </div>
        <div style={{
          padding: "6px 16px", borderRadius: 20,
          background: latest.result === "PASSED" ? "#2ECC71" : referredCount > 0 ? "#f59e0b" : "#ef4444",
          fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
        }}>
          {latest.result === "PASSED" ? <CheckCircle2 size={16} color="#fff" /> : <AlertTriangle size={16} color="#fff" />}
          {latest.result === "PASSED" ? "PASSED" : latest.result === "REFERRED" ? "REFERRED" : "FAILED"}
        </div>
      </div>

      {/* Student info card */}
      <div style={{
        background: "rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{latest.name || "Student Name"}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              {latest.departmentName || latest.curriculum || "Diploma in Engineering"}
            </div>
          </div>
          {/* CGPA badge */}
          <div style={{
            width: 80, height: 80, borderRadius: 16,
            background: latest.result === "PASSED" ? "rgba(46, 204, 113, 0.2)" : "rgba(239, 68, 68, 0.2)",
            border: "2px solid " + (latest.result === "PASSED" ? "#2ECC71" : "#ef4444"),
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#2ECC71" }}>
              {latest.result === "REFERRED" ? "REF" : cgpa.toFixed(2)}
            </div>
            <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>CGPA</div>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <InfoItem label="Roll" value={latest.roll} />
          <InfoItem label="Registration" value={latest.registrationNo} />
          <InfoItem label="Institute" value={latest.instituteName} />
          <InfoItem label="Session" value={latest.batchLabel} />
        </div>
      </div>

      {/* Semester results */}
      {results.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, opacity: 0.9 }}>
            Semester Results ({results.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.map((r, i) => {
              const rGpa = typeof r.gpa === "number" ? r.gpa : 0;
              const rPassed = r.result === "PASSED";
              const rReferred = r.result === "REFERRED";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "10px 16px",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: rPassed ? "rgba(46, 204, 113, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: rPassed ? "#2ECC71" : "#ef4444",
                  }}>
                    {r.examYear ? String(r.examYear).slice(-2) : "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      Result of {r.examYear || "—"}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>
                      {r.batchLabel ? `Session ${r.batchLabel}` : "Diploma Exam"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: 20, fontWeight: 800,
                      color: rReferred ? "#f59e0b" : rPassed ? "#2ECC71" : "#ef4444",
                    }}>
                      {rReferred ? "REF" : rGpa.toFixed(2)}
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: 6,
                    background: rPassed ? "#2ECC71" : rReferred ? "#f59e0b" : "#ef4444",
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {rPassed ? "PASS" : rReferred ? "REF" : "FAIL"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Referred subjects */}
      {latest.referredSubjects && latest.referredSubjects.length > 0 ? (
        <div style={{
          background: "rgba(245, 158, 11, 0.15)",
          borderRadius: 12, padding: 16, marginBottom: 20,
          border: "1px solid rgba(245, 158, 11, 0.3)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>
            ⚠ {latest.referredSubjects.length} Subject(s) Yet to Pass
          </div>
          {latest.referredSubjects.map((sub, i) => (
            <div key={i} style={{ fontSize: 12, color: "#fbbf24", marginBottom: 4 }}>
              • {sub}
            </div>
          ))}
        </div>
      ) : null}

      {/* Footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 16,
      }}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          Generated on {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#2ECC71" }}>
          diplomaresultbd.com
        </div>
      </div>
    </div>
  );
});

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, opacity: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{value || "—"}</div>
    </div>
  );
}

/**
 * Hook to download a result card as a PNG image.
 */
export function useResultImageDownload() {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const downloadImage = React.useCallback(async (filename: string) => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#2A3990",
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Image download failed:", e);
    }
  }, []);

  return { cardRef, downloadImage };
}
