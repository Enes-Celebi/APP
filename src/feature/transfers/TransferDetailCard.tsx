import { TagIcon } from "../../presentation/icons/finance";
import { AvatarIcon, BallIcon, LampIcon, BicepIcon } from "../../presentation/icons/players";
import type { TransferDetail } from "./types";
import { money } from "../../utils/currency";

export function TransferDetailCard({
  t,
  backButton,
}: {
  t: TransferDetail;
  backButton: React.ReactNode;
}) {
  // choose perspective balances
  const balBefore = t.youAreBuyer ? t.buyerBalanceBefore : t.sellerBalanceBefore;
  const balAfter = t.youAreBuyer ? t.buyerBalanceAfter : t.sellerBalanceAfter;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-100 p-3"><AvatarIcon /></div>
          <div>
            <div className="text-sm font-bold text-yellow-500">{t.position}</div>
            <div className="text-lg font-semibold text-gray-900">{t.player.name}</div>
            <div className="mt-2 flex gap-6">
              <div className="flex items-center gap-1 text-green-600"><BallIcon /> <span className="font-semibold">{t.skill}</span></div>
              <div className="flex items-center gap-1 text-yellow-500"><LampIcon /> <span className="font-semibold">{t.tactic}</span></div>
              <div className="flex items-center gap-1 text-red-500"><BicepIcon /> <span className="font-semibold">{t.physical}</span></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-600">
          <TagIcon className="h-4 w-4" />
          <span className="text-sm font-semibold">Sold</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div>
          <div className="text-xs uppercase text-gray-400">Seller</div>
          <div className="text-sm font-medium text-gray-800">{t.youAreSeller ? "You" : t.sellerTeamName}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Buyer</div>
          <div className="text-sm font-medium text-gray-800">{t.youAreBuyer ? "You" : t.buyerTeamName}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Asking Price</div>
          <div className="text-sm font-medium text-gray-800">{money(t.askingPriceCents)}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Sold Price</div>
          <div className="text-sm font-semibold text-emerald-600">{money(t.soldPriceCents)}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase text-gray-400">Balance Before</div>
          <div className="text-sm font-medium text-gray-800">{money(balBefore)}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Balance After</div>
          <div className="text-sm font-medium text-gray-800">{money(balAfter)}</div>
        </div>
      </div>

      <div className="mt-6">{backButton}</div>
    </div>
  );
}
