import { LayoutShell } from "@/components/layout-shell";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
