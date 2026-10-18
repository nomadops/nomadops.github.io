import React from "react";
import { Field } from "./Field.jsx";
import { Button } from "./Button.jsx";
/** .form — contact form card. onSubmit receives {name,email,message}. */
export function ContactForm({ onSubmit, style }) {
  const [v, setV] = React.useState({ name: "", email: "", message: "" });
  const [sent, setSent] = React.useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email);
  const errors = { name: v.name ? "" : "Enter your name.", email: emailOk ? "" : "Enter an email address, for example name@company.com.", message: v.message ? "" : "Enter a short message." };
  const submit = (e) => { e.preventDefault(); if (errors.name || errors.email || errors.message) { e.target.querySelectorAll("input,textarea").forEach((el) => { el.focus(); el.blur(); }); return; } setSent(true); onSubmit && onSubmit(v); };
  return (
    <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20, padding: "clamp(20px, 5vw, 32px)", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, fontFamily: "var(--font-sans)", color: "var(--text)", ...style }}>
      {sent ? <p style={{ margin: 0 }}>Thanks. We reply by email.</p> : <>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9375rem" }}>All fields are required.</p>
        <Field id="name" label="Name" autoComplete="name" value={v.name} onChange={set("name")} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={v.email} onChange={set("email")} error={errors.email} />
        <Field id="message" label="Message" multiline value={v.message} onChange={set("message")} error={errors.message} />
        <Button variant="dark" type="submit" style={{ alignSelf: "flex-start" }}>Send message</Button>
      </>}
    </form>
  );
}
