import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "../../core/constants/palette";

export type FormModalProps = {
  open: boolean;
  title: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  primaryText: string;
  secondaryText?: string;
  onPrimary: (value: string) => Promise<void> | void;
  onSecondary?: () => void;
  validate?: (v: string) => string | null;
  sanitize?: (v: string) => string;
  loadingText?: string;
  busy?: boolean; // disables buttons & shows spinner in primary button
  inputAllowed?: boolean; // set false to show custom children content
  children?: React.ReactNode; // custom content instead of input
};

export default function FormModal({
  open,
  title,
  label,
  placeholder,
  initialValue = "",
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
  validate,
  sanitize,
  loadingText,
  busy = false,
  inputAllowed = true,
  children,
}: FormModalProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
      // focus after open
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialValue]);

  const currentError = inputAllowed && validate ? validate(value) : null;
  const disabled = busy || (!!currentError && inputAllowed);

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
    >
      <div
        className="w-[80%] max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Title */}
        <div className="px-6 pt-5 pb-3 border-b" style={{ borderColor: "#eee" }}>
          <h2 className="text-xl font-semibold" style={{ color: COLORS.primary }}>
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {inputAllowed ? (
            <div className="max-w-md">
              {label && (
                <label className="block text-sm font-medium mb-1" style={{ color: COLORS.primary }}>
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
              />
              {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
            </div>
          ) : (
            <div className="py-2">{children}</div>
          )}
        </div>

        {/* Footer buttons */}
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
                disabled={disabled}
                style={{
                  background: disabled ? "#cbd5e1" : COLORS.primary,
                  cursor: disabled ? "not-allowed" : "pointer",
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
              disabled={disabled}
              style={{
                background: disabled ? "#cbd5e1" : COLORS.primary,
                cursor: disabled ? "not-allowed" : "pointer",
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
