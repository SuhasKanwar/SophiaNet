import DiagramsTool from "@/components/tool/DiagramsTool";
import ImageFilterTool from "@/components/tool/ImageFilterTool";
import NotesTool from "@/components/tool/NotesTool";
import YoutubeVideoTool from "@/components/tool/YoutubeVideoTool";

export default async function ToolPage({ params }: { params: { tool: string } }) {
    const tool = (await params).tool;
    switch (tool) {
        case "notes-tool":
            return <NotesTool />;
        case "youtube-video-tool":
            return <YoutubeVideoTool />;
        case "diagrams-tool":
            return <DiagramsTool />;
        case "image-filter-tool":
            return <ImageFilterTool />;
        default:
            return;
    }
}