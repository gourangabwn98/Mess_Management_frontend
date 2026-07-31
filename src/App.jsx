import { useCallback, useEffect, useState } from "react";
import { LayoutGrid, Users, Wallet, Receipt, UtensilsCrossed } from "lucide-react";
import Header from "./components/Header";
import MonthPicker from "./components/MonthPicker";
import Dashboard from "./components/Dashboard";
import MembersTab from "./components/MembersTab";
import PaymentsTab from "./components/PaymentsTab";
import ExpensesTab from "./components/ExpensesTab";
import MenuTab from "./components/MenuTab";
import { TabButton } from "./components/ui";
import { membersApi } from "./api";
import { monthKey } from "./utils";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [month, setMonth] = useState(monthKey(new Date()));
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  const refreshMembers = useCallback(async () => {
    try {
      const list = await membersApi.list();
      setMembers(list);
      setError("");
    } catch (e) {
      setError("Can't reach the server — is the backend running?");
    }
  }, []);

  useEffect(() => {
    refreshMembers();
  }, [refreshMembers]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header error={error} />

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          <TabButton icon={LayoutGrid} label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
          <TabButton icon={Users} label="Members" active={tab === "members"} onClick={() => setTab("members")} />
          <TabButton icon={Wallet} label="Payments" active={tab === "payments"} onClick={() => setTab("payments")} />
          <TabButton icon={Receipt} label="Expenses" active={tab === "expenses"} onClick={() => setTab("expenses")} />
          <TabButton icon={UtensilsCrossed} label="Menu" active={tab === "menu"} onClick={() => setTab("menu")} />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {(tab === "dashboard" || tab === "payments" || tab === "expenses") && (
          <MonthPicker month={month} setMonth={setMonth} />
        )}

        {tab === "dashboard" && <Dashboard month={month} members={members} />}
        {tab === "members" && <MembersTab members={members} refreshMembers={refreshMembers} />}
        {tab === "payments" && <PaymentsTab month={month} members={members} />}
        {tab === "expenses" && <ExpensesTab month={month} />}
        {tab === "menu" && <MenuTab />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 pt-4 text-xs text-muted font-body">
        Mess Manager · data is stored in your own MongoDB database.
      </footer>
    </div>
  );
}
