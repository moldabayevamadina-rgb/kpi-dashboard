import { useMemo, useState } from "react";
import { Layout, type TabId } from "./components/Layout";
import { initialEmployees } from "./data/mockEmployees";
import { initialProjects } from "./data/projects";
import { initialOpenQuestions } from "./data/openQuestions";
import type { Employee, OpenQuestion, Project } from "./types";
import { withCombinedLoad } from "./lib/calculations";
import { Overview } from "./components/tabs/Overview";
import { Workload } from "./components/tabs/Workload";
import { Productivity } from "./components/tabs/Productivity";
import { RisksProcesses } from "./components/tabs/RisksProcesses";
import { Projects } from "./components/tabs/Projects";
import { OpenQuestions } from "./components/tabs/OpenQuestions";
import { EmployeeRegistry } from "./components/tabs/EmployeeRegistry";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [openQuestions, setOpenQuestions] = useState<OpenQuestion[]>(initialOpenQuestions);

  const employeesWithLoad = useMemo(
    () => withCombinedLoad(employees, projects, openQuestions),
    [employees, projects, openQuestions]
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "overview" && <Overview employees={employeesWithLoad} />}
      {activeTab === "workload" && <Workload employees={employeesWithLoad} />}
      {activeTab === "productivity" && <Productivity employees={employeesWithLoad} />}
      {activeTab === "risks" && <RisksProcesses employees={employeesWithLoad} />}
      {activeTab === "projects" && (
        <Projects projects={projects} employees={employees} onChange={setProjects} />
      )}
      {activeTab === "questions" && (
        <OpenQuestions questions={openQuestions} employees={employees} onChange={setOpenQuestions} />
      )}
      {activeTab === "registry" && (
        <EmployeeRegistry employees={employees} onChange={setEmployees} />
      )}
    </Layout>
  );
}
