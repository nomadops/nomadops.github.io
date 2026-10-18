import React from "react";
/** .field — label, input/textarea, error line shown only after interaction (mirrors :user-invalid). */
export function Field({ id, label, type = "text", multiline = false, error, value, onChange, required = true, autoComplete }) {
  const [touched, setTouched] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const invalid = touched && !!error;
  const base = { minHeight: multiline ? 140 : 48, padding: "12px 14px", background: invalid ? "var(--error-bg)" : "var(--paper)", border: "1px solid " + (invalid ? "var(--error)" : focus ? "var(--text)" : "var(--input-line)"), borderRadius: 6, color: "var(--text)", font: "inherit", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.6, outline: focus ? "3px solid var(--focus)" : "none", outlineOffset: 1, resize: multiline ? "vertical" : undefined, width: "100%", boxSizing: "border-box" };
  const common = { id, value, onChange, required, autoComplete, style: base, onFocus: () => setFocus(true), onBlur: () => { setFocus(false); setTouched(true); }, "aria-invalid": invalid || undefined, "aria-errormessage": id + "-error" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-sans)", color: "var(--text)" }}>
      <label htmlFor={id} style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{label}</label>
      {multiline ? <textarea rows={5} {...common} /> : <input type={type} {...common} />}
      {invalid && <p id={id + "-error"} style={{ display: "flex", alignItems: "center", gap: 6, margin: 0, color: "var(--error)", fontSize: "0.9375rem" }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.75v3.75M8 11.25h.01" /></svg>{error}</p>}
    </div>
  );
}
