import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "../../core/constants/palette";

export type FormModalProps = {
  open: boolean;
  title: string;

  // Optional input mode (default true). If false, custom children are shown instead.
  label?: string;
  placeholder?: string;
  initialValue?: string;
  inputAllowed?: boolean;

  // Buttons
  primaryText: string;
  secondaryText?: string;
  onPrimary: (value: string) => Promise<void> | void;
  onSecondary?: () => void;

  // Validation / processing
  validate?: (v: string) => string | null;
  sanitize?: (v: string) => string;

  // UX state
  loadingText?: string;
  busy?: boolean;                // disables buttons & shows spinner text in primary button
  primaryDisabled?: boolean;     // additional manual disable flag

  // Closing behavior
  onClose?: () => void;          // called by ✕, ESC, or overlay (if enabled)
  closeOnOverlay?: boolean;      // default true
  closeOnEsc?: boolean;          // default true

  // Custom content (when inputAllowed === false)
  children?: React.ReactNode;
};

export default function FormModal({
  open,
  title,
  label,
  placeholder,
  initialValue = "",
  inputAllowed = true,

  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,

  validate,
  sanitize,
  loadingText,
  busy = false,
  primaryDisabled = false,

  onClose,
  closeOnOverlay = true,
  closeOnEsc = true,

  children,
}: FormModalProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on open & focus input
  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialValue]);

  // ESC to close
  useEffect(() => {
    if (!open || !onClose || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, closeOnEsc]);

  const currentError = inputAllowed && validate ? validate(value) : null;
  const primaryBtnDisabled = busy || primaryDisabled || (!!currentError && inputAllowed);

  const handlePrimary = async () => {
    const v = sanitize ? sanitize(value) : value;
    if (inputAllowed && validate) {
      const err = validate(v);
      setError(err);
      if (err) return;
    }
    await onPrimary(v);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={() => {
        if (!busy && closeOnOverlay) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-[80%] max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()} // prevent overlay close
      >
        {/* Header */}
        <div className="border-b px-6 pb-3 pt-5" style={{ borderColor: "#eee" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: COLORS.primary }}>
              {title}
            </h2>
            {onClose && (
              <button
                aria-label="Close"
                className="rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600"
                onClick={onClose}
                disabled={busy}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {inputAllowed ? (
            <div className="max-w-md">
              {label && (
                <label className="mb-1 block text-sm font-medium" style={{ color: COLORS.primary }}>
                  {label}
                </label>
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className="w-[420px] max-w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                style={{
                  borderColor: error ? "#ef4444" : COLORS.primary,
                  boxShadow: "none",
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !primaryBtnDisabled) {
                    e.preventDefault();
                    handlePrimary();
                  }
                }}
              />
              {(error || currentError) && (
                <p className="mt-2 text-sm text-red-500">{error ?? currentError}</p>
              )}
            </div>
          ) : (
            <div className="py-2">{children}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          {secondaryText ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-11 rounded-lg border"
                onClick={onSecondary}
                disabled={busy}
                style={{ borderColor: COLORS.primary, color: COLORS.primary, background: "white" }}
              >
                {secondaryText}
              </button>
              <button
                type="button"
                className="h-11 rounded-lg text-white"
                onClick={handlePrimary}
                disabled={primaryBtnDisabled}
                style={{
                  background: primaryBtnDisabled ? "#cbd5e1" : COLORS.primary,
                  cursor: primaryBtnDisabled ? "not-allowed" : "pointer",
                }}
              >
                {busy ? loadingText ?? "Working…" : primaryText}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="h-11 w-full rounded-lg text-white"
              onClick={handlePrimary}
              disabled={primaryBtnDisabled}
              style={{
                background: primaryBtnDisabled ? "#cbd5e1" : COLORS.primary,
                cursor: primaryBtnDisabled ? "not-allowed" : "pointer",
              }}
            >
              {busy ? loadingText ?? "Working…" : primaryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
