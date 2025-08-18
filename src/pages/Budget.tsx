import { useSearchParams } from "react-router-dom";
import { useMe } from "../feature/players/api";
import { LoginPrompt } from "../presentation/auth/LoginPrompt";
import { BudgetList } from "../feature/transfers/BudgetList";
import { BudgetDetail } from "../feature/transfers/BudgetDetail";

export default function Budget() {
  const { data } = useMe();
  const authed = !!data?.team || !!data?.id || !!data?.user;

  const [sp, setSp] = useSearchParams();
  const transferId = sp.get("transferId");

  if (!authed) {
    return (
      <div className="p-2">
        <h1 className="mb-3 text-2xl font-semibold">Transactions</h1>
        <LoginPrompt inline message="Sign in to view your transactions and balances." />
      </div>
    );
  }

  if (transferId) {
    return (
      <BudgetDetail
        transferId={transferId}
        onBack={() => {
          const next = new URLSearchParams(sp);
          next.delete("transferId");
          setSp(next, { replace: true });
        }}
      />
    );
  }

  return (
    <BudgetList
      onView={(id) => {
        const next = new URLSearchParams(sp);
        next.set("transferId", id);
        setSp(next, { replace: false });
      }}
    />
  );
}
