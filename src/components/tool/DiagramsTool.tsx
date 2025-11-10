import ToolsHeading from "./ToolsHeading";

export default function DiagramsTool() {
  return (
    <section className="flex flex-col w-full px-3 pt-4 items-center min-h-full mt-[var(--navbar-height,64px)]">
      <ToolsHeading firstPart="Diagrams" secondPart="Tool" />
    </section>
  );
}