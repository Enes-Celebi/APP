import { BallIcon, LampIcon, BicepIcon } from "../../presentation/icons/players";
import type { TeamSummary } from "./types";

function MiniCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base font-semibold text-gray-800">{value}</div>
    </div>
  );
}

function Stat({ icon, color, value }: { icon: React.ReactNode; color: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`text-2xl ${color}`}>{icon}</div>
      <div className="mt-1 text-sm text-gray-800">{value}</div>
    </div>
  );
}

export function TeamCard({
  team,
  onViewPlayers,
}: {
  team: TeamSummary;
  onViewPlayers: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="text-lg font-semibold text-gray-800">{team.name}</div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <MiniCount label="GK" value={team.counts.GK} />
        <MiniCount label="CB" value={team.counts.DF} /> {/* DF shown as CB per mock */}
        <MiniCount label="MD" value={team.counts.MD} />
        <MiniCount label="FW" value={team.counts.FW} />
      </div>

      <div className="mt-3 grid grid-cols-3 text-center">
        <Stat icon={<BallIcon />}  color="text-green-600"  value={team.avg.skill} />
        <Stat icon={<LampIcon />}  color="text-yellow-500" value={team.avg.tactic} />
        <Stat icon={<BicepIcon />} color="text-red-500"    value={team.avg.physical} />
      </div>

      <button
        className="mt-4 w-full rounded-xl bg-sky-100 py-2 text-sky-700 hover:bg-sky-200"
        onClick={onViewPlayers}
      >
        View players
      </button>
    </div>
  );
}
