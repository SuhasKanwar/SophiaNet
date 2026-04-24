export default function ToolsHeading({ firstPart, secondPart }: { firstPart: string; secondPart: string }) {
    return (
        <h2 className="absolute z-10 top-24 transition-[margin] duration-300 left-[calc(var(--sidebar-width)+1rem)] text-white text-2xl font-bold mb-6">
            {firstPart}{" "}<span className="text-indigo-400">{secondPart}</span>
        </h2>
    );
}