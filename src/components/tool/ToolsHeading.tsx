export default function ToolsHeading({ firstPart, secondPart }: { firstPart: string; secondPart: string }) {
  return (
    <h1 className="absolute z-10 top-24 left-[calc(var(--sidebar-width,60px)+1rem)] right-4 mb-6 text-left text-2xl font-bold text-white transition-[left] duration-300">
      {firstPart}{" "}<span className="text-indigo-400">{secondPart}</span>
    </h1>
  );
}
