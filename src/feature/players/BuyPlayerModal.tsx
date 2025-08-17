import FormModal from "../../presentation/components/FormModal";
import { AvatarIcon, BallIcon, LampIcon, BicepIcon } from "../../presentation/icons/players";
import type { Player, Listing } from "./types";

export function BuyPlayerModal({
  open,
  player,
  listing,
  myBudgetCents,
  myRosterCount,
  trpcError,
  onClose,
  onPay,
}: {
  open: boolean;
  player?: Player;
  listing?: Listing;
  myBudgetCents: number;
  myRosterCount: number;
  trpcError?: string;
  onClose: () => void;
  onPay: () => void;
}) {
  if (!player || !listing) return null;

  const payCents = Math.floor(listing.askingPriceCents * 0.95);
  const enoughBudget = myBudgetCents >= payCents;
  const rosterOK = myRosterCount < 25;
  const canBuy = enoughBudget && rosterOK;

  return (
    <FormModal
      open={open}
      title={`Buy ${player.name}`}
      inputAllowed={false}
      primaryText={`Pay ${(payCents / 100).toLocaleString()}`}
      secondaryText="Cancel"
      primaryDisabled={!canBuy}
      onPrimary={() => onPay()}
      onSecondary={onClose}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* mini player card */}
        <div className="rounded-xl border p-3">
          <div className="flex items-start justify-between">
            <AvatarIcon />
            <div className="text-xl font-bold text-yellow-500">{player.position}</div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-semibold text-gray-800">{player.name}</div>
            <div className="text-sm text-gray-500">{player.team?.name ?? "—"}</div>
          </div>
          <div className="mt-2 grid grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl text-green-600"><BallIcon /></div>
              <div className="mt-1 text-sm text-gray-800">{player.skill}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl text-yellow-500"><LampIcon /></div>
              <div className="mt-1 text-sm text-gray-800">{player.tactic}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl text-red-500"><BicepIcon /></div>
              <div className="mt-1 text-sm text-gray-800">{player.physical}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <div>Asking: ${(listing.askingPriceCents / 100).toLocaleString()}</div>
          <div>You pay (95%): {(payCents / 100).toLocaleString()}</div>
        </div>

        {(!canBuy || trpcError) && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {!enoughBudget && <div>Insufficient budget for 95% price.</div>}
            {!rosterOK && <div>Roster full (25). Sell a player first.</div>}
            {trpcError && <div>{trpcError}</div>}
          </div>
        )}
      </div>
    </FormModal>
  );
}
