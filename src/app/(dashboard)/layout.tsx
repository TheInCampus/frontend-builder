import { WorkspaceShell } from "@/components/ui/WorkspaceShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
