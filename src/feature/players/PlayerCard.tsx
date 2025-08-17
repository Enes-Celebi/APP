import { AvatarIcon, BallIcon, LampIcon, BicepIcon } from "../../presentation/icons/players";
import type { Player, Listing } from "./types";

function Stat({ icon, color, value }: { icon: React.ReactNode; color: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`text-2xl ${color}`}>{icon}</div>
      <div className="mt-1 text-sm text-gray-800">{value}</div>
    </div>
  );
}

export function PlayerCard({
  player,
  isMine,
  listing,
  onList,
  onEdit,
  onUnlist,
  onBuy,
}: {
  player: Player;
  isMine: boolean;
  listing: Listing | null;
  onList: () => void;
  onEdit: () => void;
  onUnlist: () => void;
  onBuy: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <AvatarIcon />
        <div className="text-right text-xl font-bold text-yellow-500">{player.position}</div>
      </div>

      <div className="mt-3">
        <div className="text-lg font-semibold text-gray-800">{player.name}</div>
        <div className="text-sm text-gray-500">{player.team?.name ?? "—"}</div>
      </div>

      <div className="mt-3 grid grid-cols-3 text-center">
        <Stat icon={<BallIcon />} color="text-green-600" value={player.skill} />
        <Stat icon={<LampIcon />} color="text-yellow-500" value={player.tactic} />
        <Stat icon={<BicepIcon />} color="text-red-500" value={player.physical} />
      </div>

      <div className="mt-4 flex gap-2">
        {isMine && !listing && (
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-green-700 hover:bg-green-200"
            onClick={onList}
          >
            <span className="text-lg">🏷️</span> List
          </button>
        )}

        {isMine && listing && (
          <>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
              onClick={onUnlist}
            >
              <span className="text-lg">❌</span> Unlist
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-white hover:opacity-90"
              onClick={onEdit}
            >
              ✏️ Edit
            </button>
          </>
        )}

        {!isMine && listing && (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-white hover:opacity-90"
            onClick={onBuy}
          >
            💳 Buy
          </button>
        )}
      </div>

      {listing && (
        <div className="mt-2 text-center text-xs text-gray-500">
          Listed: ${(listing.askingPriceCents / 100).toLocaleString()}
        </div>
      )}
    </div>
  );
}
