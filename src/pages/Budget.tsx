import { useNavigate, useSearchParams } from "react-router-dom";
import { BudgetList } from "../feature/transfers/BudgetList";
import { BudgetDetail } from "../feature/transfers/BudgetDetail";

export default function Budget() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const transferId = sp.get("transferId");

  if (transferId) {
    return (
      <BudgetDetail
        transferId={transferId}
        onBack={() => {
          const next = new URLSearchParams(sp);
          next.delete("transferId");
          navigate({ search: next.toString() }, { replace: false });
        }}
      />
    );
  }

  return (
    <BudgetList
      onView={(id) => {
        const next = new URLSearchParams(sp);
        next.set("transferId", id);
        navigate({ search: next.toString() }, { replace: false });
      }}
    />
  );
}
