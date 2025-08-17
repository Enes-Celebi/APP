import { TagIcon, BriefcaseIcon, EyeIcon } from "../../presentation/icons/finance";
import { BallIcon, LampIcon, BicepIcon } from "../../presentation/icons/players";
import type { TransferListItem } from "./types";
import { money } from "../../utils/currency";

export function TransferRow({
  t,
  onView,
}: {
  t: TransferListItem;
  onView: () => void;
}) {
  const Kind = t.kind === "sell" ? TagIcon : BriefcaseIcon;

  const posColor = "text-yellow-500";
  const skillColor = "text-green-600";
  const tacticColor = "text-yellow-500";
  const physColor = "text-red-500";

  return (
    <div className="grid grid-cols-[28px_64px_1fr_80px_80px_80px_120px_44px] gap-3 items-center rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
      <div className={t.kind === "sell" ? "text-green-600" : "text-emerald-600"}>
        <Kind className="h-5 w-5" />
      </div>

      <div className={`font-bold ${posColor}`}>{t.position}</div>

      <div className="font-medium text-gray-800 truncate">{t.player.name}</div>

      <div className={`flex items-center gap-1 ${skillColor}`}>
        <BallIcon /> <span className="font-semibold">{t.skill}</span>
      </div>
      <div className={`flex items-center gap-1 ${tacticColor}`}>
        <LampIcon /> <span className="font-semibold">{t.tactic}</span>
      </div>
      <div className={`flex items-center gap-1 ${physColor}`}>
        <BicepIcon /> <span className="font-semibold">{t.physical}</span>
      </div>

      <div className="text-right font-semibold text-emerald-600">{money(t.soldPriceCents)}</div>

      <button
        className="inline-flex items-center justify-center rounded-xl bg-sky-100 p-2 text-sky-700 hover:bg-sky-200"
        onClick={onView}
        aria-label="View"
      >
        <EyeIcon />
      </button>
    </div>
  );
}
