import Sidebar from "@/components/Sidebar";
import { Notebook } from "lucide-react";

const sidebarLinks = [
    {
        name: "Notes Tool",
        icon: <Notebook />,
        link: "/dashboard/med-alerts",
    },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative">
      <Sidebar items={sidebarLinks} />
      <div
        className="min-h-screen transition-[margin] duration-300"
        style={{ marginLeft: "var(--sidebar-width, 60px)" }}
      >
        {children}
      </div>
    </main>
  );
}