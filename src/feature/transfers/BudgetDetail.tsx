import { useTransferDetail } from "./api";
import { TransferDetailCard } from "./TransferDetailCard";

export function BudgetDetail({
  transferId,
  onBack,
}: {
  transferId: string;
  onBack: () => void;
}) {
  const detail = useTransferDetail(transferId);

  if (detail.isLoading) return <div className="p-2">Loading transaction…</div>;
  if (detail.isError || !detail.data) return <div className="p-2 text-red-600">Transaction not found.</div>;

  return (
    <div className="p-2">
      <h1 className="mb-3 text-2xl font-semibold">Transaction</h1>
      <TransferDetailCard
        t={detail.data}
        backButton={
          <button
            className="rounded-lg border px-3 py-1 text-gray-700 hover:bg-gray-50"
            onClick={onBack}
          >
            ← Back to Transactions
          </button>
        }
      />
    </div>
  );
}
