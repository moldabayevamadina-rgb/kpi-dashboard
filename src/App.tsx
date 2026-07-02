import { useState } from "react";
import { Layout, type TabId } from "./components/Layout";
import { initialEmployees } from "./data/mockEmployees";
import type { Employee } from "./types";
import { Overview } from "./components/tabs/Overview";
import { Workload } from "./components/tabs/Workload";
import { Productivity } from "./components/tabs/Productivity";
import { RisksProcesses } from "./components/tabs/RisksProcesses";
import { EmployeeRegistry } from "./components/tabs/EmployeeRegistry";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && <Overview employees={employees} />}
      {activeTab === "workload" && <Workload employees={employees} />}
      {activeTab === "productivity" && <Productivity employees={employees} />}
      {activeTab === "risks" && <RisksProcesses employees={employees} />}
      {activeTab === "registry" && (
        <EmployeeRegistry employees={employees} onChange={setEmployees} />
      )}
    </Layout>
  );
}
