import React from "react";

/**
 * A small set of reusable UI primitives. Intentionally kept minimal.
 */

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export const styles = {
  colors: {
    primary: "#3b82f6",
    success: "#06b6d4",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    border: "#e5e7eb",
    subtleText: "#6b7280",
    danger: "#EF4444",
  },
  radius: 12,
  shadow: "0 1px 2px rgba(0,0,0,0.06), 0 6px 20px rgba(17,24,39,0.06)",
};

export function Container({ children }) {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 16px 48px",
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: styles.colors.surface,
        border: `1px solid ${styles.colors.border}`,
        borderRadius: styles.radius,
        boxShadow: styles.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  ...props
}) {
  const variantStyles = {
    primary: {
      background: styles.colors.primary,
      color: "white",
      border: `1px solid ${styles.colors.primary}`,
    },
    success: {
      background: styles.colors.success,
      color: "white",
      border: `1px solid ${styles.colors.success}`,
    },
    ghost: {
      background: "transparent",
      color: styles.colors.text,
      border: `1px solid ${styles.colors.border}`,
    },
    danger: {
      background: styles.colors.danger,
      color: "white",
      border: `1px solid ${styles.colors.danger}`,
    },
  }[variant];

  const sizeStyles = {
    sm: { padding: "8px 10px", fontSize: 13 },
    md: { padding: "10px 12px", fontSize: 14 },
    lg: { padding: "12px 14px", fontSize: 15 },
  }[size];

  return (
    <button
      {...props}
      style={{
        borderRadius: 10,
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.7 : 1,
        ...sizeStyles,
        ...variantStyles,
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <label style={{ display: "block", width: "100%" }}>
      {label ? (
        <div
          style={{
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: styles.colors.text,
          }}
        >
          {label}
        </div>
      ) : null}
      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? styles.colors.danger : styles.colors.border}`,
          outline: "none",
          fontSize: 14,
          color: styles.colors.text,
          background: "white",
          ...props.style,
        }}
      />
      {error ? (
        <div style={{ marginTop: 6, fontSize: 12, color: styles.colors.danger }}>
          {error}
        </div>
      ) : null}
    </label>
  );
}

export function TextArea({ label, error, ...props }) {
  return (
    <label style={{ display: "block", width: "100%" }}>
      {label ? (
        <div
          style={{
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: styles.colors.text,
          }}
        >
          {label}
        </div>
      ) : null}
      <textarea
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${error ? styles.colors.danger : styles.colors.border}`,
          outline: "none",
          fontSize: 14,
          color: styles.colors.text,
          background: "white",
          minHeight: 240,
          resize: "vertical",
          ...props.style,
        }}
      />
      {error ? (
        <div style={{ marginTop: 6, fontSize: 12, color: styles.colors.danger }}>
          {error}
        </div>
      ) : null}
    </label>
  );
}

export function InlineMessage({ kind = "info", children }) {
  const map = {
    info: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
    error: { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c" },
    success: { bg: "#ecfeff", border: "#a5f3fc", text: "#0e7490" },
  };
  const s = map[kind] || map.info;

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}
