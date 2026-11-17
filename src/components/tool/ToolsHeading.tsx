export default function ToolsHeading({ firstPart, secondPart }: { firstPart: string; secondPart: string }) {
  return (
    <h1 className="w-full text-left text-2xl font-bold tracking-tight text-white sm:text-3xl">
      {firstPart}{" "}<span className="text-indigo-400">{secondPart}</span>
    </h1>
  );
}
