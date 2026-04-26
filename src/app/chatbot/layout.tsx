import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Notebook, YoutubeIcon } from "lucide-react";

const sidebarLinks = [
	{
		name: "Notes Tool",
		icon: <Notebook />,
		link: "/chatbot/t/notes-tool",
	},
	{
		name: "Youtube Video Tool",
		icon: <YoutubeIcon />,
		link: "/chatbot/t/youtube-video-tool",
	},
	{
		name: "Diagrams Tool",
		icon: <Notebook />,
		link: "/chatbot/t/diagrams-tool",
	}
	// {
	// 	name: "Image Filter Tool",
	// 	icon: <ImageIcon />,
	// 	link: "/chatbot/t/image-filter-tool",
	// }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="relative flex flex-col min-h-screen overflow-hidden">
			<Navbar />
			<Sidebar items={sidebarLinks} />
			<div
				className="flex flex-col flex-1 min-h-[90vh] overflow-hidden transition-[margin] duration-300"
				style={{ marginLeft: "var(--sidebar-width, 60px)" }}
			>
				{children}
			</div>
		</main>
	);
}