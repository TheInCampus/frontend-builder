import { WorkspaceShell } from "@/components/ui/WorkspaceShell";

export default function AppWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
