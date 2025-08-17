import { useState } from "react";
import FormModal from "../../presentation/components/FormModal";

export function ListPriceModal({
  open,
  title,
  defaultPriceCents,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  defaultPriceCents?: number;
  onClose: () => void;
  onSave: (priceCents: number) => void;
}) {
  const [dollars, setDollars] = useState(
    defaultPriceCents ? String(defaultPriceCents / 100) : ""
  );

  return (
    <FormModal
      open={open}
      title={title}
      label="Price (USD)"
      placeholder="100000"
      initialValue={dollars}
      inputAllowed
      primaryText="Save"
      secondaryText="Cancel"
      onPrimary={(v) => {
        const cents = Math.round(Number((v || "").replace(/[, ]/g, "")) * 100);
        if (cents > 0) onSave(cents);
      }}
      onSecondary={onClose}
      onClose={onClose}
      validate={(v) => {
        const n = Number((v || "").replace(/[, ]/g, ""));
        return !Number.isFinite(n) || n <= 0 ? "Enter a positive number" : null;
      }}
      sanitize={(v) => v.trim()}
    />
  );
}
